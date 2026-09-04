<template>
  <div class="text-center space-y-6">
    <div class="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto">
      <Icon name="mdi:email" size="40" class="text-primary-600" />
    </div>
    
    <div>
      <h3 class="text-xl font-semibold text-gray-900">Verify Your Email</h3>
      <p class="text-gray-600 mt-2">
        We've sent a verification link to <strong>{{ user?.email }}</strong>
      </p>
      <p class="text-sm text-gray-500 mt-1">
        Please check your inbox and click the verification link to activate your account.
      </p>
    </div>
    
    <button
      @click="resendVerification"
      class="btn btn-primary"
      :disabled="resending"
    >
      <LoadingSpinner v-if="resending" size="sm" />
      <span v-else>Resend Verification Email</span>
    </button>
    
    <div>
      <button @click="handleLogout" class="text-sm text-gray-500 hover:text-gray-700">
        Logout
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuth } from '~/composables/useAuth'

const { user, logout } = useAuth()
const toast = useToast()
const resending = ref(false)

const resendVerification = async () => {
  resending.value = true
  try {
    await $fetch('/auth/resend-verification', {
      method: 'POST',
      body: { email: user.value?.email },
      baseURL: useRuntimeConfig().public.apiBase
    })
    toast.success('Verification email sent!')
  } catch (error) {
    toast.error('Failed to send verification email')
  } finally {
    resending.value = false
  }
}

const handleLogout = async () => {
  await logout()
}
</script>