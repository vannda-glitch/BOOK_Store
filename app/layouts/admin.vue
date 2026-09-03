<script setup lang="ts">
const route = useRoute()

const pageTitle = computed(() => {
  if (route.path === '/admin') return 'Dashboard'
  if (route.path.startsWith('/admin/books')) return 'Books'
  if (route.path.startsWith('/admin/categories')) return 'Categories'
  if (route.path.startsWith('/admin/orders')) return 'Orders'
  if (route.path.startsWith('/admin/users')) return 'Users'

  return 'Admin Panel'
})
</script>

<template>
  <div class="min-h-screen bg-gray-50">

    <!-- Admin Sidebar -->
    <AdminSidebar />

    <!-- Main Area -->
    <div class="ml-64 min-h-screen">

      <!-- Top Header -->
      <header
        class="sticky top-0 z-30 flex h-20 items-center
               justify-between border-b border-gray-200
               bg-white px-8"
      >
        <!-- Page Title -->
        <div>
          <h1 class="text-2xl font-bold text-gray-900">
            {{ pageTitle }}
          </h1>

          <p class="mt-1 text-sm text-gray-500">
            Manage your bookstore
          </p>
        </div>

        <!-- Right Side -->
        <div class="flex items-center gap-4">

          <!-- View Store -->
          <NuxtLink
            to="/"
            class="rounded-lg border border-gray-200 px-4 py-2
                   text-sm font-medium text-gray-700
                   transition hover:bg-gray-100"
          >
            View Store
          </NuxtLink>

          <!-- Admin Avatar -->
          <div
            class="flex h-10 w-10 items-center justify-center
                   rounded-full bg-black font-semibold text-white"
          >
            A
          </div>

        </div>
      </header>

      <!-- Page Content -->
      <main class="p-8">
        <slot />
      </main>

    </div>

  </div>
</template>