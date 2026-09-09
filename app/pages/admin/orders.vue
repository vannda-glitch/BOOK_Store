<script setup lang="ts">

definePageMeta({
  layout: 'admin',
  middleware: 'admin'
})

const API_URL = 'http://localhost:8000'
const orders = ref<any[]>([])
const loading = ref(true)
const errorMessage = ref('')

const fetchOrders = async () => {
  loading.value = true
  errorMessage.value = ''

  try {
    orders.value = await $fetch<any[]>(`${API_URL}/orders`)
  } catch (error) {
    console.error('Failed to fetch orders:', error)
    errorMessage.value = 'Unable to load orders. Check that JSON Server is running.'
  } finally {
    loading.value = false
  }
}

onMounted(fetchOrders)
</script>

<template>
  <section>
    <div class="mb-6">
      <h2 class="text-xl font-bold text-gray-950">Orders</h2>
      <p class="mt-1 text-sm text-gray-500">Review customer orders and payment totals.</p>
    </div>

    <div v-if="loading" class="flex items-center justify-center py-20">
      <div class="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-black" />
    </div>

    <div v-else-if="errorMessage" class="rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
      {{ errorMessage }}
    </div>

    <OrderTable v-else :orders="orders" />
  </section>
</template>
