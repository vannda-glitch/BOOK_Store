import { defineStore } from 'pinia'
import type { CartItem, Cart } from '~/types'

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [] as CartItem[],
    loading: false
  }),

  getters: {
    totalItems: (state) => state.items.reduce((sum, item) => sum + item.quantity, 0),
    subtotal: (state) => {
      return state.items.reduce((sum, item) => {
        const price = item.book.discount_price || item.book.price
        return sum + (price * item.quantity)
      }, 0)
    },
    total: (state) => state.subtotal
  },

  actions: {
    async fetchCart() {
      this.loading = true
      try {
        const data = await $fetch<Cart>('/cart', {
          baseURL: useRuntimeConfig().public.apiBase,
          headers: {
            Authorization: `Bearer ${useAuthStore().token}`
          }
        })
        this.items = data.items
        return data
      } finally {
        this.loading = false
      }
    },

    async addItem(bookId: number, quantity: number = 1) {
      this.loading = true
      try {
        const data = await $fetch<CartItem>('/cart/items', {
          method: 'POST',
          body: { book_id: bookId, quantity },
          baseURL: useRuntimeConfig().public.apiBase,
          headers: {
            Authorization: `Bearer ${useAuthStore().token}`
          }
        })
        await this.fetchCart()
        return data
      } finally {
        this.loading = false
      }
    },

    async removeItem(itemId: number) {
      await $fetch(`/cart/items/${itemId}`, {
        method: 'DELETE',
        baseURL: useRuntimeConfig().public.apiBase,
        headers: {
          Authorization: `Bearer ${useAuthStore().token}`
        }
      })
      await this.fetchCart()
    },

    async updateItemQuantity(itemId: number, quantity: number) {
      await $fetch(`/cart/items/${itemId}`, {
        method: 'PUT',
        body: { quantity },
        baseURL: useRuntimeConfig().public.apiBase,
        headers: {
          Authorization: `Bearer ${useAuthStore().token}`
        }
      })
      await this.fetchCart()
    },

    async clearCart() {
      await $fetch('/cart/clear', {
        method: 'DELETE',
        baseURL: useRuntimeConfig().public.apiBase,
        headers: {
          Authorization: `Bearer ${useAuthStore().token}`
        }
      })
      this.items = []
    },

    clear() {
      this.items = []
    }
  }
})