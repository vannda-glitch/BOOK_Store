<template>
  <div class="card p-6">
    <div class="flex items-center gap-6">
      <div class="relative">
        <img
          :src="user?.profile_picture || '/images/default-avatar.png'"
          :alt="user?.full_name || user?.username"
          class="w-24 h-24 rounded-full object-cover border-4 border-primary-100"
        />
        <button
          @click="handleUploadPhoto"
          class="absolute bottom-0 right-0 bg-primary-600 text-white p-2 rounded-full hover:bg-primary-700 transition-colors"
        >
          <Icon name="mdi:camera" size="16" />
        </button>
      </div>
      
      <div>
        <h2 class="text-xl font-semibold text-gray-900">
          {{ user?.full_name || user?.username }}
        </h2>
        <p class="text-gray-500">{{ user?.email }}</p>
        <p class="text-sm text-gray-400 mt-1">
          Member since {{ user?.created_at ? formatDate(user.created_at) : 'N/A' }}
        </p>
        <span class="badge badge-primary mt-2">
          {{ user?.role === 'ADMIN' ? 'Admin' : 'Customer' }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { User } from '~/types'
import { formatters } from '~/utils/formatters'

const props = defineProps<{
  user: User | null
}>()

const toast = useToast()
const formatDate = formatters.date

const handleUploadPhoto = () => {
  // In a real app, you would open a file picker
  toast.info('Photo upload coming soon!')
}
</script>