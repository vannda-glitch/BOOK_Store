export default defineNuxtRouteMiddleware(() => {
  if (import.meta.server) {
    return
  }

  const savedUser = localStorage.getItem('user')

  if (!savedUser) {
    return navigateTo('/auth/login')
  }

  let user

  try {
    user = JSON.parse(savedUser)
  } catch (error) {
    localStorage.removeItem('user')
    return navigateTo('/auth/login')
  }

  if (user.role !== 'admin') {
    return navigateTo('/')
  }
})
