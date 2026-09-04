<template>
  <div class="bg-gray-50 rounded-lg p-6">
    <h3 class="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
    
    <div class="space-y-4">
      <!-- Items preview -->
      <div class="max-h-48 overflow-y-auto space-y-2">
        <div v-for="item in items" :key="item.id" class="flex items-center gap-3 text-sm">
          <img
            :src="item.book.cover_image || '/images/default-book.jpg'"
            :alt="item.book.title"
            class="w-10 h-14 object-cover rounded"
          />
          <div class="flex-1">
            <p class="font-medium text-gray-800 truncate">{{ item.book.title }}</p>
            <p class="text-gray-500">Qty: {{ item.quantity }}</p>
          </div>
          <p class="font-medium text-primary-600">
            ${{ ((item.book.discount_price || item.book.price) * item.quantity).toFixed(2) }}
          </p>
        </div>
      </div>
      
      <div class="border-t border-gray-200 pt-4 space-y-2">
        <div class="flex justify-between text-sm">
          <span class="text-gray-600">Subtotal</span>
          <span>${{ subtotal.toFixed(2) }}</span>
        </div>
        
        <div class="flex justify-between text-sm">
          <span class="text-gray-600">Shipping</span>
          <span>${{ shipping.toFixed(2) }}</span>
        </div>
        
        <div v-if="discount > 0" class="flex justify-between text-sm text-green-600">
          <span>Discount</span>
          <span>-${{ discount.toFixed(2) }}</span>
        </div>
        
        <div class="border-t border-gray-200 pt-2">
          <div class="flex justify-between text-lg font-bold">
            <span>Total</span>
            <span class="text-primary-600">${{ total.toFixed(2) }}</span>
          </div>
        </div>
      </div>
      
      <!-- Coupon Code -->
      <div class="pt-4 border-t border-gray-200">
        <div class="flex gap-2">
          <input
            v-model="couponCode"
            type="text"
            placeholder="Enter coupon code"
            class="input flex-1 text-sm"
          />
          <button
            @click="applyCoupon"
            class="btn btn-primary text-sm whitespace-nowrap"
          >
            Apply
          </button>
        </div>
        <p v-if="couponError" class="text-xs text-red-600 mt-1">{{ couponError }}</p>
        <p v-if="couponSuccess" class="text-xs text-green-600 mt-1">{{ couponSuccess }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CartItem } from '~/types'

const props = defineProps<{
  items: CartItem[]
  subtotal: number
  shipping: number
  discount: number
  total: number
}>()

const emit = defineEmits<{
  (e: 'apply-coupon', code: string): void
}>()

const couponCode = ref('')
const couponError = ref('')
const couponSuccess = ref('')

const applyCoupon = () => {
  if (!couponCode.value.trim()) {
    couponError.value = 'Please enter a coupon code'
    return
  }
  
  couponError.value = ''
  emit('apply-coupon', couponCode.value)
}
</script>