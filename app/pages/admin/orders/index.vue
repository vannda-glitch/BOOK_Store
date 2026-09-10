<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin' })
const API_URL = 'http://localhost:8000'; const orders = ref<any[]>([]); const loading = ref(true); const status = ref('')
onMounted(async () => { try { orders.value = await $fetch<any[]>(`${API_URL}/orders`) } finally { loading.value = false } })
const filtered = computed(() => status.value ? orders.value.filter(order => (order.status || 'pending') === status.value) : orders.value)
</script>
<template><section><AdminHeader title="Orders" description="Review customer orders and fulfillment status." /><div class="mb-5 flex justify-end"><select v-model="status" class="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm"><option value="">All statuses</option><option value="pending">Pending</option><option value="completed">Completed</option></select></div><div v-if="loading" class="py-20 text-center text-sm text-gray-500">Loading orders...</div><OrderTable v-else :orders="filtered" /></section></template>
