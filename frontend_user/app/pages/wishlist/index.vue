<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>
    
    <div v-if="items.length > 0" class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div class="lg:col-span-2">
        <CartList :items="items" />
      </div>
      
      <div>
        <CartSummary
          :items="items"
          :subtotal="subtotal"
          :shipping="shipping"
          :discount="discount"
          :total="total"
        />
      </div>
    </div>
    
    <div v-else class="text-center py-12">
      <Icon name="mdi:cart-outline" size="64" class="text-gray-300 mx-auto" />
      <h3 class="mt-4 text-lg font-medium text-gray-900">Your cart is empty</h3>
      <p class="text-gray-500 mt-1">Browse our books and add items to your cart</p>
      <NuxtLink to="/books" class="btn btn-primary mt-4">
        Start Shopping
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCart } from '~/composables/useCart'
import CartList from '~/components/cart/CartList.vue'
import CartSummary from '~/components/cart/CartSummary.vue'

definePageMeta({
  middleware: 'auth'
})

const { items, subtotal, total, fetchCart } = useCart()

const shipping = computed(() => {
  return subtotal.value > 50 ? 0 : 5.99
})

const discount = computed(() => 0)

await fetchCart()
</script>