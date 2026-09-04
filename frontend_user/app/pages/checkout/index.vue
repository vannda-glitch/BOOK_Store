<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>
    
    <div v-if="cartItems.length > 0" class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div class="lg:col-span-2">
        <div class="card p-6">
          <h3 class="font-semibold text-gray-900 mb-4">Shipping Address</h3>
          <p class="text-gray-600">Checkout form coming soon...</p>
        </div>
      </div>
      
      <div>
        <div class="card p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
          <p class="text-gray-600">Items: {{ cartItems.length }}</p>
          <p class="text-gray-600">Total: ${{ subtotal.toFixed(2) }}</p>
          <button class="btn btn-primary w-full mt-4">
            Place Order
          </button>
        </div>
      </div>
    </div>
    
    <div v-else class="text-center py-12">
      <Icon name="mdi:cart-outline" size="64" class="text-gray-300 mx-auto" />
      <h3 class="mt-4 text-lg font-medium text-gray-900">Your cart is empty</h3>
      <NuxtLink to="/books" class="btn btn-primary mt-4">
        Browse Books
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCart } from '~/composables/useCart'

definePageMeta({
  middleware: 'auth'
})

const { items: cartItems, subtotal } = useCart()
</script>