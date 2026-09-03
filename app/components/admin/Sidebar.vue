<script setup lang="ts">

const route = useRoute()

// ===============================
// Menu Items
// ===============================
const menuItems = [
  {
    name: 'Dashboard',
    path: '/admin',
    icon: 'https://img.icons8.com/?size=100&id=S5D5w5vFLhYp&format=png&color=000000',
    type: 'image'
  },
  {
    name: 'Books',
    path: '/admin/books',
    icon: 'https://img.icons8.com/?size=100&id=fH22K8x6Yvz6&format=png&color=000000',
    type: 'image'
  },
  {
    name: 'Categories',
    path: '/admin/categories',
    icon: 'https://img.icons8.com/?size=100&id=48145&format=png&color=000000',
    type: 'image'
  },
  {
    name: 'Orders',
    path: '/admin/orders',
    icon: 'https://img.icons8.com/?size=100&id=67348&format=png&color=000000',
    type: 'image'
  },
  {
    name: 'Users',
    path: '/admin/users',
    icon: 'https://img.icons8.com/?size=100&id=41799&format=png&color=000000',
    type: 'image'
  }
]

// ===============================
// Check Active Menu
// ===============================
const isActive = (path: string) => {

  // Dashboard should ONLY be active on /admin
  if (path === '/admin') {
    return route.path === '/admin'
  }

  // Other pages
  return route.path.startsWith(path)
}

// ===============================
// Logout
// ===============================
const logout = async () => {

  localStorage.removeItem('user')

  await navigateTo('/login')

}

</script>


<template>

  <aside
    class="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r border-gray-200 bg-white"
  >

    <!-- ================================= -->
    <!-- Logo -->
    <!-- ================================= -->

    <div
      class="flex h-20 items-center border-b border-gray-200 px-6"
    >

      <NuxtLink
        to="/admin"
        class="flex items-center gap-3"
      >

        <!-- Logo -->
        <div
          class="flex h-10 w-10 items-center justify-center rounded-lg bg-black text-lg font-bold text-white"
        >
          L
        </div>

        <!-- Logo Text -->
        <div>

          <h1
            class="text-lg font-bold text-gray-900"
          >
            Lumina Books
          </h1>

          <p
            class="text-xs text-gray-500"
          >
            Admin Panel
          </p>

        </div>

      </NuxtLink>

    </div>


    <!-- ================================= -->
    <!-- Navigation -->
    <!-- ================================= -->

    <nav
      class="flex-1 overflow-y-auto px-4 py-6"
    >

      <!-- Section Title -->

      <p
        class="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-gray-400"
      >
        Management
      </p>


      <!-- Menu -->

      <div class="space-y-1">

        <NuxtLink
          v-for="item in menuItems"
          :key="item.path"
          :to="item.path"
          class="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition"
          :class="
            isActive(item.path)
              ? 'bg-black text-white'
              : 'text-gray-600 hover:bg-gray-100 hover:text-black'
          "
        >

          <!-- =============================== -->
          <!-- Icon -->
          <!-- =============================== -->

          <span
            class="flex h-6 w-6 shrink-0 items-center justify-center text-center"
          >

            <!-- Image Icon -->

            <img
              v-if="item.type === 'image'"
              :src="item.icon"
              :alt="item.name"
              class="h-6 w-6 object-contain"
            />

            <!-- Emoji / Text Icon -->

            <span
              v-else
              class="text-lg"
            >
              {{ item.icon }}
            </span>

          </span>


          <!-- =============================== -->
          <!-- Menu Name -->
          <!-- =============================== -->

          <span>
            {{ item.name }}
          </span>

        </NuxtLink>

      </div>


      <!-- ================================= -->
      <!-- Other Section -->
      <!-- ================================= -->

      <p
        class="mb-3 mt-8 px-3 text-xs font-semibold uppercase tracking-wider text-gray-400"
      >
        Other
      </p>


      <div class="space-y-1">

        <!-- View Store -->

       <NuxtLink
          to="/"
          class="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-gray-600 transition hover:bg-gray-100 hover:text-black"
        >
          <span
            class="flex h-6 w-6 items-center justify-center"
          >
            <img
              src="https://img.icons8.com/?size=100&id=pPzo6H7ufKML&format=png&color=000000"
              alt="Home"
              class="h-10 w-20 object-contain"
            />
          </span>

          <span>
            View Store
          </span>
        </NuxtLink>

      </div>

    </nav>


    <!-- ================================= -->
    <!-- Admin Profile -->
    <!-- ================================= -->

    <div
      class="border-t border-gray-200 p-4"
    >

      <!-- Profile -->

      <div
        class="mb-3 flex items-center gap-3 rounded-lg bg-gray-50 p-3"
      >

        <!-- Avatar -->

        <div
          class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-black font-semibold text-white"
        >
          A
        </div>


        <!-- Information -->

        <div class="min-w-0">

          <p
            class="truncate text-sm font-semibold text-gray-900"
          >
            Admin
          </p>

          <p
            class="truncate text-xs text-gray-500"
          >
            Administrator
          </p>

        </div>

      </div>


      <!-- ================================= -->
      <!-- Logout -->
      <!-- ================================= -->

      <button
        @click="logout"
        class="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-red-600 transition hover:bg-red-50"
      >

        <span
          class="flex h-6 w-6 items-center justify-center text-lg"
        >
          ↪
        </span>

        <span>
          Logout
        </span>

      </button>

    </div>

  </aside>

</template>