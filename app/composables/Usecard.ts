import { computed, useState } from '#imports'

export interface CartItem {
  id: number
  title: string
  price: number
  image: string
  quantity: number
}

export const useCart = () => {
  const cart = useState<CartItem[]>('cart', () => [])

  const cartCount = computed(() => {
    return cart.value.reduce((total, item) => {
      return total + item.quantity
    }, 0)
  })

  const addToCart = (book: Omit<CartItem, 'quantity'>) => {
    const existingItem = cart.value.find(item => item.id === book.id)

    if (existingItem) {
      existingItem.quantity++
    } else {
      cart.value.push({
        ...book,
        quantity: 1
      })
    }
  }

  const removeFromCart = (id: number) => {
    cart.value = cart.value.filter(item => item.id !== id)
  }

  const clearCart = () => {
    cart.value = []
  }

  return {
    cart,
    cartCount,
    addToCart,
    removeFromCart,
    clearCart
  }
}