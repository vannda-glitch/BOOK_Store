export interface WishlistItem {
  id: string | number
  userId: string | number
  bookId: string | number
}

const API_URL = 'http://localhost:8000'

export const useWishlist = () => {
  const wishlist = useState<WishlistItem[]>('lumina-wishlist', () => [])
  const error = useState<string | null>('lumina-wishlist-error', () => null)
  const loading = useState('lumina-wishlist-loading', () => false)
  const pendingBookIds = new Set<string>()

  const getCurrentUserId = () => {
    if (!import.meta.client) return null

    const savedUser = localStorage.getItem('user')
    if (!savedUser) return null

    try {
      const user = JSON.parse(savedUser)
      return user?.id == null ? null : String(user.id)
    } catch {
      return null
    }
  }

  const isFavorite = (bookId: string | number) => {
    return wishlist.value.some(item => String(item.bookId) === String(bookId))
  }

  const loadWishlist = async () => {
    const userId = getCurrentUserId()
    error.value = null

    if (!userId) {
      wishlist.value = []
      return
    }

    loading.value = true

    try {
      wishlist.value = await $fetch<WishlistItem[]>(`${API_URL}/wishlist`, {
        query: { userId }
      })
    } catch (loadError) {
      console.error('Failed to load wishlist:', loadError)
      wishlist.value = []
      error.value = 'Unable to load your favorites. Please check that JSON Server is running.'
    } finally {
      loading.value = false
    }
  }

  const addToWishlist = async (bookId: string | number) => {
    const userId = getCurrentUserId()
    error.value = null

    if (!userId) {
      error.value = 'Please login to add this book to your favorites.'
      return false
    }

    const normalizedBookId = String(bookId)
    if (isFavorite(normalizedBookId) || pendingBookIds.has(normalizedBookId)) return true

    pendingBookIds.add(normalizedBookId)

    try {
      const created = await $fetch<WishlistItem>(`${API_URL}/wishlist`, {
        method: 'POST',
        body: { userId, bookId: normalizedBookId }
      })
      wishlist.value.push(created)
      return true
    } catch (addError) {
      console.error('Failed to add wishlist item:', addError)
      error.value = 'Unable to add this book to your favorites. Please try again.'
      return false
    } finally {
      pendingBookIds.delete(normalizedBookId)
    }
  }

  const removeFromWishlist = async (bookId: string | number) => {
    const userId = getCurrentUserId()
    error.value = null

    if (!userId) {
      error.value = 'Please login to manage your favorites.'
      return false
    }

    const item = wishlist.value.find(record => String(record.bookId) === String(bookId))
    if (!item) return true

    try {
      await $fetch(`${API_URL}/wishlist/${item.id}`, { method: 'DELETE' })
      wishlist.value = wishlist.value.filter(record => record.id !== item.id)
      return true
    } catch (removeError) {
      console.error('Failed to remove wishlist item:', removeError)
      error.value = 'Unable to remove this book from your favorites. Please try again.'
      return false
    }
  }

  const toggleWishlist = async (bookId: string | number) => {
    return isFavorite(bookId)
      ? removeFromWishlist(bookId)
      : addToWishlist(bookId)
  }

  const clearWishlist = () => {
    wishlist.value = []
    error.value = null
  }

  const wishlistCount = computed(() => wishlist.value.length)

  return {
    wishlist,
    wishlistCount,
    loading,
    error,
    isFavorite,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    loadWishlist,
    clearWishlist
  }
}