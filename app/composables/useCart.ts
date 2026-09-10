// composables/useCart.ts

export interface CartItem {
  id: string | number
  productId?: string | number
  title: string
  shortTitle?: string
  author?: string
  price: number
  image?: string
  format?: string
  category?: string
  quantity: number
}

const API_URL = 'http://localhost:8000'

export const useCart = () => {

  const cart = useState<CartItem[]>('lumina-cart', () => [])

  const cartCount = computed(() => {
    return cart.value.reduce(
      (total, item) => total + item.quantity,
      0
    )
  })

  const saveCart = () => {
    if (!import.meta.client) return

    localStorage.setItem(
      'lumina-cart',
      JSON.stringify(cart.value)
    )
  }

  const getProductKey = (product: Pick<CartItem, 'id' | 'productId' | 'title' | 'author' | 'format'>) => {
    return String(product.productId ?? product.id ?? `${product.title}|${product.author || ''}`)
  }

  const getCartKey = (item: CartItem) => {
    const productKey = item.productId
      ? String(item.productId)
      : `${item.title}|${item.author || ''}`

    return `${productKey}::${item.format || ''}`
  }

  const consolidateCart = (items: CartItem[]) => {
    const consolidated = new Map<string, CartItem>()

    for (const item of items) {
      const key = getCartKey(item)
      const existingItem = consolidated.get(key)

      if (existingItem) {
        existingItem.quantity += Number(item.quantity) || 0
      } else {
        consolidated.set(key, {
          ...item,
          price: Number(item.price),
          quantity: Number(item.quantity) || 1
        })
      }
    }

    return Array.from(consolidated.values())
  }

  const findCartItem = (id: string | number, format?: string) => {
    return cart.value.find(item =>
      String(item.id) === String(id) && (!format || item.format === format)
    )
  }

  const loadCart = async () => {
    if (!import.meta.client) return

    try {
      const serverCart = await $fetch<CartItem[]>(`${API_URL}/cart`)
      if (serverCart && Array.isArray(serverCart)) {
        cart.value = consolidateCart(serverCart)
        saveCart()
        return
      }
    } catch (error) {
      console.error('Failed to load cart from server:', error)
    }

    // Fallback to localStorage
    const savedCart = localStorage.getItem('lumina-cart')
    if (savedCart) {
      try {
        cart.value = consolidateCart(JSON.parse(savedCart))
      } catch (error) {
        console.error('Failed to load cart from localStorage:', error)
        cart.value = []
      }
    }
  }

  const addToCart = async (product: any) => {
    const existingItem = cart.value.find(
      item => getCartKey(item) === `${getProductKey(product)}::${product.format || ''}` ||
        (!item.productId && item.title === product.title && item.author === product.author && item.format === product.format)
    )

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
      quantity: 1
    }

    try {
      if (existingItem) {
        existingItem.quantity += 1
        await $fetch(`${API_URL}/cart/${existingItem.id}`, {
          method: 'PATCH',
          body: { quantity: existingItem.quantity }
        })
      } else {
        const newItem = await $fetch<CartItem>(`${API_URL}/cart`, {
          method: 'POST',
          body: payload
        })
        cart.value.push(newItem)
      }

      saveCart()
    } catch (error) {
      console.error('Failed to add to cart:', error)
      if (!existingItem) {
        cart.value.push(payload)
      }
      saveCart()
    }
  }

  const increaseQuantity = async (id: string | number, format?: string) => {
    const item = findCartItem(id, format)

    if (!item) return

    item.quantity += 1

    try {
      await $fetch(`${API_URL}/cart/${id}`, {
        method: 'PATCH',
        body: { quantity: item.quantity }
      })
    } catch (error) {
      console.error('Failed to update quantity:', error)
    }

    saveCart()
  }

  const decreaseQuantity = async (id: string | number, format?: string) => {
    const item = findCartItem(id, format)

    if (!item) return

    if (item.quantity > 1) {
      item.quantity -= 1
      try {
        await $fetch(`${API_URL}/cart/${id}`, {
          method: 'PATCH',
          body: { quantity: item.quantity }
        })
      } catch (error) {
        console.error('Failed to update quantity:', error)
      }
      saveCart()
    } else {
      await removeFromCart(id, format)
    }
  }

  const removeFromCart = async (id: string | number, format?: string) => {
    const item = findCartItem(id, format)
    if (!item) return

    cart.value = cart.value.filter(cartItem => cartItem !== item)

    try {
      await $fetch(`${API_URL}/cart/${item.id}`, {
        method: 'DELETE'
      })
    } catch (error) {
      console.error('Failed to remove from cart:', error)
    }

    saveCart()
  }

  const clearCart = async () => {
    cart.value = []

    try {
      await $fetch(`${API_URL}/cart`, {
        method: 'DELETE'
      })
    } catch (error) {
      console.error('Failed to clear cart:', error)
    }

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