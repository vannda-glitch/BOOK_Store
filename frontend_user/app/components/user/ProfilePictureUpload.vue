<template>
  <div class="flex flex-col items-center">
    <div class="relative group">
      <img
        :src="preview || user?.profile_picture || '/images/default-avatar.png'"
        :alt="user?.full_name || user?.username"
        class="w-32 h-32 rounded-full object-cover border-4 border-primary-100"
      />
      
      <div
        class="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
        @click="triggerFileInput"
      >
        <Icon name="mdi:camera" size="24" class="text-white" />
      </div>
    </div>
    
    <input
      ref="fileInput"
      type="file"
      accept="image/*"
      class="hidden"
      @change="handleFileSelect"
    />
    
    <p class="text-sm text-gray-500 mt-2">
      Click to upload a new profile picture
    </p>
    
    <button
      v-if="preview"
      @click="uploadPhoto"
      class="btn btn-primary text-sm mt-3"
      :disabled="uploading"
    >
      <LoadingSpinner v-if="uploading" size="sm" />
      <span v-else>Upload Photo</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import type { User } from '~/types'

const props = defineProps<{
  user: User | null
}>()

const emit = defineEmits<{
  (e: 'uploaded', url: string): void
}>()

const fileInput = ref<HTMLInputElement>()
const preview = ref<string | null>(null)
const selectedFile = ref<File | null>(null)
const uploading = ref(false)
const toast = useToast()

const triggerFileInput = () => {
  fileInput.value?.click()
}

const handleFileSelect = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files && input.files[0]) {
    const file = input.files[0]
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB')
      return
    }
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file')
      return
    }
    
    selectedFile.value = file
    const reader = new FileReader()
    reader.onload = (e) => {
      preview.value = e.target?.result as string
    }
    reader.readAsDataURL(file)
  }
}

const uploadPhoto = async () => {
  if (!selectedFile.value) return
  
  uploading.value = true
  try {
    const formData = new FormData()
    formData.append('file', selectedFile.value)
    
    const response = await $fetch<{ url: string }>('/users/me/upload-profile-picture', {
      method: 'POST',
      body: formData,
      baseURL: useRuntimeConfig().public.apiBase,
      headers: {
        Authorization: `Bearer ${useAuthStore().token}`
      }
    })
    
    emit('uploaded', response.url)
    toast.success('Profile picture updated!')
    preview.value = null
    selectedFile.value = null
  } catch (error) {
    toast.error('Failed to upload photo')
  } finally {
    uploading.value = false
  }
}
</script>