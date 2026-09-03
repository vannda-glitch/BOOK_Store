
<script setup lang="ts">


const route = useRoute()

// ===============================
// Active navigation
// ===============================

const isActive = (path: string) => {
  return route.path === path
}


// ===============================
// Navigation
// ===============================

const goToBrowse = () => {
  navigateTo('/browse')
}

const goToCart = () => {
  navigateTo('/cart')
}


// ===============================
// Cart
// ===============================

const { cartCount } = useCart()


// ===============================
// Authentication
// ===============================

const user = ref<any>(null)


// Get logged-in user
const loadUser = () => {

  if (import.meta.client) {

    const savedUser =
      localStorage.getItem('user')

    if (savedUser) {

      try {

        user.value =
          JSON.parse(savedUser)

      } catch {

        user.value = null

      }

    } else {

      user.value = null

    }
  }
}


// Logout
const logout = () => {

  localStorage.removeItem('user')

  user.value = null

  navigateTo('/auth/login')
}


// Check user when page loads
onMounted(() => {

  loadUser()

})


// Update navbar if localStorage changes
if (import.meta.client) {

  window.addEventListener(
    'storage',
    loadUser
  )

}

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


        <!-- ================================= -->
        <!-- Admin Link -->
        <!-- ================================= -->

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

      <div class="flex items-center gap-5">


        <!-- ================================= -->
        <!-- Search -->
        <!-- ================================= -->

        <button
          aria-label="Search"
          class="text-gray-700 transition hover:text-black"
          @click="goToBrowse"
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


        <!-- ================================= -->
        <!-- Cart -->
        <!-- ================================= -->

        <NuxtLink
          to="/cart"
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


          <!-- Cart Badge -->

          <span
            v-if="cartCount > 0"
            class="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-black text-[10px] font-semibold text-white"
          >

            {{ cartCount }}

          </span>

        </NuxtLink>


        <!-- ================================= -->
        <!-- NOT LOGGED IN -->
        <!-- ================================= -->

        <template v-if="!user">

          <!-- Login -->

          <NuxtLink
            to="/auth/login"
            class="hidden text-sm font-medium text-gray-700 transition hover:text-black sm:block"
          >
            Login
          </NuxtLink>


          <!-- Register -->

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

          <!-- User -->

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
