<template>
  <header class="bg-white shadow-sm sticky top-0 z-50">
    <div class="container mx-auto px-4">
      <div class="flex items-center justify-between h-16">

        <!-- Logo -->
        <NuxtLink to="/" class="flex items-center shrink-0">
          <span class="text-2xl font-bold text-primary-600">
            BookStore
          </span>
        </NuxtLink>

        <!-- Navigation -->
        <nav class="hidden lg:flex items-center space-x-6 ml-8">
          <NuxtLink
            to="/"
            class="text-gray-700 hover:text-primary-600 font-medium transition"
          >
            Home
          </NuxtLink>

          <NuxtLink
            to="/books"
            class="text-gray-700 hover:text-primary-600 font-medium transition"
          >
            Books
          </NuxtLink>

          <NuxtLink
            to="/about"
            class="text-gray-700 hover:text-primary-600 font-medium transition"
          >
            About
          </NuxtLink>

          <NuxtLink
            to="/contact"
            class="text-gray-700 hover:text-primary-600 font-medium transition"
          >
            Contact
          </NuxtLink>
        </nav>

        <!-- Search -->
        <div class="hidden md:flex flex-1 max-w-md mx-6">
          <div class="relative w-full">
            <input
              type="text"
              placeholder="Search for books..."
              class="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg
                     focus:outline-none focus:ring-2 focus:ring-primary-500"
            />

            <span class="absolute left-3 top-2.5 text-gray-400">
              <Icon name="mdi:magnify" size="20" />
            </span>
          </div>
        </div>

        <!-- Right Actions -->
        <div class="flex items-center space-x-4">

          <!-- Wishlist -->
          <NuxtLink
            to="/wishlist"
            class="relative text-gray-600 hover:text-primary-600"
          >
            <Icon name="mdi:heart-outline" size="24" />
          </NuxtLink>

          <!-- Cart -->
          <NuxtLink
            to="/cart"
            class="relative text-gray-600 hover:text-primary-600"
          >
            <Icon name="mdi:cart-outline" size="24" />

            <span
              v-if="cartTotalItems > 0"
              class="absolute -top-2 -right-2 bg-primary-600 text-white
                     text-xs rounded-full h-5 w-5 flex items-center justify-center"
            >
              {{ cartTotalItems }}
            </span>
          </NuxtLink>

          <!-- User -->
          <div
            v-if="isAuthenticated"
            ref="dropdownRef"
            class="relative"
          >
            <button
              @click="showDropdown = !showDropdown"
              class="flex items-center space-x-2 text-gray-600 hover:text-primary-600"
            >
              <div
                class="w-8 h-8 rounded-full bg-primary-100
                       flex items-center justify-center
                       text-primary-600 font-semibold text-sm"
              >
                {{ getInitials(user?.full_name || user?.username || 'U') }}
              </div>

              <Icon
                name="mdi:chevron-down"
                size="20"
                class="hidden sm:block"
              />
            </button>

            <!-- Dropdown -->
            <div
              v-if="showDropdown"
              class="absolute right-0 mt-2 w-48 bg-white
                     rounded-lg shadow-lg py-1 z-50
                     border border-gray-100"
            >
              <NuxtLink
                to="/profile"
                class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                @click="showDropdown = false"
              >
                <Icon
                  name="mdi:account"
                  size="16"
                  class="inline mr-2"
                />
                Profile
              </NuxtLink>

              <NuxtLink
                to="/orders"
                class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                @click="showDropdown = false"
              >
                <Icon
                  name="mdi:package-variant"
                  size="16"
                  class="inline mr-2"
                />
                Orders
              </NuxtLink>

              <NuxtLink
                to="/wishlist"
                class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                @click="showDropdown = false"
              >
                <Icon
                  name="mdi:heart"
                  size="16"
                  class="inline mr-2"
                />
                Wishlist
              </NuxtLink>

              <hr class="my-1" />

              <button
                @click="handleLogout"
                class="block w-full text-left px-4 py-2
                       text-sm text-red-600 hover:bg-gray-100"
              >
                <Icon
                  name="mdi:logout"
                  size="16"
                  class="inline mr-2"
                />
                Logout
              </button>
            </div>
          </div>

          <!-- Login/Register -->
          <div
            v-else
            class="flex items-center space-x-2"
          >
            <NuxtLink
              to="/auth/login"
              class="btn btn-primary text-sm hidden sm:inline-flex"
            >
              Login
            </NuxtLink>

            <NuxtLink
              to="/auth/register"
              class="btn btn-secondary text-sm hidden sm:inline-flex"
            >
              Register
            </NuxtLink>
          </div>

        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { onClickOutside } from '@vueuse/core'

const { user, isAuthenticated, logout } = useAuth()
const { totalItems: cartTotalItems } = useCart()

const showDropdown = ref(false)
const dropdownRef = ref<HTMLElement | null>(null)

const getInitials = (name: string) => {
  return name?.charAt(0)?.toUpperCase() || 'U'
}

const handleLogout = async () => {
  showDropdown.value = false
  await logout()
}

onClickOutside(dropdownRef, () => {
  showDropdown.value = false
})
</script>