<script setup lang="ts">
definePageMeta({ layout: "admin", middleware: "admin" });

// --- Types ---
interface OrderItem {
  id: string | number;
  [key: string]: any;
}

interface Order {
  id: string | number;
  status?: "pending" | "completed" | "cancelled" | string;
  total?: number | string;
  createdAt?: string | Date;
  customerName?: string;
  email?: string;
  items?: OrderItem[];
}

const API_URL = "http://localhost:8000";
const statusFilter = ref("");

// --- Data Fetching (Nuxt 3 Standard) ---
const { data: orders, pending, error } = await useFetch<Order[]>(`${API_URL}/orders`, {
  default: () => [],
  server: false, // Set to true if you want SSR for this admin route
});

// --- Computed Properties ---
const filteredOrders = computed(() => {
  if (!orders.value.length) return [];
  if (!statusFilter.value) return orders.value;
  
  return orders.value.filter(
    (order) => (order.status || "pending").toLowerCase() === statusFilter.value
  );
});

const totalRevenue = computed(() =>
  orders.value.reduce((sum, order) => sum + Number(order.total || 0), 0)
);

const pendingCount = computed(() =>
  orders.value.filter((order) => (order.status || "pending").toLowerCase() === "pending").length
);

const completedCount = computed(() =>
  orders.value.filter((order) => (order.status || "").toLowerCase() === "completed").length
);

// --- Utilities ---
const formatDate = (value?: string | Date) => {
  if (!value) return "No date";
  const date = new Date(value);
  
  return Number.isNaN(date.getTime())
    ? "No date"
    : new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }).format(date);
};

const getStatusClass = (status?: string) => {
  const current = (status || "pending").toLowerCase();
  
  const classes: Record<string, string> = {
    completed: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    cancelled: "bg-red-50 text-red-700 ring-red-200",
    pending: "bg-amber-50 text-amber-700 ring-amber-200",
  };

  return classes[current] || classes.pending;
};
</script>

<template>
  <section>
    <!-- Header -->
    <div class="mb-8">
      <p class="text-[10px] font-bold uppercase tracking-[0.24em] text-primary">Manage</p>
      <h1 class="mt-2 font-serif text-3xl font-bold tracking-tight text-ink sm:text-4xl">Orders</h1>
      <p class="mt-2 text-sm text-gray-500">Review customer orders and fulfillment status.</p>
    </div>

    <!-- Stats Grid -->
    <div class="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <div class="rounded-2xl border border-[#d9e7e2] bg-white p-5 shadow-sm">
        <p class="text-xs font-semibold uppercase tracking-wider text-gray-400">Total orders</p>
        <p class="mt-3 font-serif text-3xl font-bold text-ink">{{ orders.length }}</p>
        <p class="mt-1 text-xs text-gray-500">All customer orders</p>
      </div>
      
      <div class="rounded-2xl border border-[#d9e7e2] bg-white p-5 shadow-sm">
        <p class="text-xs font-semibold uppercase tracking-wider text-gray-400">Pending</p>
        <p class="mt-3 font-serif text-3xl font-bold text-amber-600">{{ pendingCount }}</p>
        <p class="mt-1 text-xs text-gray-500">Need fulfillment</p>
      </div>
      
      <div class="rounded-2xl border border-[#d9e7e2] bg-white p-5 shadow-sm">
        <p class="text-xs font-semibold uppercase tracking-wider text-gray-400">Completed</p>
        <p class="mt-3 font-serif text-3xl font-bold text-emerald-600">{{ completedCount }}</p>
        <p class="mt-1 text-xs text-gray-500">Successfully fulfilled</p>
      </div>
      
      <div class="rounded-2xl border border-[#d9e7e2] bg-white p-5 shadow-sm">
        <p class="text-xs font-semibold uppercase tracking-wider text-gray-400">Order value</p>
        <p class="mt-3 font-serif text-3xl font-bold text-primary">${{ totalRevenue.toFixed(2) }}</p>
        <p class="mt-1 text-xs text-gray-500">Across all orders</p>
      </div>
    </div>

    <!-- Toolbar -->
    <div class="mt-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
      <div>
        <h2 class="font-serif text-2xl font-bold text-ink">All orders</h2>
        <p class="mt-1 text-sm text-gray-500">{{ filteredOrders.length }} orders shown</p>
      </div>
      
      <select
        v-model="statusFilter"
        aria-label="Filter orders by status"
        class="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-primary"
      >
        <option value="">All statuses</option>
        <option value="pending">Pending</option>
        <option value="completed">Completed</option>
        <option value="cancelled">Cancelled</option>
      </select>
    </div>

    <!-- State Management & Data Table -->
    <div v-if="error" class="mt-5 rounded-xl bg-red-50 p-4 text-sm text-red-700">
      Unable to load orders. Please check that the API is running.
    </div>
    
    <div v-else-if="pending" class="mt-5 rounded-2xl border border-[#d9e7e2] bg-white py-24 text-center text-sm text-gray-500">
      Loading orders...
    </div>
    
    <div v-else-if="filteredOrders.length === 0" class="mt-5 rounded-2xl border border-[#d9e7e2] bg-white py-24 text-center">
      <p class="font-serif text-2xl font-bold text-ink">No orders found</p>
      <p class="mt-2 text-sm text-gray-500">Try selecting a different status filter.</p>
    </div>
    
    <div v-else class="mt-5 overflow-hidden rounded-2xl border border-[#d9e7e2] bg-white shadow-sm">
      <div class="overflow-x-auto">
        <table class="w-full min-w-[880px]">
          <thead class="border-b border-[#e6efec] bg-[#f7fbfa]">
            <tr>
              <th class="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">Order</th>
              <th class="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">Customer</th>
              <th class="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">Items</th>
              <th class="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">Total</th>
              <th class="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">Status</th>
              <th class="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-gray-400">Action</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-[#edf3f1]">
            <tr
              v-for="order in filteredOrders"
              :key="order.id"
              class="transition hover:bg-[#fbfdfc]"
            >
              <td class="px-6 py-5">
                <NuxtLink :to="`/admin/orders/${order.id}`" class="font-semibold text-ink hover:text-primary">
                  #{{ order.id }}
                </NuxtLink>
                <p class="mt-1 text-xs text-gray-400">{{ formatDate(order.createdAt) }}</p>
              </td>
              <td class="px-6 py-5">
                <p class="font-semibold text-gray-900">{{ order.customerName || "Guest customer" }}</p>
                <p class="mt-1 text-xs text-gray-500">{{ order.email || "No email" }}</p>
              </td>
              <td class="px-6 py-5 text-sm text-gray-600">
                {{ order.items?.length || 0 }} {{ (order.items?.length || 0) === 1 ? "item" : "items" }}
              </td>
              <td class="px-6 py-5 text-sm font-bold text-gray-900">
                ${{ Number(order.total || 0).toFixed(2) }}
              </td>
              <td class="px-6 py-5">
                <span
                  :class="getStatusClass(order.status)"
                  class="inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize ring-1 ring-inset"
                >
                  {{ order.status || "pending" }}
                </span>
              </td>
              <td class="px-6 py-5 text-right">
                <NuxtLink
                  :to="`/admin/orders/${order.id}`"
                  class="inline-flex rounded-lg border border-gray-200 px-3 py-2 text-xs font-semibold text-primary transition hover:border-primary hover:bg-[#edf8f5]"
                >
                  View details
                </NuxtLink>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>
</template>