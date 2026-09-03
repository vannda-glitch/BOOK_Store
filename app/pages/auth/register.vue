<script setup lang="ts">

// ===============================
// Form data
// ===============================

const name = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')

// ===============================
// State
// ===============================

const errors = ref<string[]>([])
const successMessage = ref('')
const loading = ref(false)

// JSON Server URL
const API_URL = 'http://localhost:8000'

// ===============================
// Validation
// ===============================

const validateForm = () => {

  errors.value = []

  // Name validation
  if (!name.value.trim()) {

    errors.value.push(
      'Name is required.'
    )

  } else if (name.value.trim().length < 2) {

    errors.value.push(
      'Name must be at least 2 characters.'
    )
  }


  // Email validation
  if (!email.value.trim()) {

    errors.value.push(
      'Email is required.'
    )

  } else {

    const emailPattern =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (!emailPattern.test(email.value)) {

      errors.value.push(
        'Please enter a valid email address.'
      )
    }
  }


  // Password validation
  if (!password.value) {

    errors.value.push(
      'Password is required.'
    )

  } else if (password.value.length < 8) {

    errors.value.push(
      'Password must be at least 8 characters.'
    )
  }


  // Confirm password
  if (!confirmPassword.value) {

    errors.value.push(
      'Please confirm your password.'
    )

  } else if (
    password.value !==
    confirmPassword.value
  ) {

    errors.value.push(
      'Passwords do not match.'
    )
  }


  return errors.value.length === 0
}


// ===============================
// Register
// ===============================

const handleRegister = async () => {

  // Clear old messages
  errors.value = []
  successMessage.value = ''

  // Validate form
  const isValid = validateForm()

  if (!isValid) {
    return
  }

  loading.value = true

  try {

    // ==================================
    // Check if email already exists
    // ==================================

    const existingUsers = await $fetch<any[]>(
      `${API_URL}/users`,
      {
        params: {
          email: email.value.trim().toLowerCase()
        }
      }
    )


    if (existingUsers.length > 0) {

      errors.value.push(
        'This email is already registered.'
      )

      return
    }


    // ==================================
    // Create new user
    // ==================================

    const newUser = {

      name: name.value.trim(),

      email: email.value
        .trim()
        .toLowerCase(),

      password: password.value,

      // IMPORTANT:
      // Every registered account is USER
      role: 'user'

    }


    // ==================================
    // Send user to JSON Server
    // ==================================

    await $fetch(
      `${API_URL}/users`,
      {
        method: 'POST',

        body: newUser
      }
    )


    // ==================================
    // Success
    // ==================================

    successMessage.value =
      'Registration successful! Redirecting to login...'


    // Clear form
    name.value = ''
    email.value = ''
    password.value = ''
    confirmPassword.value = ''


    // Redirect to login
    setTimeout(() => {

      navigateTo('/auth/login')

    }, 1500)


  } catch (error) {

    console.error(
      'Registration error:',
      error
    )

    errors.value.push(
      'Something went wrong. Please try again.'
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

    <!-- Register Card -->

    <div
      class="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg"
    >

      <!-- Header -->

      <div class="mb-8 text-center">

        <h1
          class="text-3xl font-bold text-gray-900"
        >
          Create Account
        </h1>

        <p
          class="mt-2 text-sm text-gray-500"
        >
          Create your Book Store account
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
          Please fix the following:
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
      <!-- Success Message -->
      <!-- ========================== -->

      <div
        v-if="successMessage"
        class="mb-6 rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-700"
      >

        {{ successMessage }}

      </div>


      <!-- ========================== -->
      <!-- Register Form -->
      <!-- ========================== -->

      <form
        @submit.prevent="handleRegister"
        class="space-y-5"
      >

        <!-- Name -->

        <div>

          <label
            for="name"
            class="mb-2 block text-sm font-medium text-gray-700"
          >
            Full Name
          </label>

          <input
            id="name"
            v-model="name"
            type="text"
            placeholder="Enter your name"
            autocomplete="name"
            class="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-black focus:ring-1 focus:ring-black"
          />

        </div>


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
            placeholder="At least 8 characters"
            autocomplete="new-password"
            class="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-black focus:ring-1 focus:ring-black"
          />

        </div>


        <!-- Confirm Password -->

        <div>

          <label
            for="confirmPassword"
            class="mb-2 block text-sm font-medium text-gray-700"
          >
            Confirm Password
          </label>

          <input
            id="confirmPassword"
            v-model="confirmPassword"
            type="password"
            placeholder="Confirm your password"
            autocomplete="new-password"
            class="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-black focus:ring-1 focus:ring-black"
          />

        </div>


        <!-- Role -->

        <div
          class="rounded-lg bg-gray-50 p-3"
        >

          <div
            class="flex items-center justify-between"
          >

            <span
              class="text-sm text-gray-600"
            >
              Account type
            </span>

            <span
              class="rounded-full bg-gray-200 px-3 py-1 text-xs font-semibold text-gray-700"
            >
              User
            </span>

          </div>

          <p
            class="mt-2 text-xs text-gray-400"
          >
            New accounts are automatically registered as users.
          </p>

        </div>


        <!-- Register Button -->

        <button
          type="submit"
          :disabled="loading"
          class="w-full rounded-lg bg-black py-3 font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
        >

          <span v-if="loading">
            Creating account...
          </span>

          <span v-else>
            Create Account
          </span>

        </button>

      </form>


      <!-- ========================== -->
      <!-- Login Link -->
      <!-- ========================== -->

      <div
        class="mt-6 text-center text-sm text-gray-500"
      >

        Already have an account?

        <NuxtLink
          to="/auth/login"
          class="ml-1 font-semibold text-black hover:underline"
        >
          Login
        </NuxtLink>

      </div>

    </div>

  </div>

</template>