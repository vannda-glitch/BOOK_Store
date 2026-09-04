import { useAuthStore } from '~/stores/auth'
import type { LoginCredentials, RegisterData, ChangePasswordData } from '~/types'

export const useAuth = () => {
  const authStore = useAuthStore()
  const router = useRouter()
  const toast = useToast()

  const login = async (credentials: LoginCredentials) => {
    try {
      await authStore.login(credentials)
      toast.success('Login successful!')
      router.push('/')
      return { success: true }
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Login failed')
      return { success: false, error }
    }
  }

  const register = async (userData: RegisterData) => {
    try {
      await authStore.register(userData)
      toast.success('Registration successful! Please verify your email.')
      router.push('/auth/login')
      return { success: true }
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Registration failed')
      return { success: false, error }
    }
  }

  const logout = async () => {
    await authStore.logout()
    router.push('/auth/login')
    toast.info('Logged out successfully')
  }

  const changePassword = async (data: ChangePasswordData) => {
    try {
      await $fetch('/auth/change-password', {
        method: 'POST',
        body: data,
        baseURL: useRuntimeConfig().public.apiBase,
        headers: {
          Authorization: `Bearer ${authStore.token}`
        }
      })
      toast.success('Password changed successfully')
      return { success: true }
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Failed to change password')
      return { success: false, error }
    }
  }

  const forgotPassword = async (email: string) => {
    try {
      await $fetch('/auth/forgot-password', {
        method: 'POST',
        body: { email },
        baseURL: useRuntimeConfig().public.apiBase
      })
      toast.success('Password reset link sent to your email')
      return { success: true }
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Failed to send reset link')
      return { success: false, error }
    }
  }

  const resetPassword = async (token: string, newPassword: string) => {
    try {
      await $fetch('/auth/reset-password', {
        method: 'POST',
        body: { token, new_password: newPassword },
        baseURL: useRuntimeConfig().public.apiBase
      })
      toast.success('Password reset successfully')
      return { success: true }
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Failed to reset password')
      return { success: false, error }
    }
  }

  return {
    login,
    register,
    logout,
    changePassword,
    forgotPassword,
    resetPassword,
    user: computed(() => authStore.user),
    isAuthenticated: computed(() => authStore.isAuthenticated),
    isAdmin: computed(() => authStore.isAdmin),
    loading: computed(() => authStore.loading)
  }
}