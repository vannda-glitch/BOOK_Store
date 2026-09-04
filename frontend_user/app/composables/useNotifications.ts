import { useNotificationsStore } from '~/stores/notifications'

export const useNotifications = () => {
  const notificationsStore = useNotificationsStore()

  const fetchNotifications = async () => {
    await notificationsStore.fetchNotifications()
  }

  const markAsRead = async (notificationId: number) => {
    await notificationsStore.markAsRead(notificationId)
  }

  const markAllAsRead = async () => {
    await notificationsStore.markAllAsRead()
  }

  const getUnreadCount = async () => {
    return await notificationsStore.getUnreadCount()
  }

  return {
    notifications: computed(() => notificationsStore.notifications),
    unreadCount: computed(() => notificationsStore.unreadCount),
    loading: computed(() => notificationsStore.loading),
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    getUnreadCount
  }
}