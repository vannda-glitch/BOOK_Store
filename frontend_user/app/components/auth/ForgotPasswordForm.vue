<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <p class="text-sm text-gray-600">
      Enter your email address and we'll send you a link to reset your password.
    </p>
    
    <div>
      <label for="email" class="block text-sm font-medium text-gray-700">
        Email Address
      </label>
      <input
        id="email"
        v-model="email"
        type="email"
        required
        class="input mt-1"
        placeholder="you@example.com"
      />
    </div>
    
    <button
      type="submit"
      class="btn btn-primary w-full"
      :disabled="loading"
    >
      <LoadingSpinner v-if="loading" size="sm" />
      <span v-else>Send Reset Link</span>
    </button>
    
    <p class="text-center text-sm text-gray-600">
      Remember your password?
      <NuxtLink to="/auth/login" class="text-primary-600 hover:text-primary-500 font-medium">
        Sign in
      </NuxtLink>
    </p>
  </form>
</template>

<script setup lang="ts">
import { useAuth } from '~/composables/useAuth'

const { forgotPassword, loading } = useAuth()
const email = ref('')
const toast = useToast()

const handleSubmit = async () => {
  if (!email.value) {
    toast.error('Please enter your email')
    return
  }
  
  await forgotPassword(email.value)
}
</script>