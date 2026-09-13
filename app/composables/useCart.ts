// composables/useCart.ts

export interface CartItem {
  id: string | number;
  productId?: string | number;
  title: string;
  shortTitle?: string;
  author?: string;
  price: number;
  image?: string;
  format?: string;
  category?: string;
  stock?: number;
  quantity: number;
}

const API_URL = "http://localhost:8000";

export const useCart = () => {
  const cart = useState<CartItem[]>("lumina-cart", () => []);

  const cartCount = computed(() => {
    return cart.value.reduce((total, item) => total + item.quantity, 0);
  });

  const saveCart = () => {
    if (!import.meta.client) return;

    localStorage.setItem("lumina-cart", JSON.stringify(cart.value));
  };

  const getProductKey = (
    product: Pick<CartItem, "id" | "productId" | "title" | "author" | "format">,
  ) => {
    return String(
      product.productId ??
        product.id ??
        `${product.title}|${product.author || ""}`,
    );
  };

  const getCartKey = (item: CartItem) => {
    const productKey = item.productId
      ? String(item.productId)
      : `${item.title}|${item.author || ""}`;

    return `${productKey}::${item.format || ""}`;
  };

  const consolidateCart = (items: CartItem[]) => {
    const consolidated = new Map<string, CartItem>();

    for (const item of items) {
      const key = getCartKey(item);
      const existingItem = consolidated.get(key);

      if (existingItem) {
        existingItem.quantity += Number(item.quantity) || 0;
      } else {
        consolidated.set(key, {
          ...item,
          price: Number(item.price),
          quantity: Number(item.quantity) || 1,
        });
      }
    }

    return Array.from(consolidated.values());
  };

  const findCartItem = (id: string | number, format?: string) => {
    return cart.value.find(
      (item) =>
        String(item.id) === String(id) && (!format || item.format === format),
    );
  };

  const loadCart = async () => {
    if (!import.meta.client) return;

    try {
      const serverCart = await $fetch<CartItem[]>(`${API_URL}/cart`);
      if (serverCart && Array.isArray(serverCart)) {
        const books = await $fetch<any[]>(`${API_URL}/books`);
        const bookMap = new Map(books.map((book) => [String(book.id), book]));
        cart.value = consolidateCart(
          serverCart.map((item) => ({
            ...item,
            stock: bookMap.get(String(item.productId ?? item.id))?.stock,
          })),
        );
        saveCart();
        return;
      }
    } catch (error) {
      console.error("Failed to load cart from server:", error);
    }

    // Fallback to localStorage
    const savedCart = localStorage.getItem("lumina-cart");
    if (savedCart) {
      try {
        cart.value = consolidateCart(JSON.parse(savedCart));
      } catch (error) {
        console.error("Failed to load cart from localStorage:", error);
        cart.value = [];
      }
    }
  };

  const addToCart = async (product: any) => {
    const hasStockLimit = product.stock !== undefined && product.stock !== null;
    const availableStock = hasStockLimit
      ? Math.max(0, Number(product.stock) || 0)
      : Number.POSITIVE_INFINITY;
    if (availableStock === 0)
      return { success: false, message: "This book is out of stock." };

    const existingItem = cart.value.find(
      (item) =>
        getCartKey(item) ===
          `${getProductKey(product)}::${product.format || ""}` ||
        (!item.productId &&
          item.title === product.title &&
          item.author === product.author &&
          item.format === product.format),
    );

    if (existingItem && existingItem.quantity >= availableStock) {
      return {
        success: false,
        message: `Only ${availableStock} ${availableStock === 1 ? "copy" : "copies"} available.`,
      };
    }

    const payload: CartItem = {
      id: product.id,
      productId: product.id,
      title: product.title,
      shortTitle: product.shortTitle,
      author: product.author,
      price: Number(product.price),
      image: product.image,
      format: product.format,
      category: product.category,
      stock: Number.isFinite(availableStock) ? availableStock : undefined,
      quantity: 1,
    };

    try {
      if (existingItem) {
        existingItem.quantity += 1;
        await $fetch(`${API_URL}/cart/${existingItem.id}`, {
          method: "PATCH",
          body: { quantity: existingItem.quantity },
        });
      } else {
        const newItem = await $fetch<CartItem>(`${API_URL}/cart`, {
          method: "POST",
          body: payload,
        });
        cart.value.push(newItem);
      }

      saveCart();
      return { success: true, message: "Added to cart." };
    } catch (error) {
      console.error("Failed to add to cart:", error);
      if (!existingItem) {
        cart.value.push(payload);
      }
      saveCart();
      return {
        success: false,
        message: "Unable to save this item to your cart.",
      };
    }
  };

  const increaseQuantity = async (id: string | number, format?: string) => {
    const item = findCartItem(id, format);

    if (!item) return false;

    if (!Number.isFinite(Number(item.stock))) {
      try {
        const book = await $fetch<any>(
          `${API_URL}/books/${item.productId ?? item.id}`,
        );
        item.stock = Math.max(0, Number(book.stock) || 0);
      } catch (error) {
        console.error("Failed to load book stock:", error);
      }
    }

    const stock = Number(item.stock);
    if (Number.isFinite(stock) && stock >= 0 && item.quantity >= stock)
      return false;

    item.quantity += 1;

    try {
      await $fetch(`${API_URL}/cart/${id}`, {
        method: "PATCH",
        body: { quantity: item.quantity },
      });
    } catch (error) {
      console.error("Failed to update quantity:", error);
    }

    saveCart();
    return true;
  };

  const decreaseQuantity = async (id: string | number, format?: string) => {
    const item = findCartItem(id, format);

    if (!item) return;

    if (item.quantity > 1) {
      item.quantity -= 1;
      try {
        await $fetch(`${API_URL}/cart/${id}`, {
          method: "PATCH",
          body: { quantity: item.quantity },
        });
      } catch (error) {
        console.error("Failed to update quantity:", error);
      }
      saveCart();
    } else {
      await removeFromCart(id, format);
    }
  };

  const removeFromCart = async (id: string | number, format?: string) => {
    const item = findCartItem(id, format);
    if (!item) return;

    cart.value = cart.value.filter((cartItem) => cartItem !== item);

    try {
      await $fetch(`${API_URL}/cart/${item.id}`, {
        method: "DELETE",
      });
    } catch (error) {
      console.error("Failed to remove from cart:", error);
    }

    saveCart();
  };

  const clearCart = async () => {
    cart.value = [];

    try {
      await $fetch(`${API_URL}/cart`, {
        method: "DELETE",
      });
    } catch (error) {
      console.error("Failed to clear cart:", error);
    }

    saveCart();
  };

  return {
    cart,
    cartCount,
    addToCart,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    clearCart,
    loadCart,
  };
};
