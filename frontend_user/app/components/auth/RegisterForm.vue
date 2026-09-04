<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <div>
      <label for="full_name" class="block text-sm font-medium text-gray-700">
        Full Name
      </label>
      <input
        id="full_name"
        v-model="form.full_name"
        type="text"
        class="input mt-1"
        placeholder="John Doe"
      />
    </div>
    
    <div>
      <label for="username" class="block text-sm font-medium text-gray-700">
        Username
      </label>
      <input
        id="username"
        v-model="form.username"
        type="text"
        required
        class="input mt-1"
        placeholder="johndoe"
      />
    </div>
    
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
          placeholder="Create a password"
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
    
    <button
      type="submit"
      class="btn btn-primary w-full"
      :disabled="loading"
    >
      <LoadingSpinner v-if="loading" size="sm" />
      <span v-else>Create Account</span>
    </button>
    
    <p class="text-center text-sm text-gray-600">
      Already have an account?
      <NuxtLink to="/auth/login" class="text-primary-600 hover:text-primary-500 font-medium">
        Sign in
      </NuxtLink>
    </p>
  </form>
</template>

<script setup lang="ts">
import { useAuth } from '~/composables/useAuth'
import type { RegisterData } from '~/types'

const { register, loading } = useAuth()

const form = reactive<RegisterData>({
  full_name: '',
  username: '',
  email: '',
  password: ''
})

const showPassword = ref(false)

const handleSubmit = async () => {
  await register(form)
}
</script>