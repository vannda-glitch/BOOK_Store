import { defineStore } from 'pinia'
import type { Category } from '~/types'

export const useCategoriesStore = defineStore('categories', {
  state: () => ({
    categories: [] as Category[],
    loading: false
  }),

  getters: {
    getCategoryById: (state) => (id: number) => {
      return state.categories.find(c => c.id === id)
    },
    getCategoryBySlug: (state) => (slug: string) => {
      return state.categories.find(c => c.slug === slug)
    }
  },

  actions: {
    async fetchCategories() {
      this.loading = true
      try {
        const categories = await $fetch<Category[]>('/categories', {
          baseURL: useRuntimeConfig().public.apiBase
        })
        this.categories = categories
        return categories
      } finally {
        this.loading = false
      }
    },

    async createCategory(data: Partial<Category>) {
      const category = await $fetch<Category>('/categories', {
        method: 'POST',
        body: data,
        baseURL: useRuntimeConfig().public.apiBase,
        headers: {
          Authorization: `Bearer ${useAuthStore().token}`
        }
      })
      this.categories.push(category)
      return category
    },

    async updateCategory(id: number, data: Partial<Category>) {
      const category = await $fetch<Category>(`/categories/${id}`, {
        method: 'PUT',
        body: data,
        baseURL: useRuntimeConfig().public.apiBase,
        headers: {
          Authorization: `Bearer ${useAuthStore().token}`
        }
      })
      const index = this.categories.findIndex(c => c.id === id)
      if (index !== -1) {
        this.categories[index] = category
      }
      return category
    },

    async deleteCategory(id: number) {
      await $fetch(`/categories/${id}`, {
        method: 'DELETE',
        baseURL: useRuntimeConfig().public.apiBase,
        headers: {
          Authorization: `Bearer ${useAuthStore().token}`
        }
      })
      this.categories = this.categories.filter(c => c.id !== id)
    }
  }
})