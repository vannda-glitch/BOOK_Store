<script setup lang="ts">

// ========================================
// Router
// ========================================

const route = useRoute()

// ========================================
// Active Navigation
// ========================================

const isActive = (path: string) => {
  return route.path === path
}

// ========================================
// Navigation
// ========================================

const goToBrowse = () => {
  navigateTo('/browse')
}

const goToCart = () => {
  navigateTo('/cart')
}

// ========================================
// Cart
// ========================================

const {
  cartCount,
  loadCart
} = useCart()

// ========================================
// Search
// ========================================

const searchText = ref('')

const showSearch = ref(false)

const searchBooks = () => {

  const keyword = searchText.value.trim()

  if (!keyword) {
    navigateTo('/browse')
    return
  }

  navigateTo({
    path: '/browse',
    query: {
      search: keyword
    }
  })

  showSearch.value = false
}

// ========================================
// Authentication
// ========================================

const user = ref<any>(null)

// ========================================
// Load User
// ========================================

const loadUser = () => {

  if (!import.meta.client) return

  const savedUser = localStorage.getItem('user')

  if (savedUser) {

    try {
      user.value = JSON.parse(savedUser)
    } catch {
      user.value = null
    }

  } else {
    user.value = null
  }
}

// ========================================
// Logout
// ========================================

const logout = () => {

  localStorage.removeItem('user')

  user.value = null

  navigateTo('/auth/login')
}

// ========================================
// Storage Event
// ========================================

const handleStorage = () => {
  loadUser()
}

// ========================================
// Mounted
// ========================================

onMounted(() => {

  loadUser()

  // Load cart from localStorage
  loadCart()

  window.addEventListener(
    'storage',
    handleStorage
  )
})

// ========================================
// Cleanup
// ========================================

onBeforeUnmount(() => {

  if (import.meta.client) {

    window.removeEventListener(
      'storage',
      handleStorage
    )

  }

})

</script>


