import { useWishlistStore } from '~/stores/wishlist'

export const useWishlist = () => {
  const wishlistStore = useWishlistStore()
  const toast = useToast()

  const fetchWishlist = async () => {
    await wishlistStore.fetchWishlist()
  }

  const addToWishlist = async (bookId: number) => {
    try {
      await wishlistStore.addItem(bookId)
      toast.success('Added to wishlist!')
      return { success: true }
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Failed to add to wishlist')
      return { success: false, error }
    }
  }

  const removeFromWishlist = async (bookId: number) => {
    await wishlistStore.removeItem(bookId)
    toast.info('Removed from wishlist')
  }

  const moveToCart = async (bookId: number) => {
    try {
      await wishlistStore.moveToCart(bookId)
      toast.success('Moved to cart!')
      return { success: true }
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Failed to move to cart')
      return { success: false, error }
    }
  }

  const isInWishlist = (bookId: number) => {
    return wishlistStore.isInWishlist(bookId)
  }

  return {
    items: computed(() => wishlistStore.items),
    totalItems: computed(() => wishlistStore.totalItems),
    loading: computed(() => wishlistStore.loading),
    fetchWishlist,
    addToWishlist,
    removeFromWishlist,
    moveToCart,
    isInWishlist
  }
}