export default defineNuxtRouteMiddleware((to, from) => {
  const { isAuthenticated, user } = useAuth()
  
  if (!isAuthenticated.value) {
    return navigateTo('/auth/login')
  }
  
  if (!user.value?.is_verified) {
    return navigateTo('/auth/verify-email')
  }
})