<template>

  <header
    class="sticky top-0 z-50 border-b border-gray-200 bg-white"
  >

    <div
      class="mx-auto flex h-20 max-w-[1600px] items-center justify-between px-6 lg:px-12"
    >

      <!-- ================================= -->
      <!-- Logo -->
      <!-- ================================= -->

      <NuxtLink
        to="/"
        class="font-serif text-2xl font-bold tracking-tight text-gray-950"
      >
        Lumina Books
      </NuxtLink>


      <!-- ================================= -->
      <!-- Navigation -->
      <!-- ================================= -->

      <nav
        class="hidden items-center gap-9 md:flex"
      >

        <!-- Home -->

        <NuxtLink
          to="/"
          class="relative py-2 text-sm transition"
          :class="
            isActive('/')
              ? 'font-bold text-gray-950'
              : 'text-gray-600 hover:text-gray-950'
          "
        >

          Home

          <span
            v-if="isActive('/')"
            class="absolute bottom-0 left-0 h-[1px] w-full bg-gray-950"
          />

        </NuxtLink>


        <!-- Browse -->

        <NuxtLink
          to="/browse"
          class="relative py-2 text-sm transition"
          :class="
            isActive('/browse')
              ? 'font-bold text-gray-950'
              : 'text-gray-600 hover:text-gray-950'
          "
        >

          Browse

          <span
            v-if="isActive('/browse')"
            class="absolute bottom-0 left-0 h-[1px] w-full bg-gray-950"
          />

        </NuxtLink>


        <!-- Collections -->

        <NuxtLink
          to="/collection"
          class="relative py-2 text-sm transition"
          :class="
            isActive('/collection')
              ? 'font-bold text-gray-950'
              : 'text-gray-600 hover:text-gray-950'
          "
        >

          Collections

          <span
            v-if="isActive('/collection')"
            class="absolute bottom-0 left-0 h-[1px] w-full bg-gray-950"
          />

        </NuxtLink>


        <!-- Rare Finds -->

        <NuxtLink
          to="/rare-finds"
          class="relative py-2 text-sm transition"
          :class="
            isActive('/rare-finds')
              ? 'font-bold text-gray-950'
              : 'text-gray-600 hover:text-gray-950'
          "
        >

          Rare Finds

          <span
            v-if="isActive('/rare-finds')"
            class="absolute bottom-0 left-0 h-[1px] w-full bg-gray-950"
          />

        </NuxtLink>


        <!-- About -->

        <NuxtLink
          to="/about"
          class="relative py-2 text-sm transition"
          :class="
            isActive('/about')
              ? 'font-bold text-gray-950'
              : 'text-gray-600 hover:text-gray-950'
          "
        >

          About

          <span
            v-if="isActive('/about')"
            class="absolute bottom-0 left-0 h-[1px] w-full bg-gray-950"
          />

        </NuxtLink>


        <!-- Admin -->

        <NuxtLink
          v-if="user?.role === 'admin'"
          to="/admin"
          class="relative py-2 text-sm font-semibold text-gray-700 transition hover:text-black"
        >
          Admin
        </NuxtLink>

      </nav>


      <!-- ================================= -->
      <!-- Right Side -->
      <!-- ================================= -->

      <div
        class="flex items-center gap-5"
      >

        <!-- ================================= -->
        <!-- Search -->
        <!-- ================================= -->

        <div
          class="relative flex items-center"
        >

          <!-- Search Input -->

          <input
            v-if="showSearch"
            v-model="searchText"
            type="text"
            placeholder="Search books..."
            class="w-40 border-b border-gray-400 bg-transparent px-2 py-1 text-sm outline-none transition focus:border-black sm:w-52"
            @keyup.enter="searchBooks"
          />


          <!-- Search Button -->

          <button
            type="button"
            aria-label="Search"
            class="text-gray-700 transition hover:text-black"
            @click="
              showSearch
                ? searchBooks()
                : showSearch = true
            "
          >

            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.6"
              stroke="currentColor"
              class="h-6 w-6"
            >

              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="m21 21-4.35-4.35m2.1-5.4a7.5 7.5 0 1 1-15 0 7.5 7.5 0 0 1 15 0Z"
              />

            </svg>

          </button>

        </div>


        <!-- ================================= -->
        <!-- Cart -->
        <!-- ================================= -->

        <button
          type="button"
          aria-label="Shopping cart"
          class="relative text-gray-700 transition hover:text-black"
          @click="goToCart"
        >

          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.6"
            stroke="currentColor"
            class="h-6 w-6"
          >

            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M2.75 3.75h2.1l1.55 11.1a2 2 0 0 0 1.98 1.72h8.9a2 2 0 0 0 1.96-1.6L20.5 7H5.2"
            />

            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M9 20.25h.01M17 20.25h.01"
            />

          </svg>


          <!-- ================================= -->
          <!-- Cart Badge -->
          <!-- ================================= -->

          <span
            v-if="cartCount > 0"
            class="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-black text-[10px] font-semibold text-white"
          >
            {{ cartCount }}
          </span>

        </button>


        <!-- ================================= -->
        <!-- NOT LOGGED IN -->
        <!-- ================================= -->

        <template v-if="!user">

          <NuxtLink
            to="/auth/login"
            class="hidden text-sm font-medium text-gray-700 transition hover:text-black sm:block"
          >
            Login
          </NuxtLink>


          <NuxtLink
            to="/auth/register"
            class="hidden rounded-lg bg-black px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800 sm:block"
          >
            Register
          </NuxtLink>

        </template>


        <!-- ================================= -->
        <!-- LOGGED IN -->
        <!-- ================================= -->

        <template v-else>

          <NuxtLink
            to="/account"
            class="flex items-center gap-2 text-gray-700 transition hover:text-black"
          >

            <!-- User Icon -->

            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.6"
              stroke="currentColor"
              class="h-6 w-6"
            >

              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M15.75 7.5a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.8 20.25a7.2 7.2 0 0 1 14.4 0"
              />

            </svg>


            <!-- User Name -->

            <span
              class="hidden max-w-[100px] truncate text-sm font-medium sm:block"
            >
              {{ user.name }}
            </span>

          </NuxtLink>


          <!-- Logout -->

          <button
            type="button"
            class="hidden text-sm font-medium text-gray-500 transition hover:text-red-600 sm:block"
            @click="logout"
          >
            Logout
          </button>

        </template>

      </div>

    </div>

  </header>

</template>