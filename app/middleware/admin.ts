export default defineNuxtRouteMiddleware(() => {
  // localStorage only exists in the browser
  if (import.meta.server) {
    return
  }

  // Get logged-in user
  const savedUser = localStorage.getItem('user')

  // Not logged in
  if (!savedUser) {
    return navigateTo('/auth/login')
  }

  let user

  try {
    user = JSON.parse(savedUser)
  } catch (error) {
    // Invalid localStorage data
    localStorage.removeItem('user')
    return navigateTo('/auth/login')
  }

  // Logged in but not admin
  if (user.role !== 'admin') {
    return navigateTo('/')
  }
})