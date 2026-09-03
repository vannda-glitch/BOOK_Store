import { computed, onMounted, ref } from 'vue'

export const useCart = () => {
  const cart = useState<any[]>('lumina-cart', () => [])

  const loadCart = () => {
    if (import.meta.server) return

    const savedCart = localStorage.getItem('lumina-cart')

    if (!savedCart) {
      cart.value = []
      return
    }

    try {
      const parsed = JSON.parse(savedCart)
      cart.value = Array.isArray(parsed) ? parsed : []
    } catch (error) {
      console.error('Could not load cart:', error)
      cart.value = []
      localStorage.removeItem('lumina-cart')
    }
  }

  const saveCart = () => {
    if (import.meta.server) return
    localStorage.setItem('lumina-cart', JSON.stringify(cart.value))
  }

  const addToCart = (book: any) => {
    const existingBook = cart.value.find((item) => item.id === book.id)

    if (existingBook) {
      existingBook.quantity = Number(existingBook.quantity || 1) + 1
    } else {
      cart.value.push({ ...book, quantity: 1 })
    }

    saveCart()
  }

  const removeItem = (id: number | string) => {
    cart.value = cart.value.filter((item) => item.id !== id)
    saveCart()
  }

  const clearCart = () => {
    cart.value = []
    saveCart()
  }

  const cartCount = computed(() => {
    return cart.value.reduce((total, item) => total + Number(item.quantity || 0), 0)
  })

  const subtotal = computed(() => {
    return cart.value.reduce((total, item) => total + Number(item.price || 0) * Number(item.quantity || 0), 0)
  })

  onMounted(() => {
    loadCart()
  })

  return {
    cart,
    cartCount,
    subtotal,
    addToCart,
    removeItem,
    clearCart,
    loadCart,
    saveCart,
  }
}
