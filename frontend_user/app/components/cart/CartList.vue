<template>
  <div class="bg-white rounded-lg shadow-sm">
    <div class="p-6 border-b border-gray-200">
      <div class="flex items-center justify-between">
        <h2 class="text-lg font-semibold text-gray-900">
          Cart Items ({{ items.length }})
        </h2>
        <button
          @click="handleClearCart"
          class="text-sm text-red-600 hover:text-red-700"
        >
          Clear Cart
        </button>
      </div>
    </div>
    
    <div class="divide-y divide-gray-100">
      <CartItem
        v-for="item in items"
        :key="item.id"
        :item="item"
        @update="handleUpdate"
        @remove="handleRemove"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CartItem } from '~/types'
import { useCart } from '~/composables/useCart'

defineProps<{
  items: CartItem[]
}>()

const { updateQuantity, removeFromCart, clearCart } = useCart()

const handleUpdate = (itemId: number, quantity: number) => {
  updateQuantity(itemId, quantity)
}

const handleRemove = (itemId: number) => {
  removeFromCart(itemId)
}

const handleClearCart = () => {
  if (confirm('Are you sure you want to clear your cart?')) {
    clearCart()
  }
}
</script>