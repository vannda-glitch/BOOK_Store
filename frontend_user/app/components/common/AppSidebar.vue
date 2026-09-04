<template>
  <aside v-if="isOpen" class="fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-xl transform transition-transform duration-300">
    <div class="flex flex-col h-full">
      <div class="p-4 border-b border-gray-200">
        <div class="flex items-center justify-between">
          <span class="text-xl font-bold text-primary-600">Menu</span>
          <button @click="close" class="text-gray-400 hover:text-gray-600">
            <Icon name="mdi:close" size="24" />
          </button>
        </div>
      </div>
      
      <nav class="flex-1 overflow-y-auto p-4 space-y-2">
        <NuxtLink to="/" class="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-50 text-gray-700 hover:text-primary-600" @click="close">
          <Icon name="mdi:home" size="20" />
          Home
        </NuxtLink>
        
        <NuxtLink to="/books" class="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-50 text-gray-700 hover:text-primary-600" @click="close">
          <Icon name="mdi:bookshelf" size="20" />
          All Books
        </NuxtLink>
        
        <div class="mt-4">
          <p class="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Categories</p>
          <div class="mt-2 space-y-1">
            <NuxtLink
              v-for="category in categories"
              :key="category.id"
              :to="`/books/category/${category.slug}`"
              class="block px-4 py-2 text-sm text-gray-600 hover:text-primary-600 hover:bg-gray-50 rounded-lg"
              @click="close"
            >
              {{ category.name }}
            </NuxtLink>
          </div>
        </div>
        
        <hr class="my-4" />
        
        <div v-if="isAuthenticated">
          <NuxtLink to="/profile" class="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-50 text-gray-700 hover:text-primary-600" @click="close">
            <Icon name="mdi:account" size="20" />
            Profile
          </NuxtLink>
          <NuxtLink to="/orders" class="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-50 text-gray-700 hover:text-primary-600" @click="close">
            <Icon name="mdi:package-variant" size="20" />
            Orders
          </NuxtLink>
          <NuxtLink to="/wishlist" class="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-50 text-gray-700 hover:text-primary-600" @click="close">
            <Icon name="mdi:heart" size="20" />
            Wishlist
          </NuxtLink>
          <button @click="handleLogout" class="flex items-center gap-3 w-full px-4 py-2 rounded-lg hover:bg-gray-50 text-red-600 hover:text-red-700" @click="close">
            <Icon name="mdi:logout" size="20" />
            Logout
          </button>
        </div>
        
        <div v-else>
          <NuxtLink to="/auth/login" class="flex items-center gap-3 px-4 py-2 rounded-lg bg-primary-50 text-primary-600 hover:bg-primary-100" @click="close">
            <Icon name="mdi:login" size="20" />
            Login
          </NuxtLink>
          <NuxtLink to="/auth/register" class="flex items-center gap-3 px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-50" @click="close">
            <Icon name="mdi:account-plus" size="20" />
            Register
          </NuxtLink>
        </div>
      </nav>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { useAuth } from '~/composables/useAuth'
import { useBooks } from '~/composables/useBooks'

const props = defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const { isAuthenticated, logout } = useAuth()
const { categories } = useBooks()

const close = () => {
  emit('close')
}

const handleLogout = async () => {
  await logout()
  close()
}
</script>