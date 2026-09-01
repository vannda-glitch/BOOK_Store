export const useCart = () => {
  const cartCount = useState<number>('cart-count', () => 0)

  const addToCart = () => {
    cartCount.value++
  }

  const removeFromCart = () => {
    if (cartCount.value > 0) {
      cartCount.value--
    }
  }

  const clearCart = () => {
    cartCount.value = 0
  }

  return {
    cartCount,
    addToCart,
    removeFromCart,
    clearCart
  }
}