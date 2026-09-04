import { defineStore } from 'pinia'
import type { Publisher } from '~/types'

export const usePublishersStore = defineStore('publishers', {
  state: () => ({
    publishers: [] as Publisher[],
    currentPublisher: null as Publisher | null,
    loading: false
  }),

  actions: {
    async fetchPublishers() {
      this.loading = true
      try {
        const publishers = await $fetch<Publisher[]>('/publishers', {
          baseURL: useRuntimeConfig().public.apiBase
        })
        this.publishers = publishers
        return publishers
      } finally {
        this.loading = false
      }
    },

    async fetchPublisher(id: number) {
      this.loading = true
      try {
        const publisher = await $fetch<Publisher>(`/publishers/${id}`, {
          baseURL: useRuntimeConfig().public.apiBase
        })
        this.currentPublisher = publisher
        return publisher
      } finally {
        this.loading = false
      }
    },

    async createPublisher(data: Partial<Publisher>) {
      const publisher = await $fetch<Publisher>('/publishers', {
        method: 'POST',
        body: data,
        baseURL: useRuntimeConfig().public.apiBase,
        headers: {
          Authorization: `Bearer ${useAuthStore().token}`
        }
      })
      this.publishers.push(publisher)
      return publisher
    },

    async updatePublisher(id: number, data: Partial<Publisher>) {
      const publisher = await $fetch<Publisher>(`/publishers/${id}`, {
        method: 'PUT',
        body: data,
        baseURL: useRuntimeConfig().public.apiBase,
        headers: {
          Authorization: `Bearer ${useAuthStore().token}`
        }
      })
      const index = this.publishers.findIndex(p => p.id === id)
      if (index !== -1) {
        this.publishers[index] = publisher
      }
      if (this.currentPublisher?.id === id) {
        this.currentPublisher = publisher
      }
      return publisher
    },

    async deletePublisher(id: number) {
      await $fetch(`/publishers/${id}`, {
        method: 'DELETE',
        baseURL: useRuntimeConfig().public.apiBase,
        headers: {
          Authorization: `Bearer ${useAuthStore().token}`
        }
      })
      this.publishers = this.publishers.filter(p => p.id !== id)
      if (this.currentPublisher?.id === id) {
        this.currentPublisher = null
      }
    }
  }
})