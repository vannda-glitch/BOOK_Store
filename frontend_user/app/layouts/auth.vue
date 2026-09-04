<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 py-12 px-4 sm:px-6 lg:px-8">
    <div class="w-full max-w-md">
      <!-- Logo -->
      <div class="text-center mb-8">
        <NuxtLink to="/" class="inline-flex items-center gap-2">
          <Icon name="mdi:book-open" size="32" class="text-primary-600" />
          <span class="text-3xl font-bold text-primary-600">BookStore</span>
        </NuxtLink>
        <p class="mt-2 text-gray-600">Your one-stop book shop</p>
      </div>
      
      <!-- Form Container -->
      <div class="bg-white rounded-2xl shadow-xl p-8">
        <slot />
      </div>
      
      <!-- Footer -->
      <p class="mt-6 text-center text-sm text-gray-500">
        &copy; {{ new Date().getFullYear() }} BookStore. All rights reserved.
      </p>
    </div>
  </div>
</template>