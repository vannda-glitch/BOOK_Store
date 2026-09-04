<template>
  <div class="mx-auto max-w-[1600px] px-6 py-12 lg:px-12 lg:py-16">
    <div class="mb-8">
      <p class="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500 mb-2">
        Review Your Order
      </p>
      <h1 class="font-serif text-4xl font-bold tracking-tight text-gray-950 sm:text-5xl">
        Shopping Cart
      </h1>
    </div>

    <!-- Cart With Items -->
    <div v-if="items.length > 0" class="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
      <!-- Cart Items List -->
      <div class="lg:col-span-2 border border-gray-200 bg-white rounded-2xl p-6 md:p-8 shadow-sm">
        <CartList :items="items" />
      </div>

      <!-- Order Summary Card -->
      <div class="border border-gray-200 bg-white rounded-2xl p-6 md:p-8 shadow-sm sticky top-8">
        <CartSummary
          :items="items"
          :subtotal="subtotal"
          :shipping="shipping"
          :discount="discount"
          :total="total"
        />
      </div>
    </div>

    <!-- Empty Cart State -->
    <div v-else class="border border-gray-200 bg-white rounded-2xl p-12 text-center max-w-2xl mx-auto shadow-sm">
      <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#e9edf5] text-gray-700 mb-4">
        🛒
      </div>
      <h3 class="font-serif text-2xl font-bold text-gray-950 mb-2">Your cart is empty</h3>
      <p class="text-sm text-gray-500 mb-8 max-w-sm mx-auto">
        Looks like you haven't added any books to your cart yet. Explore our collection and find your next read.
      </p>
      <NuxtLink
        to="/books"
        class="inline-flex items-center gap-2 bg-black px-7 py-3 rounded-xl text-sm font-semibold text-white transition hover:bg-gray-800"
      >
        Start Shopping
        <span>→</span>
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