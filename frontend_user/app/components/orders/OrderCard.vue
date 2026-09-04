<template>
  <div class="card p-6 hover:shadow-lg transition-shadow">
    <div class="flex flex-wrap items-start justify-between gap-4">
      <div>
        <NuxtLink :to="`/orders/${order.id}`" class="text-lg font-semibold text-gray-900 hover:text-primary-600">
          Order #{{ order.order_number }}
        </NuxtLink>
        <p class="text-sm text-gray-500 mt-1">
          Placed on {{ formatDate(order.created_at) }}
        </p>
      </div>
      
      <div class="flex items-center gap-4">
        <span class="badge" :class="statusBadgeClass">
          {{ formatStatus(order.status) }}
        </span>
        <span class="badge" :class="paymentBadgeClass">
          {{ formatPaymentStatus(order.payment_status) }}
        </span>
      </div>
    </div>
    
    <div class="mt-4 flex flex-wrap items-center justify-between gap-4">
      <div class="flex items-center gap-4">
        <div class="flex -space-x-2">
          <img
            v-for="item in order.items.slice(0, 3)"
            :key="item.id"
            :src="item.book.cover_image || '/images/default-book.jpg'"
            :alt="item.book.title"
            class="w-12 h-16 object-cover rounded border-2 border-white"
          />
          <div v-if="order.items.length > 3" class="w-12 h-16 bg-gray-200 rounded border-2 border-white flex items-center justify-center text-sm font-medium text-gray-600">
            +{{ order.items.length - 3 }}
          </div>
        </div>
        <div>
          <p class="text-sm text-gray-600">
            {{ order.items.length }} item{{ order.items.length > 1 ? 's' : '' }}
          </p>
        </div>
      </div>
      
      <div class="text-right">
        <p class="text-lg font-bold text-primary-600">
          ${{ order.total_amount.toFixed(2) }}
        </p>
        <button
          @click="emit('view', order.id)"
          class="text-sm text-primary-600 hover:text-primary-700 font-medium"
        >
          View Details →
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Order } from '~/types'
import { formatters } from '~/utils/formatters'

const props = defineProps<{
  order: Order
}>()

const emit = defineEmits<{
  (e: 'view', orderId: number): void
}>()

const formatDate = formatters.date
const formatStatus = formatters.orderStatus
const formatPaymentStatus = (status: string) => {
  const map: Record<string, string> = {
    pending: 'Pending',
    paid: 'Paid',
    failed: 'Failed'
  }
  return map[status] || status
}

const statusBadgeClass = computed(() => {
  const classes = {
    pending: 'badge-warning',
    processing: 'badge-info',
    shipped: 'badge-primary',
    delivered: 'badge-success',
    cancelled: 'badge-danger'
  }
  return classes[props.order.status] || 'badge-secondary'
})

const paymentBadgeClass = computed(() => {
  const classes = {
    pending: 'badge-warning',
    paid: 'badge-success',
    failed: 'badge-danger'
  }
  return classes[props.order.payment_status] || 'badge-secondary'
})
</script>