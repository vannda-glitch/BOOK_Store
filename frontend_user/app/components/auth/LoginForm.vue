<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <div>
      <label for="email" class="block text-sm font-medium text-gray-700">
        Email Address
      </label>
      <input
        id="email"
        v-model="form.email"
        type="email"
        required
        class="input mt-1"
        placeholder="you@example.com"
      />
    </div>
    
    <div>
      <label for="password" class="block text-sm font-medium text-gray-700">
        Password
      </label>
      <div class="relative">
        <input
          id="password"
          v-model="form.password"
          :type="showPassword ? 'text' : 'password'"
          required
          class="input mt-1 pr-10"
          placeholder="Enter your password"
        />
        <button
          type="button"
          @click="showPassword = !showPassword"
          class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          <Icon :name="showPassword ? 'mdi:eye' : 'mdi:eye-off'" size="20" />
        </button>
      </div>
    </div>
    
    <div class="flex items-center justify-between">
      <div class="flex items-center">
        <input
          id="remember"
          v-model="form.remember"
          type="checkbox"
          class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
        />
        <label for="remember" class="ml-2 block text-sm text-gray-700">
          Remember me
        </label>
      </div>
      <NuxtLink to="/auth/forgot-password" class="text-sm text-primary-600 hover:text-primary-500">
        Forgot password?
      </NuxtLink>
    </div>
    
    <button
      type="submit"
      class="btn btn-primary w-full"
      :disabled="loading"
    >
      <LoadingSpinner v-if="loading" size="sm" />
      <span v-else>Sign In</span>
    </button>
    
    <p class="text-center text-sm text-gray-600">
      Don't have an account?
      <NuxtLink to="/auth/register" class="text-primary-600 hover:text-primary-500 font-medium">
        Register here
      </NuxtLink>
    </p>
  </form>
</template>

<script setup lang="ts">
import { useAuth } from '~/composables/useAuth'
import type { LoginCredentials } from '~/types'

const { login, loading } = useAuth()

const form = reactive<LoginCredentials & { remember: boolean }>({
  email: '',
  password: '',
  remember: false
})

const showPassword = ref(false)

const handleSubmit = async () => {
  await login({
    email: form.email,
    password: form.password
  })
}
</script>