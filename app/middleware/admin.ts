export default defineNuxtRouteMiddleware((to) => {
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
  } catch {
    localStorage.removeItem('user')
    return navigateTo('/auth/login')
  }

  if (user.role !== 'admin') {
    return navigateTo('/')
  }

  if (!to.path.startsWith('/admin')) {
    return navigateTo('/admin')
  }
})
