<template>
  <div class="space-y-4">
    <OrderCard
      v-for="order in orders"
      :key="order.id"
      :order="order"
      @view="handleViewOrder"
    />
    
    <div v-if="orders.length === 0" class="text-center py-12">
      <Icon name="mdi:package-variant" size="48" class="text-gray-300 mx-auto" />
      <p class="mt-4 text-gray-500">No orders found</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Order } from '~/types'

const props = defineProps<{
  orders: Order[]
}>()

const emit = defineEmits<{
  (e: 'view', orderId: number): void
}>()

const handleViewOrder = (orderId: number) => {
  emit('view', orderId)
}
</script>