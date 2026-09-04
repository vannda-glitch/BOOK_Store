<template>
  <div class="text-center space-y-6">
    <div class="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
      <Icon name="mdi:check" size="40" class="text-green-600" />
    </div>
    
    <h2 class="text-2xl font-bold text-gray-900">Order Placed Successfully!</h2>
    <p class="text-gray-600">
      Thank you for your order! We'll send you a confirmation email shortly.
    </p>
    
    <div class="bg-gray-50 rounded-lg p-6 text-left">
      <h3 class="font-semibold text-gray-900 mb-3">Order Details</h3>
      <div class="space-y-2 text-sm">
        <p><span class="font-medium text-gray-600">Order Number:</span> #{{ order?.order_number }}</p>
        <p><span class="font-medium text-gray-600">Total Amount:</span> ${{ order?.total_amount.toFixed(2) }}</p>
        <p><span class="font-medium text-gray-600">Payment Method:</span> {{ order?.payment_method }}</p>
        <p><span class="font-medium text-gray-600">Status:</span> 
          <span class="badge badge-success">{{ order?.status }}</span>
        </p>
      </div>
    </div>
    
    <div class="flex flex-col sm:flex-row gap-4 justify-center">
      <NuxtLink to="/orders" class="btn btn-primary">
        <Icon name="mdi:package-variant" size="16" class="inline mr-2" />
        View Orders
      </NuxtLink>
      <NuxtLink to="/books" class="btn btn-secondary">
        <Icon name="mdi:bookshelf" size="16" class="inline mr-2" />
        Continue Shopping
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Order } from '~/types'

defineProps<{
  order: Order | null
}>()
</script>