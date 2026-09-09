<script setup lang="ts">
const route = useRoute()

const pageTitle = computed(() => {
  if (route.path === '/admin') return 'Dashboard'
  if (route.path.startsWith('/admin/books')) return 'Books'
  if (route.path.startsWith('/admin/categories') || route.path.startsWith('/admin/product')) return 'Categories'
  if (route.path.startsWith('/admin/orders')) return 'Orders'
  if (route.path.startsWith('/admin/users')) return 'Users'

  return 'Admin Panel'
})
</script>

<template>
  <div class="min-h-screen bg-[#eef6f4]">

    <!-- Admin Sidebar -->
    <AdminSidebar />

    <!-- Main Area -->
    <div class="ml-64 min-h-screen">

      <!-- Top Header -->
      <header
        class="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-[#d9e7e2] bg-white/85 px-8 shadow-sm backdrop-blur"
      >
        <!-- Page Title -->
        <div>
          <p class="text-[10px] font-bold uppercase tracking-[0.24em] text-primary">
            ReadPlus Management
          </p>
          <h1 class="mt-1 font-serif text-2xl font-bold text-ink">
            {{ pageTitle }}
          </h1>

          <p class="mt-1 text-sm text-gray-500">
            Keep your store organized and moving.
          </p>
        </div>

        <!-- Right Side -->
        <div class="flex items-center gap-4">

          <!-- View Store -->
          <NuxtLink
            to="/"
                 class="rounded-xl border border-[#cfe0db] bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm transition hover:-translate-y-0.5 hover:border-primary hover:text-primary"
          >
            View Store
          </NuxtLink>

          <!-- Admin Avatar -->
          <div class="flex h-10 w-10 items-center justify-center rounded-full bg-primary font-semibold text-white shadow-lg shadow-primary/20">
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