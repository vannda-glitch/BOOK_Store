<template>
  <div v-if="order" class="space-y-6">
    <!-- Order Status -->
    <div class="card p-6">
      <div class="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 class="font-semibold text-gray-900">Order #{{ order.order_number }}</h3>
          <p class="text-sm text-gray-500">Placed on {{ formatDate(order.created_at) }}</p>
        </div>
        <div class="flex items-center gap-3">
          <span class="badge" :class="statusBadgeClass">
            {{ formatStatus(order.status) }}
          </span>
          <span class="badge" :class="paymentBadgeClass">
            {{ formatPaymentStatus(order.payment_status) }}
          </span>
          <button
            v-if="canCancel"
            @click="handleCancelOrder"
            class="btn btn-danger text-sm"
          >
            Cancel Order
          </button>
        </div>
      </div>
    </div>
    
    <!-- Order Items -->
    <div class="card p-6">
      <h4 class="font-semibold text-gray-900 mb-4">Order Items</h4>
      <div class="divide-y divide-gray-100">
        <div v-for="item in order.items" :key="item.id" class="py-4 first:pt-0">
          <div class="flex items-start gap-4">
            <img
              :src="item.book.cover_image || '/images/default-book.jpg'"
              :alt="item.book.title"
              class="w-16 h-20 object-cover rounded"
            />
            <div class="flex-1">
              <NuxtLink :to="`/books/${item.book.slug}`" class="font-medium text-gray-800 hover:text-primary-600">
                {{ item.book.title }}
              </NuxtLink>
              <p class="text-sm text-gray-600">by {{ item.book.author?.name }}</p>
              <p class="text-sm text-gray-500">Qty: {{ item.quantity }}</p>
            </div>
            <div class="text-right">
              <p class="font-medium text-primary-600">${{ item.total_price.toFixed(2) }}</p>
              <p class="text-sm text-gray-500">${{ item.unit_price.toFixed(2) }} each</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Order Summary -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="card p-6">
        <h4 class="font-semibold text-gray-900 mb-3">Shipping Address</h4>
        <p class="text-gray-700 whitespace-pre-line">{{ order.shipping_address }}</p>
        <p class="text-sm text-gray-500 mt-2">
          <span class="font-medium">Delivery Method:</span> {{ order.delivery_method || 'Standard' }}
        </p>
      </div>
      
      <div class="card p-6">
        <h4 class="font-semibold text-gray-900 mb-3">Order Summary</h4>
        <div class="space-y-2">
          <div class="flex justify-between text-sm">
            <span class="text-gray-600">Subtotal</span>
            <span>${{ order.subtotal.toFixed(2) }}</span>
          </div>
          <div class="flex justify-between text-sm">
            <span class="text-gray-600">Shipping Fee</span>
            <span>${{ order.shipping_fee.toFixed(2) }}</span>
          </div>
          <div v-if="order.discount_amount > 0" class="flex justify-between text-sm text-green-600">
            <span>Discount</span>
            <span>-${{ order.discount_amount.toFixed(2) }}</span>
          </div>
          <div class="border-t border-gray-200 pt-2">
            <div class="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span class="text-primary-600">${{ order.total_amount.toFixed(2) }}</span>
            </div>
          </div>
        </div>
        
        <div v-if="order.payment_method" class="mt-4 pt-4 border-t border-gray-200">
          <p class="text-sm text-gray-600">
            <span class="font-medium">Payment Method:</span> {{ order.payment_method }}
          </p>
        </div>
      </div>
    </div>
    
    <!-- Tracking Info -->
    <div v-if="order.tracking_number" class="card p-6">
      <h4 class="font-semibold text-gray-900 mb-3">Tracking Information</h4>
      <div class="flex items-center gap-4">
        <Icon name="mdi:truck" size="24" class="text-primary-600" />
        <div>
          <p class="font-medium text-gray-800">Tracking Number: {{ order.tracking_number }}</p>
          <p v-if="order.estimated_delivery" class="text-sm text-gray-500">
            Estimated Delivery: {{ formatDate(order.estimated_delivery) }}
          </p>
        </div>
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
  (e: 'cancel'): void
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
  const classes: Record<string, string> = {
    pending: 'badge-warning',
    processing: 'badge-info',
    shipped: 'badge-primary',
    delivered: 'badge-success',
    cancelled: 'badge-danger'
  }
  return classes[props.order.status] || 'badge-secondary'
})

const paymentBadgeClass = computed(() => {
  const classes: Record<string, string> = {
    pending: 'badge-warning',
    paid: 'badge-success',
    failed: 'badge-danger'
  }
  return classes[props.order.payment_status] || 'badge-secondary'
})

const canCancel = computed(() => {
  return ['pending', 'processing'].includes(props.order.status)
})

const handleCancelOrder = () => {
  if (confirm('Are you sure you want to cancel this order?')) {
    emit('cancel')
  }
}
</script>