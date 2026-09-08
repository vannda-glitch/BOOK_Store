<script setup lang="ts">

definePageMeta({
  layout: 'admin',
  middleware: 'admin'
})

const API_URL = 'http://localhost:8000'

const stats = ref({
  totalBooks: 0,
  totalUsers: 0,
  totalOrders: 0,
  totalRevenue: 0
})

const recentOrders = ref<any[]>([])
const loading = ref(true)

const fetchDashboardData = async () => {
  loading.value = true
  try {
    const [books, users, orders] = await Promise.all([
      $fetch<any[]>(`${API_URL}/books`),
      $fetch<any[]>(`${API_URL}/users`),
      $fetch<any[]>(`${API_URL}/orders`)
    ])

    stats.value = {
      totalBooks: books.length,
      totalUsers: users.length,
      totalOrders: orders.length,
      totalRevenue: orders.reduce((sum: number, order: any) => sum + (order.total || 0), 0)
    }

    recentOrders.value = orders.slice(-5).reverse()
  } catch (error) {
    console.error('Failed to fetch dashboard data:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchDashboardData()
})

</script>


<template>

  <div>
    <div v-if="loading" class="flex items-center justify-center py-20">
      <div class="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-black"></div>
    </div>

    <div v-else>
      <!-- Stats Grid -->
      <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div class="rounded-xl border border-gray-200 bg-white p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-500">Total Books</p>
              <p class="mt-2 text-3xl font-bold text-gray-950">{{ stats.totalBooks }}</p>
            </div>
            <div class="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-6 w-6 text-blue-600">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
              </svg>
            </div>
          </div>
        </div>

        <div class="rounded-xl border border-gray-200 bg-white p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-500">Total Users</p>
              <p class="mt-2 text-3xl font-bold text-gray-950">{{ stats.totalUsers }}</p>
            </div>
            <div class="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-6 w-6 text-green-600">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
              </svg>
            </div>
          </div>
        </div>

        <div class="rounded-xl border border-gray-200 bg-white p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-500">Total Orders</p>
              <p class="mt-2 text-3xl font-bold text-gray-950">{{ stats.totalOrders }}</p>
            </div>
            <div class="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-6 w-6 text-purple-600">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
              </svg>
            </div>
          </div>
        </div>

        <div class="rounded-xl border border-gray-200 bg-white p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-500">Total Revenue</p>
              <p class="mt-2 text-3xl font-bold text-gray-950">${{ stats.totalRevenue.toFixed(2) }}</p>
            </div>
            <div class="flex h-12 w-12 items-center justify-center rounded-full bg-orange-100">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-6 w-6 text-orange-600">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Orders -->
      <div class="mt-8 rounded-xl border border-gray-200 bg-white">
        <div class="border-b border-gray-200 px-6 py-4">
          <h2 class="text-lg font-semibold text-gray-950">Recent Orders</h2>
        </div>
        <div class="overflow-x-auto">
          <table v-if="recentOrders.length" class="w-full">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Order ID</th>
                <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Customer</th>
                <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Items</th>
                <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Total</th>
                <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Status</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr v-for="order in recentOrders" :key="order.id">
                <td class="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">#{{ order.id }}</td>
                <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{{ order.customerName || 'Guest' }}</td>
                <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{{ order.items?.length || 0 }}</td>
                <td class="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">${{ (order.total || 0).toFixed(2) }}</td>
                <td class="whitespace-nowrap px-6 py-4">
                  <span :class="order.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'" class="rounded-full px-2 py-1 text-xs font-medium">
                    {{ order.status || 'pending' }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
          <div v-else class="px-6 py-12 text-center text-gray-500">
            No orders yet
          </div>
        </div>
      </div>
    </div>
  </div>

</template>
