export const useToast = () => {
  const toasts = ref<Array<{
    id: number
    message: string
    type: 'success' | 'error' | 'warning' | 'info'
    duration?: number
  }>>([])

  let idCounter = 0

  const addToast = (message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info', duration = 5000) => {
    const id = ++idCounter
    toasts.value.push({ id, message, type, duration })
    
    setTimeout(() => {
      removeToast(id)
    }, duration)
  }

  const removeToast = (id: number) => {
    const index = toasts.value.findIndex(t => t.id === id)
    if (index !== -1) {
      toasts.value.splice(index, 1)
    }
  }

  const success = (message: string) => addToast(message, 'success')
  const error = (message: string) => addToast(message, 'error')
  const warning = (message: string) => addToast(message, 'warning')
  const info = (message: string) => addToast(message, 'info')

  return {
    toasts: readonly(toasts),
    success,
    error,
    warning,
    info,
    removeToast
  }
}