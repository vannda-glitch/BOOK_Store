```vue
<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
    <div class="w-full max-w-md">

      <!-- Login Card -->
      <div
        class="bg-white border border-gray-200 rounded-3xl p-8 sm:p-10
               shadow-lg shadow-gray-100"
      >
        <!-- Logo -->
        <div class="flex justify-center mb-6">
          <div
            class="flex h-14 w-14 items-center justify-center
                   rounded-2xl bg-gray-900 text-white shadow-sm"
          >
            <Icon
              name="mdi:book-open-page-variant"
              size="28"
            />
          </div>
        </div>

        <!-- Header -->
        <div class="text-center mb-8">
          <h1 class="text-3xl font-bold tracking-tight text-gray-900">
            Welcome back
          </h1>

          <p class="mt-2 text-sm text-gray-500">
            Sign in to continue to BookStore
          </p>
        </div>

        <!-- Login Form -->
        <form @submit.prevent="handleLogin" class="space-y-5">

          <!-- Email -->
          <div>
            <label
              for="email"
              class="block text-sm font-medium text-gray-700 mb-2"
            >
              Email address
            </label>

            <div class="relative">
              <Icon
                name="mdi:email-outline"
                size="20"
                class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                id="email"
                v-model="form.email"
                type="email"
                placeholder="you@example.com"
                autocomplete="email"
                required
                class="w-full rounded-xl border border-gray-300 bg-white
                       py-3.5 pl-11 pr-4 text-sm text-gray-900
                       outline-none transition
                       placeholder:text-gray-400
                       focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10"
              />
            </div>
          </div>

          <!-- Password -->
          <div>
            <div class="flex items-center justify-between mb-2">
              <label
                for="password"
                class="block text-sm font-medium text-gray-700"
              >
                Password
              </label>

              <NuxtLink
                to="/forgot-password"
                class="text-sm font-medium text-gray-900 hover:text-gray-600"
              >
                Forgot password?
              </NuxtLink>
            </div>

            <div class="relative">
              <Icon
                name="mdi:lock-outline"
                size="20"
                class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                id="password"
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="Enter your password"
                autocomplete="current-password"
                required
                class="w-full rounded-xl border border-gray-300 bg-white
                       py-3.5 pl-11 pr-12 text-sm text-gray-900
                       outline-none transition
                       placeholder:text-gray-400
                       focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10"
              />

              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute right-4 top-1/2 -translate-y-1/2
                       text-gray-400 hover:text-gray-700 transition"
                :aria-label="showPassword ? 'Hide password' : 'Show password'"
              >
                <Icon
                  :name="
                    showPassword
                      ? 'mdi:eye-off-outline'
                      : 'mdi:eye-outline'
                  "
                  size="20"
                />
              </button>
            </div>
          </div>

          <!-- Remember Me -->
          <div class="flex items-center justify-between">
            <label class="flex items-center gap-2 cursor-pointer">
              <input
                v-model="rememberMe"
                type="checkbox"
                class="h-4 w-4 rounded border-gray-300
                       text-gray-900 focus:ring-gray-900"
              />

              <span class="text-sm text-gray-600">
                Remember me
              </span>
            </label>
          </div>

          <!-- Error -->
          <div
            v-if="error"
            class="flex items-center gap-2 rounded-xl
                   border border-red-200 bg-red-50 px-4 py-3
                   text-sm text-red-600"
          >
            <Icon name="mdi:alert-circle-outline" size="20" />
            <span>{{ error }}</span>
          </div>

          <!-- Login Button -->
          <button
            type="submit"
            :disabled="loading"
            class="w-full flex items-center justify-center gap-2
                   rounded-xl bg-gray-900 px-4 py-3.5
                   text-sm font-semibold text-white
                   transition hover:bg-gray-800
                   focus:outline-none focus:ring-2 focus:ring-gray-900
                   focus:ring-offset-2
                   disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Icon
              v-if="loading"
              name="mdi:loading"
              size="20"
              class="animate-spin"
            />

            <span>
              {{ loading ? 'Signing in...' : 'Sign in' }}
            </span>

            <Icon
              v-if="!loading"
              name="mdi:arrow-right"
              size="20"
            />
          </button>
        </form>

        <!-- Divider -->
        <div class="relative my-7">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-gray-200"></div>
          </div>

          <div class="relative flex justify-center">
            <span class="bg-white px-4 text-xs text-gray-400 uppercase">
              Or continue with
            </span>
          </div>
        </div>

        <!-- Google Login -->
        <button
          type="button"
          @click="handleGoogleLogin"
          class="w-full flex items-center justify-center gap-3
                 rounded-xl border border-gray-300 bg-white
                 px-4 py-3.5 text-sm font-medium text-gray-700
                 transition hover:bg-gray-50 hover:border-gray-400"
        >
          <Icon name="flat-color-icons:google" size="20" />
          Continue with Google
        </button>

        <!-- Register -->
        <p class="mt-7 text-center text-sm text-gray-500">
          Don't have an account?
          <NuxtLink
            to="/register"
            class="font-semibold text-gray-900 hover:text-gray-600"
          >
            Create an account
          </NuxtLink>
        </p>
      </div>

      <!-- Support -->
      <p class="mt-6 text-center text-sm text-gray-500">
        Need help?
        <NuxtLink
          to="/contact"
          class="font-medium text-gray-900 underline underline-offset-4
                 transition hover:text-gray-600"
        >
          Contact support
        </NuxtLink>
      </p>

      <!-- Footer -->
      <p class="mt-4 text-center text-xs text-gray-400">
        © {{ new Date().getFullYear() }} BookStore. All rights reserved.
      </p>

    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'

definePageMeta({
  layout: 'auth',
  middleware: 'guest'
})

const router = useRouter()

const form = reactive({
  email: '',
  password: ''
})

const showPassword = ref(false)
const rememberMe = ref(false)
const loading = ref(false)
const error = ref('')

const handleLogin = async () => {
  error.value = ''
  loading.value = true

  try {
    // TODO:
    // Connect this to your auth store / FastAPI login API
    //
    // Example:
    // await authStore.login(form.email, form.password)

    await new Promise(resolve => setTimeout(resolve, 1000))

    await router.push('/')
  } catch (err) {
    error.value = 'Invalid email or password.'
  } finally {
    loading.value = false
  }
}

const handleGoogleLogin = () => {
  // TODO: Implement Google OAuth
  console.log('Google login')
}
</script>
```
