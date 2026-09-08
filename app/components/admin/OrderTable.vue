<script setup lang="ts">

defineProps<{
  orders: any[]
}>()

</script>


<template>

  <div class="rounded-xl border border-gray-200 bg-white">
    <div class="overflow-x-auto">
      <table class="w-full">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Order ID</th>
            <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Customer</th>
            <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Email</th>
            <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Items</th>
            <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Total</th>
            <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Status</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr v-for="order in orders" :key="order.id" class="hover:bg-gray-50">
            <td class="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">#{{ order.id }}</td>
            <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{{ order.customerName || 'Guest' }}</td>
            <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{{ order.email || '-' }}</td>
            <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{{ order.items?.length || 0 }}</td>
            <td class="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">${{ (order.total || 0).toFixed(2) }}</td>
            <td class="whitespace-nowrap px-6 py-4">
              <span :class="{
                'bg-green-100 text-green-800': order.status === 'completed',
                'bg-yellow-100 text-yellow-800': order.status === 'pending',
                'bg-red-100 text-red-800': order.status === 'cancelled'
              }" class="rounded-full px-2 py-1 text-xs font-medium">
                {{ order.status || 'pending' }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-if="orders.length === 0" class="px-6 py-12 text-center text-gray-500">
      No orders found.
    </div>
  </div>

</template>
