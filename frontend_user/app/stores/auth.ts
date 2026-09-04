import { defineStore } from 'pinia'
import type { User, LoginCredentials, RegisterData } from '~/types'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
    token: null as string | null,
    loading: false,
    initialized: false
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    isAdmin: (state) => state.user?.role === 'ADMIN'
  },

  actions: {
    async login(credentials: LoginCredentials) {
      this.loading = true
      try {
        const { data } = await $fetch<{ access_token: string }>('/auth/login', {
          method: 'POST',
          body: new URLSearchParams({
            username: credentials.email,
            password: credentials.password
          }),
          baseURL: useRuntimeConfig().public.apiBase
        })
        
        this.token = data.access_token
        localStorage.setItem('auth_token', this.token)
        await this.fetchUser()
        return data
      } finally {
        this.loading = false
      }
    },

    async register(userData: RegisterData) {
      this.loading = true
      try {
        const data = await $fetch<User>('/auth/register', {
          method: 'POST',
          body: userData,
          baseURL: useRuntimeConfig().public.apiBase
        })
        return data
      } finally {
        this.loading = false
      }
    },

    async fetchUser() {
      if (!this.token) return null
      
      try {
        const user = await $fetch<User>('/users/me', {
          baseURL: useRuntimeConfig().public.apiBase,
          headers: {
            Authorization: `Bearer ${this.token}`
          }
        })
        this.user = user
        return user
      } catch (error) {
        this.logout()
        return null
      }
    },

    logout() {
      this.user = null
      this.token = null
      localStorage.removeItem('auth_token')
      // Clear all stores
      const cartStore = useCartStore()
      if (cartStore) cartStore.clear()
      
      const wishlistStore = useWishlistStore()
      if (wishlistStore) wishlistStore.clear()
    },

    async initialize() {
      if (this.initialized) return
      this.initialized = true

      if (import.meta.server) return

      const token = localStorage.getItem('auth_token')
      if (token) {
        this.token = token
        await this.fetchUser()
      }
    }
  }
})