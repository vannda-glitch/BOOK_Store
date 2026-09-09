<script setup lang="ts">

definePageMeta({
  layout: false
})

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
    class="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#eaf6f3] px-4 py-10"
  >

    <div class="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_15%,rgba(15,118,110,0.25),transparent_30%),radial-gradient(circle_at_85%_85%,rgba(23,32,31,0.16),transparent_34%),linear-gradient(135deg,#f7f7f2_0%,#eaf6f3_52%,#cde9e3_100%)]" />

    <!-- Register Card -->

    <div
      class="relative w-full max-w-md rounded-[1.75rem] border border-white/80 bg-white/90 p-7 shadow-[0_28px_90px_rgba(23,32,31,0.16)] backdrop-blur-xl sm:p-10"
    >

      <NuxtLink to="/" class="mb-9 flex items-center justify-center gap-3 font-serif text-2xl font-bold tracking-tight text-ink">
        <span class="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-sm font-sans font-bold text-white shadow-lg shadow-primary/20">R+</span>
        <span>Read<span class="text-primary">Plus</span></span>
      </NuxtLink>

      <!-- Header -->

      <div class="mb-8 text-center">

        <h1
          class="display-heading text-4xl font-bold text-ink"
        >
          Create Account
        </h1>

        <p
          class="mt-2 text-sm text-gray-500"
        >
          Create your ReadPlus account
        </p>

      </div>


      <!-- ========================== -->
      <!-- Error Messages -->
      <!-- ========================== -->

      <div
        v-if="errors.length > 0"
        class="mb-6 rounded-xl border border-red-200 bg-red-50/90 p-4"
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
        class="mb-6 rounded-xl border border-[#b9dfd7] bg-[#eaf6f3] p-4 text-sm text-[#27645d]"
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
            class="mb-2 block text-sm font-semibold text-ink"
          >
            Full Name
          </label>

          <input
            id="name"
            v-model="name"
            type="text"
            placeholder="Enter your name"
            autocomplete="name"
            class="w-full rounded-xl border border-[#d5e3df] bg-[#fbfdfc] px-4 py-3 outline-none transition placeholder:text-gray-400 focus:border-primary focus:ring-4 focus:ring-primary/10"
          />

        </div>


        <!-- Email -->

        <div>

          <label
            for="email"
            class="mb-2 block text-sm font-semibold text-ink"
          >
            Email
          </label>

          <input
            id="email"
            v-model="email"
            type="email"
            placeholder="Enter your email"
            autocomplete="email"
            class="w-full rounded-xl border border-[#d5e3df] bg-[#fbfdfc] px-4 py-3 outline-none transition placeholder:text-gray-400 focus:border-primary focus:ring-4 focus:ring-primary/10"
          />

        </div>


        <!-- Password -->

        <div>

          <label
            for="password"
            class="mb-2 block text-sm font-semibold text-ink"
          >
            Password
          </label>

          <input
            id="password"
            v-model="password"
            type="password"
            placeholder="At least 8 characters"
            autocomplete="new-password"
            class="w-full rounded-xl border border-[#d5e3df] bg-[#fbfdfc] px-4 py-3 outline-none transition placeholder:text-gray-400 focus:border-primary focus:ring-4 focus:ring-primary/10"
          />

        </div>


        <!-- Confirm Password -->

        <div>

          <label
            for="confirmPassword"
            class="mb-2 block text-sm font-semibold text-ink"
          >
            Confirm Password
          </label>

          <input
            id="confirmPassword"
            v-model="confirmPassword"
            type="password"
            placeholder="Confirm your password"
            autocomplete="new-password"
            class="w-full rounded-xl border border-[#d5e3df] bg-[#fbfdfc] px-4 py-3 outline-none transition placeholder:text-gray-400 focus:border-primary focus:ring-4 focus:ring-primary/10"
          />

        </div>


        <!-- Role -->

        <div
          class="rounded-xl border border-[#dce9e4] bg-[#f2f9f7] p-4"
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
              class="rounded-full bg-[#d4eee8] px-3 py-1 text-xs font-semibold text-[#27645d]"
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
          class="w-full rounded-xl bg-primary py-3.5 font-semibold text-white shadow-lg shadow-primary/20 transition hover:-translate-y-0.5 hover:bg-[#0b5f59] disabled:cursor-not-allowed disabled:opacity-50"
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
          class="ml-1 font-semibold text-primary hover:underline"
        >
          Login
        </NuxtLink>

      </div>

    </div>

  </div>

</template>