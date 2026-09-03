
<script setup lang="ts">

// ===============================
// Form data
// ===============================

const email = ref('')
const password = ref('')

// ===============================
// State
// ===============================

const errors = ref<string[]>([])
const loading = ref(false)

// JSON Server URL
const API_URL = 'http://localhost:8000'


// ===============================
// Validation
// ===============================

const validateForm = () => {

  errors.value = []

  // Email
  if (!email.value.trim()) {

    errors.value.push(
      'Email is required.'
    )

  } else {

    const emailPattern =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (!emailPattern.test(email.value.trim())) {

      errors.value.push(
        'Please enter a valid email address.'
      )
    }
  }


  // Password
  if (!password.value) {

    errors.value.push(
      'Password is required.'
    )

  } else if (password.value.length < 8) {

    errors.value.push(
      'Password must be at least 8 characters.'
    )
  }


  return errors.value.length === 0
}


// ===============================
// Login
// ===============================

const handleLogin = async () => {

  errors.value = []

  // Validate
  if (!validateForm()) {
    return
  }

  loading.value = true

  try {

    // ===============================
    // Find user by email
    // ===============================

    const users = await $fetch<any[]>(
      `${API_URL}/users`,
      {
        params: {
          email: email.value
            .trim()
            .toLowerCase()
        }
      }
    )


    // ===============================
    // Check email
    // ===============================

    if (users.length === 0) {

      errors.value.push(
        'Email or password is incorrect.'
      )

      return
    }


    const user = users[0]


    // ===============================
    // Check password
    // ===============================

    if (user.password !== password.value) {

      errors.value.push(
        'Email or password is incorrect.'
      )

      return
    }


    // ===============================
    // Save logged-in user
    // ===============================

    const loggedUser = {

      id: user.id,

      name: user.name,

      email: user.email,

      role: user.role

    }


    localStorage.setItem(
      'user',
      JSON.stringify(loggedUser)
    )


    // ===============================
    // Redirect by role
    // ===============================

    if (user.role === 'admin') {

      await navigateTo('/admin')

    } else {

      await navigateTo('/')

    }

  } catch (error) {

    console.error(
      'Login error:',
      error
    )

    errors.value.push(
      'Unable to connect to the server. Please make sure JSON Server is running.'
    )

  } finally {

    loading.value = false
  }
}

</script>


<template>

  <div
    class="flex min-h-screen items-center justify-center bg-gray-100 px-4 py-10"
  >

    <!-- Login Card -->

    <div
      class="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg"
    >

      <!-- Header -->

      <div class="mb-8 text-center">

        <h1
          class="text-3xl font-bold text-gray-900"
        >
          Welcome Back
        </h1>

        <p
          class="mt-2 text-sm text-gray-500"
        >
          Login to your Book Store account
        </p>

      </div>


      <!-- ========================== -->
      <!-- Error Messages -->
      <!-- ========================== -->

      <div
        v-if="errors.length > 0"
        class="mb-6 rounded-lg border border-red-200 bg-red-50 p-4"
      >

        <div
          class="mb-2 font-semibold text-red-700"
        >
          Login failed
        </div>

        <ul
          class="list-disc space-y-1 pl-5 text-sm text-red-600"
        >

          <li
            v-for="error in errors"
            :key="error"
          >
            {{ error }}
          </li>

        </ul>

      </div>


      <!-- ========================== -->
      <!-- Login Form -->
      <!-- ========================== -->

      <form
        @submit.prevent="handleLogin"
        class="space-y-5"
      >

        <!-- Email -->

        <div>

          <label
            for="email"
            class="mb-2 block text-sm font-medium text-gray-700"
          >
            Email
          </label>

          <input
            id="email"
            v-model="email"
            type="email"
            placeholder="Enter your email"
            autocomplete="email"
            class="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-black focus:ring-1 focus:ring-black"
          />

        </div>


        <!-- Password -->

        <div>

          <label
            for="password"
            class="mb-2 block text-sm font-medium text-gray-700"
          >
            Password
          </label>

          <input
            id="password"
            v-model="password"
            type="password"
            placeholder="Enter your password"
            autocomplete="current-password"
            class="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-black focus:ring-1 focus:ring-black"
          />

        </div>


        <!-- Forgot Password -->

        <div class="text-right">

          <NuxtLink
            to="/forgot-password"
            class="text-sm text-gray-500 hover:text-black hover:underline"
          >
            Forgot password?
          </NuxtLink>

        </div>


        <!-- Login Button -->

        <button
          type="submit"
          :disabled="loading"
          class="w-full rounded-lg bg-black py-3 font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
        >

          <span v-if="loading">
            Logging in...
          </span>

          <span v-else>
            Login
          </span>

        </button>

      </form>


      <!-- ========================== -->
      <!-- Register -->
      <!-- ========================== -->

      <div
        class="mt-6 text-center text-sm text-gray-500"
      >

        Don't have an account?

        <NuxtLink
          to="/auth/register"
          class="ml-1 font-semibold text-black hover:underline"
        >
          Create Account
        </NuxtLink>

      </div>

    </div>

  </div>

</template>