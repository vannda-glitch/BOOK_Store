import { defineStore } from 'pinia'

interface Toast {
  id: number
  message: string
  type: 'success' | 'error' | 'warning' | 'info'
  duration?: number
}

export const useToastStore = defineStore('toast', {
  state: () => ({
    toasts: [] as Toast[],
    idCounter: 0
  }),

  actions: {
    addToast(message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info', duration: number = 5000) {
      const id = ++this.idCounter
      const toast: Toast = { id, message, type, duration }
      this.toasts.push(toast)
      
      setTimeout(() => {
        this.removeToast(id)
      }, duration)
    },

    removeToast(id: number) {
      const index = this.toasts.findIndex(t => t.id === id)
      if (index !== -1) {
        this.toasts.splice(index, 1)
      }
    },

    clearToasts() {
      this.toasts = []
    }
  }
})