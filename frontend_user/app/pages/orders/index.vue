<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold text-gray-900 mb-8">My Orders</h1>
    
    <div v-if="orders.length > 0">
      <div class="space-y-4">
        <div v-for="order in orders" :key="order.id" class="card p-4">
          <div class="flex items-center justify-between">
            <div>
              <p class="font-semibold">Order #{{ order.order_number }}</p>
              <p class="text-sm text-gray-500">{{ new Date(order.created_at).toLocaleDateString() }}</p>
            </div>
            <div class="text-right">
              <p class="font-bold text-primary-600">${{ order.total_amount.toFixed(2) }}</p>
              <span class="badge badge-primary">{{ order.status }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div v-else class="text-center py-12">
      <Icon name="mdi:package-variant" size="64" class="text-gray-300 mx-auto" />
      <h3 class="mt-4 text-lg font-medium text-gray-900">No orders yet</h3>
      <p class="text-gray-500 mt-1">Start shopping to place your first order</p>
      <NuxtLink to="/books" class="btn btn-primary mt-4">
        Start Shopping
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useOrders } from '~/composables/useOrders'

definePageMeta({
  middleware: 'auth'
})

const { orders, fetchOrders } = useOrders()

await fetchOrders()
</script>