import { defineNuxtPlugin } from '#app'

export default defineNuxtPlugin(() => {
  return {
    provide: {
      toast: {
        success(message: string, duration?: number) {
          const toastStore = useToastStore?.()
          if (toastStore) {
            toastStore.addToast(message, 'success', duration)
          } else {
            console.log('✅ Success:', message)
          }
        },
        error(message: string, duration?: number) {
          const toastStore = useToastStore?.()
          if (toastStore) {
            toastStore.addToast(message, 'error', duration)
          } else {
            console.error('❌ Error:', message)
          }
        },
        warning(message: string, duration?: number) {
          const toastStore = useToastStore?.()
          if (toastStore) {
            toastStore.addToast(message, 'warning', duration)
          } else {
            console.warn('⚠️ Warning:', message)
          }
        },
        info(message: string, duration?: number) {
          const toastStore = useToastStore?.()
          if (toastStore) {
            toastStore.addToast(message, 'info', duration)
          } else {
            console.info('ℹ️ Info:', message)
          }
        }
      }
    }
  }
})