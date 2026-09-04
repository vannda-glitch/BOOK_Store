<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <div>
      <label for="password" class="block text-sm font-medium text-gray-700">
        New Password
      </label>
      <div class="relative">
        <input
          id="password"
          v-model="password"
          :type="showPassword ? 'text' : 'password'"
          required
          class="input mt-1 pr-10"
          placeholder="Enter new password"
        />
        <button
          type="button"
          @click="showPassword = !showPassword"
          class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          <Icon :name="showPassword ? 'mdi:eye' : 'mdi:eye-off'" size="20" />
        </button>
      </div>
      <p class="mt-1 text-xs text-gray-500">
        Must be at least 8 characters with uppercase, lowercase, number, and special character
      </p>
    </div>
    
    <div>
      <label for="confirm_password" class="block text-sm font-medium text-gray-700">
        Confirm Password
      </label>
      <input
        id="confirm_password"
        v-model="confirmPassword"
        :type="showConfirmPassword ? 'text' : 'password'"
        required
        class="input mt-1"
        placeholder="Confirm your password"
      />
    </div>
    
    <button
      type="submit"
      class="btn btn-primary w-full"
      :disabled="loading"
    >
      <LoadingSpinner v-if="loading" size="sm" />
      <span v-else>Reset Password</span>
    </button>
  </form>
</template>

<script setup lang="ts">
import { useAuth } from '~/composables/useAuth'

const route = useRoute()
const { resetPassword, loading } = useAuth()
const toast = useToast()

const password = ref('')
const confirmPassword = ref('')
const showPassword = ref(false)
const showConfirmPassword = ref(false)

const token = route.query.token as string

const handleSubmit = async () => {
  if (!token) {
    toast.error('Invalid reset token')
    return
  }
  
  if (password.value !== confirmPassword.value) {
    toast.error('Passwords do not match')
    return
  }
  
  if (password.value.length < 8) {
    toast.error('Password must be at least 8 characters')
    return
  }
  
  await resetPassword(token, password.value)
}
</script>