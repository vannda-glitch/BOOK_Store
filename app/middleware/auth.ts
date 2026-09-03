export default defineNuxtRouteMiddleware(() => {

  // Middleware can run on server and client.
  // localStorage only exists on client.
  if (import.meta.server) {
    return
  }

  const user = localStorage.getItem('user')

  // Not logged in
  if (!user) {
    return navigateTo('/auth/login')
  }

})