import { defineStore } from 'pinia'
import type { Book } from '~/types'

export const useWishlistStore = defineStore('wishlist', {
  state: () => ({
    items: [] as Book[],
    loading: false
  }),

  getters: {
    totalItems: (state) => state.items.length,
    isInWishlist: (state) => (bookId: number) => {
      return state.items.some(book => book.id === bookId)
    }
  },

  actions: {
    async fetchWishlist() {
      this.loading = true
      try {
        const data = await $fetch<{ items: Book[] }>('/wishlist', {
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

    async addItem(bookId: number) {
      this.loading = true
      try {
        await $fetch(`/wishlist/items/${bookId}`, {
          method: 'POST',
          baseURL: useRuntimeConfig().public.apiBase,
          headers: {
            Authorization: `Bearer ${useAuthStore().token}`
          }
        })
        await this.fetchWishlist()
      } finally {
        this.loading = false
      }
    },

    async removeItem(bookId: number) {
      await $fetch(`/wishlist/items/${bookId}`, {
        method: 'DELETE',
        baseURL: useRuntimeConfig().public.apiBase,
        headers: {
          Authorization: `Bearer ${useAuthStore().token}`
        }
      })
      await this.fetchWishlist()
    },

    async moveToCart(bookId: number) {
      await $fetch(`/wishlist/items/${bookId}/move-to-cart`, {
        method: 'POST',
        baseURL: useRuntimeConfig().public.apiBase,
        headers: {
          Authorization: `Bearer ${useAuthStore().token}`
        }
      })
      await this.fetchWishlist()
      await useCartStore().fetchCart()
    },

    clear() {
      this.items = []
    }
  }
})