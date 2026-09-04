
export default defineNuxtRouteMiddleware((to, from) => {
  const { isAuthenticated,user } = useAuth()
  
  
  if (isAuthenticated.value) {
    return navigateTo('/auth/login')
  }
})