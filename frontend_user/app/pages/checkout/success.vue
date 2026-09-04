<template>
  <div class="container mx-auto px-4 py-16 text-center">
    <div class="max-w-md mx-auto">
      <div class="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <Icon name="mdi:check" size="40" class="text-green-600" />
      </div>
      
      <h1 class="text-3xl font-bold text-gray-900 mb-4">Order Placed Successfully! 🎉</h1>
      <p class="text-gray-600 mb-8">
        Thank you for your order! We've sent a confirmation email to your registered email address.
      </p>
      
      <div class="space-y-4">
        <NuxtLink to="/orders" class="btn btn-primary w-full">
          View My Orders
        </NuxtLink>
        <NuxtLink to="/books" class="btn btn-secondary w-full">
          Continue Shopping
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'auth'
})
</script>