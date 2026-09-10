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
  loadCart,
  
} = useCart()

// ========================================
// Search
// ========================================

const searchText = ref('')

const showSearch = ref(false)
const searchInput = ref<HTMLInputElement | null>(null)

const openSearch = async () => {
  showSearch.value = true
  await nextTick()
  searchInput.value?.focus()
}

const closeSearch = () => {
  showSearch.value = false
  searchText.value = ''
}

const searchBooks = () => {

  const keyword = searchText.value.trim()

  if (!keyword) {
    openSearch()
    return
  }

  navigateTo({
    path: '/browse',
    query: {
      search: keyword
    }
  })

  closeSearch()
}

const handleSearchKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    closeSearch()
  }
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
    class="sticky top-0 z-50 border-b border-[#dce9e4] bg-[#f7f7f2]/90 shadow-sm backdrop-blur-xl"
  >

    <div
      class="mx-auto flex h-[4.5rem] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8"
    >

      <!-- ================================= -->
      <!-- Logo -->
      <!-- ================================= -->

      <NuxtLink
        to="/"
        class="group flex items-center gap-3 font-serif text-xl font-bold tracking-tight text-ink sm:text-2xl"
      >
        <span class="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-sm font-sans font-bold text-white shadow-lg shadow-primary/20 transition group-hover:-rotate-3">
          R+
        </span>
        <span>Read<span class="text-[#0f766e]">Plus</span></span>
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
              : 'text-gray-600 hover:text-primary'
          "
        >

          Home

          <span
            v-if="isActive('/')"
            class="absolute bottom-0 left-0 h-0.5 w-full rounded-full bg-primary"
          />

        </NuxtLink>


        <!-- Browse -->

        <NuxtLink
          to="/browse"
          class="relative py-2 text-sm transition"
          :class="
            isActive('/browse')
              ? 'font-bold text-gray-950'
              : 'text-gray-600 hover:text-primary'
          "
        >

          Browse

          <span
            v-if="isActive('/browse')"
            class="absolute bottom-0 left-0 h-0.5 w-full rounded-full bg-primary"
          />

        </NuxtLink>


        <!-- Collections -->

        <NuxtLink
          to="/collection"
          class="relative py-2 text-sm transition"
          :class="
            isActive('/collection')
              ? 'font-bold text-gray-950'
              : 'text-gray-600 hover:text-primary'
          "
        >

          Collections

          <span
            v-if="isActive('/collection')"
            class="absolute bottom-0 left-0 h-0.5 w-full rounded-full bg-primary"
          />

        </NuxtLink>


        <!-- About -->

        <NuxtLink
          to="/about"
          class="relative py-2 text-sm transition"
          :class="
            isActive('/about')
              ? 'font-bold text-gray-950'
              : 'text-gray-600 hover:text-primary'
          "
        >

          About

          <span
            v-if="isActive('/about')"
            class="absolute bottom-0 left-0 h-0.5 w-full rounded-full bg-primary"
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
        class="flex items-center gap-2 sm:gap-4"
      >

        <!-- ================================= -->
        <!-- Search -->
        <!-- ================================= -->

        <form
          class="flex items-center transition-all duration-300"
          :class="showSearch ? 'w-64 rounded-full border border-[#d5e3e0] bg-white/90 px-3 py-1 shadow-[0_5px_18px_rgba(23,32,31,0.06)] transition hover:border-[#8fc5bd] hover:shadow-[0_8px_24px_rgba(15,118,110,0.12)]  focus-within:shadow-[0_0_0_3px_rgba(15,118,110,0.10),0_8px_24px_rgba(15,118,110,0.12)] sm:w-80' : ''"
          @submit.prevent="searchBooks"
        >
          <button
            v-if="!showSearch"
            type="button"
            aria-label="Open search"
            class="flex h-10 w-10 items-center justify-center rounded-full border border-transparent text-gray-700 transition duration-200 hover:border-[#8fc5bd] hover:bg-[#e9f4f2] hover:text-[#0f766e] hover:shadow-[0_0_0_3px_rgba(15,118,110,0.08)]"
            @click="openSearch"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.6" stroke="currentColor" class="h-6 w-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-4.35-4.35m2.1-5.4a7.5 7.5 0 1 1-15 0 7.5 7.5 0 0 1 15 0Z" />
            </svg>
          </button>

          <template v-else>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.7" stroke="currentColor" class="h-5 w-5 shrink-0 text-gray-500">
              <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-4.35-4.35m2.1-5.4a7.5 7.5 0 1 1-15 0 7.5 7.5 0 0 1 15 0Z" />
            </svg>

            <input
              ref="searchInput"
              v-model="searchText"
              type="text"
              placeholder="Search title, author..."
              aria-label="Search books"
              autocomplete="off"
              class="min-w-0 flex-1 appearance-none border-none bg-transparent px-2 py-2 text-sm text-gray-900 outline-none ring-0 placeholder:text-gray-400 focus:border-none focus:outline-none focus:ring-0 focus:shadow-none focus-visible:outline-none"
              @keydown="handleSearchKeydown"
            />

            <button
              v-if="searchText"
              type="button"
              aria-label="Clear search"
              class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-gray-400 transition hover:bg-[#e9f4f2] hover:text-[#0f766e]"
              @click="searchText = ''"
            >
              <span aria-hidden="true" class="text-base leading-none">&#215;</span>
            </button>
          </template>
        </form>


        <!-- ================================= -->
        <!-- Cart -->
        <!-- ================================= -->

        <button
          type="button"
          aria-label="Shopping cart"
          class="relative rounded-lg p-2 text-gray-600 transition hover:bg-[#e9f4f2] hover:text-primary"
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
            class="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-white"
          >
            {{cartCount}}
          </span>

        </button>


        <!-- ================================= -->
        <!-- NOT LOGGED IN -->
        <!-- ================================= -->

        <template v-if="!user">

          <NuxtLink
            to="/auth/login"
            class="hidden text-sm font-semibold text-gray-600 transition hover:text-primary sm:block"
          >
            Login
          </NuxtLink>


          <NuxtLink
            to="/auth/register"
            class="hidden rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white shadow-md shadow-primary/20 transition hover:bg-[#0b5f59] sm:block"
          >
            Register
          </NuxtLink>

        </template>


        <!-- ================================= -->
        <!-- LOGGED IN -->
        <!-- ================================= -->

        <template v-else>

          <NuxtLink
            to="/"
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
              class="hidden max-w-25 truncate text-sm font-medium sm:block"
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