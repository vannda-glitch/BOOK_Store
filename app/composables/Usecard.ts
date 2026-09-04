// composables/useCart.ts

export interface CartItem {
  id: string | number
  title: string
  shortTitle?: string
  author?: string
  price: number
  image?: string
  quantity: number
}

export const useCart = () => {
  // =========================================
  // Shared Cart State
  // =========================================

  const cart = useState<CartItem[]>('lumina-cart', () => [])

  // =========================================
  // Cart Count
  // =========================================

  const cartCount = computed(() => {
    return cart.value.reduce(
      (total, item) => total + item.quantity,
      0
    )
  })

  // =========================================
  // Save Cart
  // =========================================

  const saveCart = () => {
    if (!import.meta.client) return

    localStorage.setItem(
      'lumina-cart',
      JSON.stringify(cart.value)
    )
  }

  // =========================================
  // Load Cart
  // =========================================

  const loadCart = () => {
    if (!import.meta.client) return

    const savedCart = localStorage.getItem('lumina-cart')

    if (!savedCart) return

    try {
      cart.value = JSON.parse(savedCart)
    } catch (error) {
      console.error('Failed to load cart:', error)
      cart.value = []
    }
  }

  // =========================================
  // Add To Cart
  // =========================================

  const addToCart = (book: any) => {
    const existingItem = cart.value.find(
      item => String(item.id) === String(book.id)
    )

    if (existingItem) {
      existingItem.quantity += 1
    } else {
      cart.value.push({
        id: book.id,
        title: book.title,
        shortTitle: book.shortTitle,
        author: book.author,
        price: Number(book.price),
        image: book.image,
        quantity: 1
      })
    }

    saveCart()
  }

  // =========================================
  // Increase Quantity
  // =========================================

  const increaseQuantity = (id: string | number) => {
    const item = cart.value.find(
      item => String(item.id) === String(id)
    )

    if (!item) return

    item.quantity += 1

    saveCart()
  }

  // =========================================
  // Decrease Quantity
  // =========================================

  const decreaseQuantity = (id: string | number) => {
    const item = cart.value.find(
      item => String(item.id) === String(id)
    )

    if (!item) return

    if (item.quantity > 1) {
      item.quantity -= 1
    } else {
      removeFromCart(id)
      return
    }

    saveCart()
  }

  // =========================================
  // Remove From Cart
  // =========================================

  const removeFromCart = (id: string | number) => {
    cart.value = cart.value.filter(
      item => String(item.id) !== String(id)
    )

    saveCart()
  }

  // =========================================
  // Clear Cart
  // =========================================

  const clearCart = () => {
    cart.value = []

    saveCart()
  }

  return {
    cart,
    cartCount,
    addToCart,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    clearCart,
    loadCart
  }
}