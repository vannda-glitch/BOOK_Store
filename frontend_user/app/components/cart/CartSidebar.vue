<template>
  <div
    class="fixed inset-0 z-50"
    :class="isOpen ? 'visible' : 'invisible'"
  >
    <!-- Overlay -->
    <div
      class="absolute inset-0 bg-black/50 transition-opacity"
      :class="isOpen ? 'opacity-100' : 'opacity-0'"
      @click="close"
    ></div>
    
    <!-- Sidebar -->
    <div
      class="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl transition-transform duration-300"
      :class="isOpen ? 'translate-x-0' : 'translate-x-full'"
    >
      <div class="flex flex-col h-full">
        <!-- Header -->
        <div class="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 class="text-lg font-semibold text-gray-900">Shopping Cart</h2>
          <button @click="close" class="text-gray-400 hover:text-gray-600">
            <Icon name="mdi:close" size="24" />
          </button>
        </div>
        
        <!-- Items -->
        <div class="flex-1 overflow-y-auto p-4">
          <div v-if="items.length > 0">
            <CartItem
              v-for="item in items"
              :key="item.id"
              :item="item"
              @update="handleUpdate"
              @remove="handleRemove"
            />
          </div>
          <div v-else class="text-center py-12">
            <Icon name="mdi:cart-outline" size="48" class="text-gray-300 mx-auto" />
            <p class="mt-4 text-gray-500">Your cart is empty</p>
          </div>
        </div>
        
        <!-- Footer -->
        <div v-if="items.length > 0" class="border-t border-gray-200 p-4">
          <div class="flex items-center justify-between mb-4">
            <span class="text-gray-600">Total:</span>
            <span class="text-xl font-bold text-primary-600">${{ total.toFixed(2) }}</span>
          </div>
          <div class="grid grid-cols-2 gap-2">
            <NuxtLink to="/cart" class="btn btn-secondary" @click="close">
              View Cart
            </NuxtLink>
            <NuxtLink to="/checkout" class="btn btn-primary" @click="close">
              Checkout
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CartItem } from '~/types'
import { useCart } from '~/composables/useCart'

const props = defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const { items, total, updateQuantity, removeFromCart } = useCart()

const close = () => {
  emit('close')
}

const handleUpdate = (itemId: number, quantity: number) => {
  updateQuantity(itemId, quantity)
}

const handleRemove = (itemId: number) => {
  removeFromCart(itemId)
}
</script>