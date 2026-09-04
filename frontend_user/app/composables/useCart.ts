import { useCartStore } from '~/stores/cart'
import type { CartItem } from '~/types'

export const useCart = () => {
  const cartStore = useCartStore()
  const toast = useToast()

  const fetchCart = async () => {
    await cartStore.fetchCart()
  }

  const addToCart = async (bookId: number, quantity: number = 1) => {
    try {
      await cartStore.addItem(bookId, quantity)
      toast.success('Added to cart!')
      return { success: true }
    } catch (error: any) {
      const message = error.response?.data?.detail || 'Failed to add to cart'
      toast.error(message)
      return { success: false, error: message }
    }
  }

  const removeFromCart = async (itemId: number) => {
    try {
      await cartStore.removeItem(itemId)
      toast.info('Removed from cart')
      return { success: true }
    } catch (error: any) {
      toast.error('Failed to remove item')
      return { success: false }
    }
  }

  const updateQuantity = async (itemId: number, quantity: number) => {
    try {
      await cartStore.updateItemQuantity(itemId, quantity)
      return { success: true }
    } catch (error: any) {
      toast.error('Failed to update quantity')
      return { success: false }
    }
  }

  const clearCart = async () => {
    try {
      await cartStore.clearCart()
      toast.info('Cart cleared')
      return { success: true }
    } catch (error: any) {
      toast.error('Failed to clear cart')
      return { success: false }
    }
  }

  const getItemCount = (bookId: number): number => {
    const item = cartStore.items.find((i: CartItem) => i.book.id === bookId)
    return item?.quantity || 0
  }

  return {
    items: computed(() => cartStore.items),
    totalItems: computed(() => cartStore.totalItems),
    subtotal: computed(() => cartStore.subtotal),
    total: computed(() => cartStore.total),
    loading: computed(() => cartStore.loading),
    fetchCart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getItemCount
  }
}