<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold text-gray-900 mb-8">My Profile</h1>
    
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div class="lg:col-span-1">
        <div class="card p-6 text-center">
          <img
            :src="user?.profile_picture || '/images/default-avatar.png'"
            alt="Profile"
            class="w-32 h-32 rounded-full object-cover mx-auto border-4 border-primary-100"
          />
          <h2 class="mt-4 text-xl font-semibold">{{ user?.full_name || user?.username }}</h2>
          <p class="text-gray-500">{{ user?.email }}</p>
        </div>
      </div>
      
      <div class="lg:col-span-2">
        <div class="card p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Profile Information</h3>
          <p class="text-gray-600">Profile details coming soon...</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuth } from '~/composables/useAuth'

definePageMeta({
  middleware: 'auth'
})

const { user } = useAuth()
</script>