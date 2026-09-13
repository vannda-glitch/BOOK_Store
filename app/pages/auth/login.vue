<script setup lang="ts">
definePageMeta({
  layout: false,
});

// ===============================
// Form data
// ===============================

const email = ref("");
const password = ref("");

// ===============================
// State
// ===============================

const errors = ref<string[]>([]);
const loading = ref(false);

// JSON Server URL
const API_URL = "http://localhost:8000";

// ===============================
// Validation
// ===============================

const validateForm = () => {
  errors.value = [];

  // Email
  if (!email.value.trim()) {
    errors.value.push("Email is required.");
  } else {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email.value.trim())) {
      errors.value.push("Please enter a valid email address.");
    }
  }

  // Password
  if (!password.value) {
    errors.value.push("Password is required.");
  } else if (password.value.length < 8) {
    errors.value.push("Password must be at least 8 characters.");
  }

  return errors.value.length === 0;
};

// ===============================
// Login
// ===============================

const handleLogin = async () => {
  errors.value = [];

  // Validate
  if (!validateForm()) {
    return;
  }

  loading.value = true;

  try {
    // ===============================
    // Find user by email
    // ===============================

    const users = await $fetch<any[]>(`${API_URL}/users`, {
      params: {
        email: email.value.trim().toLowerCase(),
      },
    });

    // ===============================
    // Check email
    // ===============================

    if (users.length === 0) {
      errors.value.push("Email or password is incorrect.");

      return;
    }

    const user = users[0];

    // ===============================
    // Check password
    // ===============================

    if (user.password !== password.value) {
      errors.value.push("Email or password is incorrect.");

      return;
    }

    // ===============================
    // Save logged-in user
    // ===============================

    const loggedUser = {
      id: user.id,

      name: user.name,

      email: user.email,

      role: user.role,

      profileImage: user.profileImage || "",
    };

    localStorage.setItem("user", JSON.stringify(loggedUser));

    window.dispatchEvent(new CustomEvent("auth-changed"));

    // ===============================
    // Redirect by role
    // ===============================

    if (user.role === "admin") {
      await navigateTo("/admin");
    } else {
      await navigateTo("/");
    }
  } catch (error) {
    console.error("Login error:", error);

    errors.value.push(
      "Unable to connect to the server. Please make sure JSON Server is running.",
    );
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div
    class="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#eaf6f3] px-4 py-10"
  >
    <div
      class="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_15%,rgba(15,118,110,0.25),transparent_30%),radial-gradient(circle_at_85%_85%,rgba(23,32,31,0.16),transparent_34%),linear-gradient(135deg,#f7f7f2_0%,#eaf6f3_52%,#cde9e3_100%)]"
    />

    <!-- Login Card -->

    <div
      class="relative w-full max-w-md rounded-[1.75rem] border border-white/80 bg-white/90 p-7 shadow-[0_28px_90px_rgba(23,32,31,0.16)] backdrop-blur-xl sm:p-10"
    >
      <NuxtLink
        to="/"
        class="mb-9 flex items-center justify-center gap-3 font-serif text-2xl font-bold tracking-tight text-ink"
      >
        <span
          class="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-sm font-sans font-bold text-white shadow-lg shadow-primary/20"
          >R+</span
        >
        <span>Read<span class="text-primary">Plus</span></span>
      </NuxtLink>

      <!-- Header -->

      <div class="mb-8 text-center">
        <h1 class="display-heading text-4xl font-bold text-ink">
          Welcome Back
        </h1>

        <p class="mt-2 text-sm text-gray-500">
          Sign in to continue your reading journey
        </p>
      </div>

      <!-- ========================== -->
      <!-- Error Messages -->
      <!-- ========================== -->

      <div
        v-if="errors.length > 0"
        class="mb-6 rounded-xl border border-red-200 bg-red-50/90 p-4"
      >
        <div class="mb-2 font-semibold text-red-700">Login failed</div>

        <ul class="list-disc space-y-1 pl-5 text-sm text-red-600">
          <li v-for="error in errors" :key="error">
            {{ error }}
          </li>
        </ul>
      </div>

      <!-- ========================== -->
      <!-- Login Form -->
      <!-- ========================== -->

      <form @submit.prevent="handleLogin" class="space-y-5">
        <!-- Email -->

        <div>
          <label for="email" class="mb-2 block text-sm font-semibold text-ink">
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
            placeholder="Enter your password"
            autocomplete="current-password"
            class="w-full rounded-xl border border-[#d5e3df] bg-[#fbfdfc] px-4 py-3 outline-none transition placeholder:text-gray-400 focus:border-primary focus:ring-4 focus:ring-primary/10"
          />
        </div>

        <!-- Forgot Password -->

        <div class="text-right">
          <NuxtLink
            to="/contact"
            class="text-sm text-gray-500 transition hover:text-primary hover:underline"
          >
            Forgot password?
          </NuxtLink>
        </div>

        <!-- Login Button -->

        <button
          type="submit"
          :disabled="loading"
          class="w-full rounded-xl bg-primary py-3.5 font-semibold text-white shadow-lg shadow-primary/20 transition hover:-translate-y-0.5 hover:bg-[#0b5f59] disabled:cursor-not-allowed disabled:opacity-50"
        >
          <span v-if="loading"> Logging in... </span>

          <span v-else> Login </span>
        </button>
      </form>

      <!-- ========================== -->
      <!-- Register -->
      <!-- ========================== -->

      <div class="mt-6 text-center text-sm text-gray-500">
        Don't have an account?

        <NuxtLink
          to="/auth/register"
          class="ml-1 font-semibold text-primary hover:underline"
        >
          Create Account
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
