<template>
  <div class="space-y-4">
    <div v-if="orders.length > 0">
      <div v-for="order in orders" :key="order.id" class="card p-4 hover:shadow-lg transition-shadow">
        <div class="flex flex-wrap items-center justify-between gap-4">
          <div>
            <NuxtLink :to="`/orders/${order.id}`" class="font-semibold text-gray-800 hover:text-primary-600">
              Order #{{ order.order_number }}
            </NuxtLink>
            <p class="text-sm text-gray-500">{{ formatDate(order.created_at) }}</p>
          </div>
          <div class="flex items-center gap-3">
            <span class="badge" :class="statusBadgeClass(order.status)">
              {{ formatStatus(order.status) }}
            </span>
            <span class="text-sm font-medium text-primary-600">
              ${{ order.total_amount.toFixed(2) }}
            </span>
          </div>
        </div>
        <div class="mt-3 flex items-center gap-2">
          <img
            v-for="item in order.items.slice(0, 3)"
            :key="item.id"
            :src="item.book.cover_image || '/images/default-book.jpg'"
            :alt="item.book.title"
            class="w-10 h-14 object-cover rounded border-2 border-white"
          />
          <span v-if="order.items.length > 3" class="text-sm text-gray-500">
            +{{ order.items.length - 3 }} more
          </span>
        </div>
      </div>
    </div>
    
    <div v-else class="text-center py-12">
      <Icon name="mdi:package-variant" size="48" class="text-gray-300 mx-auto" />
      <p class="mt-4 text-gray-500">No order history</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Order } from '~/types'
import { formatters } from '~/utils/formatters'

const props = defineProps<{
  orders: Order[]
}>()

const formatDate = formatters.date
const formatStatus = formatters.orderStatus

const statusBadgeClass = (status: string) => {
  const classes: Record<string, string> = {
    pending: 'badge-warning',
    processing: 'badge-info',
    shipped: 'badge-primary',
    delivered: 'badge-success',
    cancelled: 'badge-danger'
  }
  return classes[status] || 'badge-secondary'
}
</script>