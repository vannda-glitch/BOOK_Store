import { defineStore } from 'pinia'
import type { Author } from '~/types'

export const useAuthorsStore = defineStore('authors', {
  state: () => ({
    authors: [] as Author[],
    currentAuthor: null as Author | null,
    loading: false
  }),

  actions: {
    async fetchAuthors() {
      this.loading = true
      try {
        const authors = await $fetch<Author[]>('/authors', {
          baseURL: useRuntimeConfig().public.apiBase
        })
        this.authors = authors
        return authors
      } finally {
        this.loading = false
      }
    },

    async fetchAuthor(id: number) {
      this.loading = true
      try {
        const author = await $fetch<Author>(`/authors/${id}`, {
          baseURL: useRuntimeConfig().public.apiBase
        })
        this.currentAuthor = author
        return author
      } finally {
        this.loading = false
      }
    },

    async createAuthor(data: Partial<Author>) {
      const author = await $fetch<Author>('/authors', {
        method: 'POST',
        body: data,
        baseURL: useRuntimeConfig().public.apiBase,
        headers: {
          Authorization: `Bearer ${useAuthStore().token}`
        }
      })
      this.authors.push(author)
      return author
    },

    async updateAuthor(id: number, data: Partial<Author>) {
      const author = await $fetch<Author>(`/authors/${id}`, {
        method: 'PUT',
        body: data,
        baseURL: useRuntimeConfig().public.apiBase,
        headers: {
          Authorization: `Bearer ${useAuthStore().token}`
        }
      })
      const index = this.authors.findIndex(a => a.id === id)
      if (index !== -1) {
        this.authors[index] = author
      }
      if (this.currentAuthor?.id === id) {
        this.currentAuthor = author
      }
      return author
    },

    async deleteAuthor(id: number) {
      await $fetch(`/authors/${id}`, {
        method: 'DELETE',
        baseURL: useRuntimeConfig().public.apiBase,
        headers: {
          Authorization: `Bearer ${useAuthStore().token}`
        }
      })
      this.authors = this.authors.filter(a => a.id !== id)
      if (this.currentAuthor?.id === id) {
        this.currentAuthor = null
      }
    }
  }
})