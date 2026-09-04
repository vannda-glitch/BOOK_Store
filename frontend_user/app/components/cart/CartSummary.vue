<template>
  <div class="bg-gray-50 rounded-lg p-6">
    <h3 class="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
    
    <div class="space-y-3">
      <div class="flex justify-between text-sm">
        <span class="text-gray-600">Subtotal</span>
        <span class="font-medium">${{ subtotal.toFixed(2) }}</span>
      </div>
      
      <div class="flex justify-between text-sm">
        <span class="text-gray-600">Shipping</span>
        <span class="font-medium">${{ shipping.toFixed(2) }}</span>
      </div>
      
      <div v-if="discount > 0" class="flex justify-between text-sm text-green-600">
        <span>Discount</span>
        <span>-${{ discount.toFixed(2) }}</span>
      </div>
      
      <div class="border-t border-gray-200 pt-3">
        <div class="flex justify-between text-lg font-bold">
          <span>Total</span>
          <span>${{ total.toFixed(2) }}</span>
        </div>
      </div>
    </div>
    
    <NuxtLink
      to="/checkout"
      class="btn btn-primary w-full mt-6"
      :disabled="items.length === 0"
    >
      Proceed to Checkout
    </NuxtLink>
    
    <NuxtLink to="/books" class="block text-center text-sm text-primary-600 hover:text-primary-700 mt-4">
      Continue Shopping →
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  items: any[]
  subtotal: number
  shipping: number
  discount: number
  total: number
}>()
</script>