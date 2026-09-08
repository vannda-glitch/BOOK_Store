// composables/useCart.ts

export interface CartItem {
  id: string | number
  title: string
  shortTitle?: string
  author?: string
  price: number
  image?: string
  format?: string
  genre?: string
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

  const loadCart = async () => {
    if (!import.meta.client) return

    try {
      const serverCart = await $fetch<CartItem[]>(`${API_URL}/cart`)
      if (serverCart && Array.isArray(serverCart)) {
        cart.value = serverCart
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
        cart.value = JSON.parse(savedCart)
      } catch (error) {
        console.error('Failed to load cart from localStorage:', error)
        cart.value = []
      }
    }
  }

  const addToCart = async (product: any) => {
    const existingItem = cart.value.find(
      item => String(item.id) === String(product.id)
    )

    const payload: CartItem = {
      id: product.id,
      title: product.title,
      shortTitle: product.shortTitle,
      author: product.author,
      price: Number(product.price),
      image: product.image,
      format: product.format,
      genre: product.genre,
      quantity: 1
    }

    try {
      if (existingItem) {
        // Item exists - PATCH to increment quantity
        existingItem.quantity += 1
        await $fetch(`${API_URL}/cart/${existingItem.id}`, {
          method: 'PATCH',
          body: { quantity: existingItem.quantity }
        })
      } else {
        // New item - POST to create
        const newItem = await $fetch<CartItem>(`${API_URL}/cart`, {
          method: 'POST',
          body: payload
        })
        cart.value.push(newItem)
      }

      saveCart()
    } catch (error) {
      console.error('Failed to add to cart:', error)
      // Still update local state as fallback
      if (existingItem) {
        existingItem.quantity += 1
      } else {
        cart.value.push(payload)
      }
      saveCart()
    }
  }

  const increaseQuantity = async (id: string | number) => {
    const item = cart.value.find(
      item => String(item.id) === String(id)
    )

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

  const decreaseQuantity = async (id: string | number) => {
    const item = cart.value.find(
      item => String(item.id) === String(id)
    )

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
      await removeFromCart(id)
    }
  }

  const removeFromCart = async (id: string | number) => {
    cart.value = cart.value.filter(
      item => String(item.id) !== String(id)
    )

    try {
      await $fetch(`${API_URL}/cart/${id}`, {
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