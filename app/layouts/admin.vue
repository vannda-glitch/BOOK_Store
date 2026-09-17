<script setup lang="ts">
const route = useRoute()
const sidebarOpen = ref(false)
const pageTitle = computed(() => {
  if (route.path === '/admin') return 'Dashboard'
  if (route.path.startsWith('/admin/books')) return 'Books'
  if (route.path.startsWith('/admin/categories')) return 'Categories'
  if (route.path.startsWith('/admin/orders')) return 'Orders'
  if (route.path.startsWith('/admin/users')) return 'Users'
  if (route.path.startsWith('/admin/profile')) return 'Profile'
  if (route.path.startsWith('/admin/settings')) return 'Settings'
  return 'Admin Panel'
})
</script>

<template>
  <div class="min-h-screen bg-[#eef6f4] bg-[radial-gradient(circle_at_90%_0%,rgba(103,197,187,0.12),transparent_26rem)]">
    <AdminSidebar v-model:open="sidebarOpen" />
    <div class="min-h-screen lg:ml-72">
      <AdminNavbar v-model:open="sidebarOpen" />
      <main class="p-4 pt-20 sm:p-6 sm:pt-20 lg:p-8 lg:pt-20"><div class="mb-6 lg:hidden"><p class="text-[10px] font-bold uppercase tracking-[0.22em] text-primary">ReadPlus Management</p><h1 class="mt-1 font-serif text-2xl font-bold text-ink">{{ pageTitle }}</h1></div><slot /></main>
    </div>
  </div>
</template>