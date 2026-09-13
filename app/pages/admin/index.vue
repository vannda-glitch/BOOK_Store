<script setup lang="ts">
definePageMeta({ layout: "admin", middleware: "admin" });
const API_URL = "http://localhost:8000";
const loading = ref(true);
const errorMessage = ref("");
const books = ref<any[]>([]);
const users = ref<any[]>([]);
const orders = ref<any[]>([]);
const categories = ref<any[]>([]);

const loadDashboard = async () => {
  try {
    const [bookData, userData, orderData, categoryData] = await Promise.all([
      $fetch<any[]>(`${API_URL}/books`),
      $fetch<any[]>(`${API_URL}/users`),
      $fetch<any[]>(`${API_URL}/orders`),
      $fetch<any[]>(`${API_URL}/categories`),
    ]);
    books.value = bookData;
    users.value = userData;
    orders.value = orderData;
    categories.value = categoryData;
  } catch {
    errorMessage.value =
      "Unable to load dashboard data. Check that the API server is running.";
  } finally {
    loading.value = false;
  }
};
const totalRevenue = computed(() =>
  orders.value.reduce((sum, order) => sum + Number(order.total || 0), 0),
);
const pendingOrders = computed(() =>
  orders.value.filter(
    (order) => String(order.status || "pending").toLowerCase() === "pending",
  ),
);
const recentOrders = computed(() =>
  [...orders.value]
    .sort(
      (a, b) =>
        new Date(b.createdAt || 0).getTime() -
        new Date(a.createdAt || 0).getTime(),
    )
    .slice(0, 5),
);
const categoryBreakdown = computed(() =>
  categories.value
    .map((category) => ({
      name: category.name,
      count: books.value.filter(
        (book) =>
          String(book.category || "").toLowerCase() ===
          String(category.name).toLowerCase(),
      ).length,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5),
);
const maxCategoryCount = computed(() =>
  Math.max(...categoryBreakdown.value.map((item) => item.count), 1),
);
const money = (value: number) => `$${value.toFixed(2)}`;
onMounted(loadDashboard);
</script>

<template>
  <section class="space-y-6">
    <div class="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div>
        <p class="eyebrow">Admin workspace</p>
        <h1 class="mt-2 font-serif text-4xl font-bold tracking-tight text-ink">
          Dashboard
        </h1>
        <p class="mt-2 text-sm text-gray-500">
          A real-time view of your bookstore.
        </p>
      </div>
      <div class="flex flex-wrap gap-2">
        <NuxtLink to="/admin/categories/create" class="action-secondary"
          >+ Add category</NuxtLink
        ><NuxtLink to="/admin/books/create" class="action-primary"
          >+ Add new book</NuxtLink
        >
      </div>
    </div>
    <p
      v-if="errorMessage"
      class="rounded-xl bg-red-50 p-4 text-sm text-red-700"
    >
      {{ errorMessage }}
    </p>
    <div
      v-if="loading"
      class="rounded-2xl border border-[#d9e7e2] bg-white py-24 text-center text-sm text-gray-500"
    >
      Loading dashboard...
    </div>
    <template v-else>
      <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div class="metric-card">
          <div>
            <p class="metric-label">Total books</p>
            <p class="metric-value">{{ books.length.toLocaleString() }}</p>
            <p class="metric-note text-primary">+12.4% this week</p>
          </div>
          <span class="metric-icon bg-[#e8f1ff] text-[#3974d9]"
            ><UiIcon name="book" class="h-5 w-5"
          /></span>
        </div>
        <div class="metric-card">
          <div>
            <p class="metric-label">Total customers</p>
            <p class="metric-value">{{ users.length.toLocaleString() }}</p>
            <p class="metric-note text-primary">+5.4% new members</p>
          </div>
          <span class="metric-icon bg-[#e4f8f0] text-[#15936b]"
            ><UiIcon name="users" class="h-5 w-5"
          /></span>
        </div>
        <div class="metric-card">
          <div>
            <p class="metric-label">Total orders</p>
            <p class="metric-value">{{ orders.length.toLocaleString() }}</p>
            <p class="metric-note text-amber-600">
              {{ pendingOrders.length }} pending fulfillment
            </p>
          </div>
          <span class="metric-icon bg-[#f3eaff] text-[#8b55d9]"
            ><UiIcon name="bag" class="h-5 w-5"
          /></span>
        </div>
        <div class="metric-card">
          <div>
            <p class="metric-label">Total revenue</p>
            <p class="metric-value">{{ money(totalRevenue) }}</p>
            <p class="metric-note text-primary">+14.2% vs last month</p>
          </div>
          <span class="metric-icon bg-[#fff2d9] text-[#d48819]"
            ><span class="text-lg font-bold">$</span></span
          >
        </div>
      </div>
      <div class="grid gap-5 xl:grid-cols-[minmax(0,1.7fr)_minmax(260px,1fr)]">
        <div class="panel">
          <div class="panel-heading">
            <div>
              <h2>Weekly sales performance</h2>
              <p>Revenue from recent bookstore orders</p>
            </div>
            <span class="legend"><i class="bg-primary"></i>Revenue</span>
          </div>
          <div class="chart-area">
            <div v-for="day in 7" :key="day" class="bar-column">
              <div class="bar-track">
                <span
                  class="bar-fill"
                  :style="{ height: `${day * 11 + 12}%` }"
                ></span>
              </div>
              <span>{{
                ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][day - 1]
              }}</span>
            </div>
          </div>
          <div class="panel-footer">
            <span>Weekly revenue: {{ money(totalRevenue) }}</span
            ><NuxtLink to="/admin/orders">View all orders -></NuxtLink>
          </div>
        </div>
        <div class="panel">
          <div class="panel-heading">
            <div>
              <h2>Category breakdown</h2>
              <p>Books by category</p>
            </div>
            <span class="status-pill">Active</span>
          </div>
          <div class="space-y-4 pt-5">
            <div v-for="category in categoryBreakdown" :key="category.name">
              <div class="mb-1 flex justify-between text-xs text-gray-600">
                <span>{{ category.name }}</span
                ><strong>{{ category.count }}</strong>
              </div>
              <div class="h-2 rounded-full bg-[#e9f1ef]">
                <span
                  class="block h-2 rounded-full bg-primary"
                  :style="{
                    width: `${Math.max((category.count / maxCategoryCount) * 100, 5)}%`,
                  }"
                ></span>
              </div>
            </div>
            <p v-if="!categoryBreakdown.length" class="text-sm text-gray-500">
              No categories yet.
            </p>
          </div>
        </div>
      </div>
      <div class="panel overflow-hidden">
        <div class="panel-heading border-b border-[#edf2f0] pb-4">
          <div>
            <h2>Recent orders</h2>
            <p>Latest customer orders awaiting fulfillment</p>
          </div>
          <div class="flex gap-2 text-xs">
            <span class="tab-active">All orders</span
            ><NuxtLink to="/admin/orders" class="tab-link"
              >Pending {{ pendingOrders.length }}</NuxtLink
            ><NuxtLink to="/admin/orders" class="tab-link">Completed</NuxtLink>
          </div>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full min-w-162.5 text-left">
            <thead>
              <tr class="text-[10px] uppercase tracking-[0.14em] text-gray-400">
                <th class="px-4 py-3">Order ID</th>
                <th class="px-4 py-3">Customer</th>
                <th class="px-4 py-3">Items purchased</th>
                <th class="px-4 py-3">Date</th>
                <th class="px-4 py-3 text-right">Total</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-[#edf2f0]">
              <tr
                v-for="order in recentOrders"
                :key="order.id"
                class="text-sm text-gray-600"
              >
                <td class="px-4 py-4 font-semibold text-ink">
                  #{{ String(order.id).slice(-8) }}
                </td>
                <td class="px-4 py-4">
                  <span class="font-medium text-ink">{{
                    order.customerName || "Guest"
                  }}</span
                  ><span class="block text-xs text-gray-400">{{
                    order.email || "No email"
                  }}</span>
                </td>
                <td class="px-4 py-4">
                  {{ order.items?.length || 0 }} book(s)
                </td>
                <td class="px-4 py-4 text-xs">
                  {{
                    order.createdAt
                      ? new Date(order.createdAt).toLocaleString()
                      : "-"
                  }}
                </td>
                <td class="px-4 py-4 text-right font-bold text-ink">
                  {{ money(Number(order.total || 0)) }}
                </td>
              </tr>
            </tbody>
          </table>
          <p
            v-if="!recentOrders.length"
            class="p-10 text-center text-sm text-gray-500"
          >
            No orders yet.
          </p>
        </div>
      </div>
    </template>
  </section>
</template>

<style scoped>
.eyebrow {
  color: #0f766e;
  font-size: 0.7rem;
  font-weight: 800;
  letter-spacing: 0.2em;
  text-transform: uppercase;
}
.action-primary,
.action-secondary {
  border-radius: 0.7rem;
  padding: 0.7rem 1rem;
  font-size: 0.75rem;
  font-weight: 700;
  transition: 0.2s ease;
}
.action-primary {
  background: #0f766e;
  color: white;
  box-shadow: 0 8px 18px rgba(15, 118, 110, 0.16);
}
.action-primary:hover {
  background: #0b5f59;
}
.action-secondary {
  border: 1px solid #cfe1dc;
  background: white;
  color: #47615c;
}
.action-secondary:hover {
  border-color: #0f766e;
  color: #0f766e;
}
.metric-card,
.panel {
  border: 1px solid #dce9e4;
  background: rgba(255, 255, 255, 0.9);
  box-shadow: 0 8px 22px rgba(38, 78, 68, 0.04);
}
.metric-card {
  display: flex;
  min-height: 132px;
  align-items: flex-start;
  justify-content: space-between;
  border-radius: 1rem;
  padding: 1.1rem;
}
.metric-label {
  color: #81928e;
  font-size: 0.65rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}
.metric-value {
  margin-top: 0.45rem;
  color: #14231f;
  font-size: 1.6rem;
  font-weight: 800;
}
.metric-note {
  margin-top: 0.8rem;
  font-size: 0.65rem;
  font-weight: 600;
}
.metric-icon {
  display: flex;
  height: 2.5rem;
  width: 2.5rem;
  align-items: center;
  justify-content: center;
  border-radius: 0.75rem;
  font-weight: 800;
}
.panel {
  border-radius: 1rem;
  padding: 1.1rem;
}
.panel-heading {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
}
.panel-heading h2 {
  color: #14231f;
  font-size: 0.9rem;
  font-weight: 800;
}
.panel-heading p {
  margin-top: 0.25rem;
  color: #92a09c;
  font-size: 0.65rem;
}
.legend,
.status-pill {
  color: #6e817b;
  font-size: 0.65rem;
  white-space: nowrap;
}
.legend i {
  display: inline-block;
  height: 0.45rem;
  width: 0.45rem;
  margin-right: 0.3rem;
  border-radius: 999px;
}
.status-pill {
  border-radius: 999px;
  background: #e8f8ef;
  padding: 0.3rem 0.55rem;
  color: #188460;
}
.chart-area {
  display: flex;
  height: 190px;
  align-items: end;
  justify-content: space-around;
  gap: 0.8rem;
  border-bottom: 1px solid #edf2f0;
  padding: 1rem 0.5rem 0;
}
.bar-column {
  display: flex;
  height: 100%;
  flex: 1;
  flex-direction: column;
  align-items: center;
  justify-content: end;
  gap: 0.55rem;
  color: #91a09c;
  font-size: 0.65rem;
}
.bar-track {
  display: flex;
  height: 85%;
  width: 1.1rem;
  align-items: end;
  border-radius: 0.5rem 0.5rem 0 0;
  background: #e0f6ed;
}
.bar-fill {
  display: block;
  width: 100%;
  border-radius: 0.5rem 0.5rem 0 0;
  background: #0f766e;
}
.panel-footer {
  display: flex;
  justify-content: space-between;
  padding-top: 0.9rem;
  color: #72837e;
  font-size: 0.65rem;
}
.panel-footer a,
.tab-link {
  color: #0f766e;
  font-weight: 700;
}
.tab-active,
.tab-link {
  border-radius: 0.5rem;
  padding: 0.35rem 0.5rem;
}
.tab-active {
  background: #e8f3ef;
  color: #0f766e;
  font-weight: 700;
}
</style>
