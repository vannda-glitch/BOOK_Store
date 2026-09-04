import { defineStore } from 'pinia'

interface Notification {
  id: number
  type: string
  title: string
  message: string
  is_read: boolean
  data: any
  link?: string
  created_at: string
}

export const useNotificationsStore = defineStore('notifications', {
  state: () => ({
    notifications: [] as Notification[],
    unreadCount: 0,
    loading: false
  }),

  actions: {
    async fetchNotifications() {
      this.loading = true
      try {
        const data = await $fetch<Notification[]>('/notifications', {
          baseURL: useRuntimeConfig().public.apiBase,
          headers: {
            Authorization: `Bearer ${useAuthStore().token}`
          }
        })
        this.notifications = data
        this.unreadCount = data.filter(n => !n.is_read).length
        return data
      } finally {
        this.loading = false
      }
    },

    async markAsRead(notificationId: number) {
      const notification = await $fetch<Notification>(`/notifications/${notificationId}/read`, {
        method: 'PUT',
        baseURL: useRuntimeConfig().public.apiBase,
        headers: {
          Authorization: `Bearer ${useAuthStore().token}`
        }
      })
      
      const index = this.notifications.findIndex(n => n.id === notificationId)
      if (index !== -1) {
        this.notifications[index] = notification
      }
      
      this.unreadCount = this.notifications.filter(n => !n.is_read).length
    },

    async markAllAsRead() {
      await $fetch('/notifications/read-all', {
        method: 'PUT',
        baseURL: useRuntimeConfig().public.apiBase,
        headers: {
          Authorization: `Bearer ${useAuthStore().token}`
        }
      })
      
      this.notifications = this.notifications.map(n => ({ ...n, is_read: true }))
      this.unreadCount = 0
    },

    async getUnreadCount() {
      const data = await $fetch<{ unread_count: number }>('/notifications/unread-count', {
        baseURL: useRuntimeConfig().public.apiBase,
        headers: {
          Authorization: `Bearer ${useAuthStore().token}`
        }
      })
      this.unreadCount = data.unread_count
      return data.unread_count
    }
  }
})