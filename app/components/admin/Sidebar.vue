<script setup lang="ts">
const route = useRoute()

const menuItems = [
  {
    name: 'Dashboard',
    path: '/admin',
    icon: '▦'
  },
  {
    name: 'Books',
    path: '/admin/books',
    icon: '📚'
  },
  {
    name: 'Categories',
    path: '/admin/categories',
    icon: '☷'
  },
  {
    name: 'Orders',
    path: '/admin/orders',
    icon: '🛒'
  },
  {
    name: 'Users',
    path: '/admin/users',
    icon: '👥'
  }
]

const isActive = (path: string) => {
  if (path === '/admin') {
    return route.path === '/admin'
  }

  return route.path.startsWith(path)
}

const logout = async () => {
  localStorage.removeItem('user')
  await navigateTo('/auth/login')
}
</script>

<template>
  <aside
    class="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col
           border-r border-gray-200 bg-white"
  >

    <!-- Logo -->
    <div class="flex h-20 items-center border-b border-gray-200 px-6">
      <NuxtLink to="/admin" class="flex items-center gap-3">
        <div
          class="flex h-10 w-10 items-center justify-center
                 rounded-lg bg-black text-lg font-bold text-white"
        >
          L
        </div>

        <div>
          <h1 class="text-lg font-bold text-gray-900">
            Lumina Books
          </h1>

          <p class="text-xs text-gray-500">
            Admin Panel
          </p>
        </div>
      </NuxtLink>
    </div>

    <!-- Navigation -->
    <nav class="flex-1 overflow-y-auto px-4 py-6">

      <p
        class="mb-3 px-3 text-xs font-semibold uppercase
               tracking-wider text-gray-400"
      >
        Management
      </p>

      <div class="space-y-1">

        <NuxtLink
          v-for="item in menuItems"
          :key="item.path"
          :to="item.path"
          class="flex items-center gap-3 rounded-lg px-3 py-3
                 text-sm font-medium transition"
          :class="
            isActive(item.path)
              ? 'bg-black text-white'
              : 'text-gray-600 hover:bg-gray-100 hover:text-black'
          "
        >
          <span class="w-6 text-center text-lg">
            {{ item.icon }}
          </span>

          <span>
            {{ item.name }}
          </span>
        </NuxtLink>

      </div>

      <!-- Other -->
      <p
        class="mb-3 mt-8 px-3 text-xs font-semibold uppercase
               tracking-wider text-gray-400"
      >
        Other
      </p>

      <div class="space-y-1">

        <NuxtLink
          to="/"
          class="flex items-center gap-3 rounded-lg px-3 py-3
                 text-sm font-medium text-gray-600 transition
                 hover:bg-gray-100 hover:text-black"
        >
          <span class="w-6 text-center text-lg">
            🏠
          </span>

          <span>
            View Store
          </span>
        </NuxtLink>

      </div>

    </nav>

    <!-- Admin Profile -->
    <div class="border-t border-gray-200 p-4">

      <div class="mb-3 flex items-center gap-3 rounded-lg bg-gray-50 p-3">

        <div
          class="flex h-10 w-10 items-center justify-center
                 rounded-full bg-black font-semibold text-white"
        >
          A
        </div>

        <div class="min-w-0">
          <p class="truncate text-sm font-semibold text-gray-900">
            Admin
          </p>

          <p class="truncate text-xs text-gray-500">
            Administrator
          </p>
        </div>

      </div>

      <!-- Logout -->
      <button
        @click="logout"
        class="flex w-full items-center gap-3 rounded-lg px-3 py-3
               text-sm font-medium text-red-600 transition
               hover:bg-red-50"
      >
        <span class="w-6 text-center text-lg">
          ↪
        </span>

        <span>
          Logout
        </span>
      </button>

    </div>

  </aside>
</template>