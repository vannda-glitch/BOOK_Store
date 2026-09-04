<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-2xl font-bold text-gray-900 mb-6">Order Details</h1>
    
    <div v-if="!loading && order">
      <div class="card p-6">
        <p class="text-gray-600">Order details for #{{ order.order_number }}</p>
        <p class="text-gray-600 mt-2">Total: ${{ order.total_amount.toFixed(2) }}</p>
        <p class="text-gray-600">Status: {{ order.status }}</p>
      </div>
    </div>
    
    <div v-else-if="!loading" class="text-center py-12">
      <h3 class="text-lg font-medium text-gray-900">Order not found</h3>
    </div>
    
    <div v-else class="flex justify-center py-12">
      <LoadingSpinner size="lg" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useOrders } from '~/composables/useOrders'
import LoadingSpinner from '~/components/common/LoadingSpinner.vue'

definePageMeta({
  middleware: 'auth'
})

const route = useRoute()
const { order, loading, fetchOrder } = useOrders()

const orderId = Number(route.params.id)
await fetchOrder(orderId)
</script>