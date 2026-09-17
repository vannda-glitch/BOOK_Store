<script setup lang="ts">
definePageMeta({
  layout: "admin",
  middleware: "admin",
});

const API_URL = "http://localhost:8000";

const loading = ref(true);
const errorMessage = ref("");

const books = ref<any[]>([]);
const users = ref<any[]>([]);
const orders = ref<any[]>([]);
const categories = ref<any[]>([]);

/* =========================
   LOAD DASHBOARD
========================= */

const loadDashboard = async () => {
  loading.value = true;
  errorMessage.value = "";

  try {
    const [bookData, userData, orderData, categoryData] =
      await Promise.all([
        $fetch<any[]>(`${API_URL}/books`),
        $fetch<any[]>(`${API_URL}/users`),
        $fetch<any[]>(`${API_URL}/orders`),
        $fetch<any[]>(`${API_URL}/categories`),
      ]);

    books.value = bookData;
    users.value = userData;
    orders.value = orderData;
    categories.value = categoryData;
  } catch (error) {
    console.error("Dashboard error:", error);

    errorMessage.value =
      "Unable to load dashboard data. Make sure JSON Server is running.";
  } finally {
    loading.value = false;
  }
};

/* =========================
   HELPERS
========================= */

const money = (value: number) => {
  return `$${value.toFixed(2)}`;
};

const getOrderTotal = (order: any) => {
  return Number(order.total || 0);
};

/* =========================
   STATISTICS
========================= */

const totalRevenue = computed(() => {
  return orders.value.reduce(
    (sum, order) => sum + getOrderTotal(order),
    0,
  );
});

const pendingOrders = computed(() => {
  return orders.value.filter(
    (order) =>
      String(order.status || "pending").toLowerCase() ===
      "pending",
  );
});

const completedOrders = computed(() => {
  return orders.value.filter(
    (order) =>
      String(order.status || "").toLowerCase() ===
      "completed",
  );
});

const recentOrders = computed(() => {
  return [...orders.value]
    .sort(
      (a, b) =>
        new Date(b.createdAt || 0).getTime() -
        new Date(a.createdAt || 0).getTime(),
    )
    .slice(0, 5);
});

/* =========================
   CATEGORY
========================= */

const categoryBreakdown = computed(() => {
  return categories.value
    .map((category) => {
      const count = books.value.filter(
        (book) =>
          String(book.category || "").toLowerCase() ===
          String(category.name || "").toLowerCase(),
      ).length;

      return {
        name: category.name,
        count,
      };
    })
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);
});

const maxCategoryCount = computed(() => {
  return Math.max(
    ...categoryBreakdown.value.map(
      (category) => category.count,
    ),
    1,
  );
});

/* =========================
   WEEKLY SALES
========================= */

const weekDays = [
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
  "Sat",
  "Sun",
];

const weeklySales = computed(() => {
  const today = new Date();

  return weekDays.map((day, index) => {
    const target = new Date(today);

    const currentDay = target.getDay();
    const mondayOffset =
      currentDay === 0 ? -6 : 1 - currentDay;

    target.setDate(
      today.getDate() +
        mondayOffset +
        index,
    );

    const dateKey = target.toISOString().slice(0, 10);

    const revenue = orders.value
      .filter((order) => {
        if (!order.createdAt) return false;

        return (
          new Date(order.createdAt)
            .toISOString()
            .slice(0, 10) === dateKey
        );
      })
      .reduce(
        (sum, order) =>
          sum + getOrderTotal(order),
        0,
      );

    return {
      day,
      revenue,
    };
  });
});

const maxWeeklyRevenue = computed(() => {
  return Math.max(
    ...weeklySales.value.map(
      (item) => item.revenue,
    ),
    1,
  );
});

/* =========================
   DATE
========================= */

const formatDate = (date: string) => {
  if (!date) return "-";

  return new Date(date).toLocaleDateString(
    "en-US",
    {
      month: "short",
      day: "numeric",
      year: "numeric",
    },
  );
};

/* =========================
   ORDER STATUS
========================= */

const statusClass = (status: string) => {
  const value = String(status || "pending")
    .toLowerCase();

  if (value === "completed") {
    return "bg-emerald-50 text-emerald-700";
  }

  if (value === "cancelled") {
    return "bg-red-50 text-red-700";
  }

  if (value === "processing") {
    return "bg-blue-50 text-blue-700";
  }

  return "bg-amber-50 text-amber-700";
};

onMounted(loadDashboard);
</script>

<template>
  <section class="space-y-6">
    <!-- =========================
         HEADER
    ========================== -->

    <div
      class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
    >
      <div>
        <p
          class="text-[11px] font-bold uppercase tracking-[0.18em] text-primary"
        >
          Admin Workspace
        </p>

        <h1
          class="mt-1 text-3xl font-bold tracking-tight text-gray-900"
        >
          Dashboard
        </h1>

        <p class="mt-1 text-sm text-gray-500">
          Overview of your bookstore performance.
        </p>
      </div>

    </div>

    <!-- =========================
         ERROR
    ========================== -->

    <div
      v-if="errorMessage"
      class="flex items-center justify-between gap-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
    >
      <span>{{ errorMessage }}</span>

      <button
        type="button"
        class="font-semibold underline"
        @click="loadDashboard"
      >
        Retry
      </button>
    </div>

    <!-- =========================
         LOADING
    ========================== -->

    <div
      v-if="loading"
      class="rounded-xl border border-gray-200 bg-white py-24 text-center"
    >
      <div
        class="mx-auto h-7 w-7 animate-spin rounded-full border-2 border-gray-200 border-t-primary"
      ></div>

      <p class="mt-3 text-sm text-gray-500">
        Loading dashboard...
      </p>
    </div>

    <!-- =========================
         DASHBOARD
    ========================== -->

    <template v-else>
      <!-- =========================
           METRICS
      ========================== -->

      <div
        class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >
        <!-- BOOKS -->

        <div class="stat-card">
          <div>
            <p class="stat-label">
              Total Books
            </p>

            <p class="stat-value">
              {{ books.length.toLocaleString() }}
            </p>

            <p class="stat-description">
              Books in catalog
            </p>
          </div>

          <div class="stat-icon bg-blue-50 text-blue-600">
            <UiIcon
              name="book"
              class="h-5 w-5"
            />
          </div>
        </div>

        <!-- USERS -->

        <div class="stat-card">
          <div>
            <p class="stat-label">
              Customers
            </p>

            <p class="stat-value">
              {{ users.length.toLocaleString() }}
            </p>

            <p class="stat-description">
              Registered customers
            </p>
          </div>

          <div
            class="stat-icon bg-emerald-50 text-emerald-600"
          >
            <UiIcon
              name="users"
              class="h-5 w-5"
            />
          </div>
        </div>

        <!-- ORDERS -->

        <div class="stat-card">
          <div>
            <p class="stat-label">
              Total Orders
            </p>

            <p class="stat-value">
              {{ orders.length.toLocaleString() }}
            </p>

            <p class="stat-description">
              <span class="font-semibold text-amber-600">
                {{ pendingOrders.length }}
              </span>
              pending
            </p>
          </div>

          <div
            class="stat-icon bg-purple-50 text-purple-600"
          >
            <UiIcon
              name="bag"
              class="h-5 w-5"
            />
          </div>
        </div>

        <!-- REVENUE -->

        <div class="stat-card">
          <div>
            <p class="stat-label">
              Total Revenue
            </p>

            <p class="stat-value">
              {{ money(totalRevenue) }}
            </p>

            <p class="stat-description">
              From all orders
            </p>
          </div>

          <div
            class="stat-icon bg-amber-50 text-amber-600"
          >
            <span class="text-lg font-bold">
              $
            </span>
          </div>
        </div>
      </div>

      <!-- =========================
           CHARTS
      ========================== -->

      <div
        class="grid gap-5 xl:grid-cols-[minmax(0,1.7fr)_minmax(280px,1fr)]"
      >
        <!-- WEEKLY SALES -->

        <div class="card">
          <div class="card-header">
            <div>
              <h2 class="card-title">
                Weekly Sales
              </h2>

              <p class="card-description">
                Revenue generated during this week
              </p>
            </div>

            <span
              class="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold text-emerald-700"
            >
              Revenue
            </span>
          </div>

          <div class="mt-6">
            <div
              class="flex h-52 items-end gap-3 border-b border-gray-100 px-2 sm:gap-5"
            >
              <div
                v-for="item in weeklySales"
                :key="item.day"
                class="flex h-full flex-1 flex-col items-center justify-end gap-2"
              >
                <span
                  class="text-[10px] font-medium text-gray-500"
                >
                  {{
                    item.revenue
                      ? money(item.revenue)
                      : "$0"
                  }}
                </span>

                <div
                  class="flex h-[75%] w-full max-w-9 items-end rounded-t-lg bg-gray-100"
                >
                  <div
                    class="w-full rounded-t-lg bg-primary transition-all duration-500"
                    :style="{
                      height: `${Math.max(
                        (item.revenue /
                          maxWeeklyRevenue) *
                          100,
                        item.revenue ? 8 : 0,
                      )}%`,
                    }"
                  ></div>
                </div>

                <span
                  class="text-[10px] font-medium text-gray-400"
                >
                  {{ item.day }}
                </span>
              </div>
            </div>
          </div>

          <div
            class="mt-4 flex items-center justify-between text-xs"
          >
            <span class="text-gray-400">
              Weekly revenue
            </span>

            <span class="font-bold text-gray-800">
              {{ money(
                weeklySales.reduce(
                  (sum, item) =>
                    sum + item.revenue,
                  0,
                ),
              ) }}
            </span>
          </div>
        </div>

        <!-- CATEGORY -->

        <div class="card">
          <div class="card-header">
            <div>
              <h2 class="card-title">
                Top Categories
              </h2>

              <p class="card-description">
                Books by category
              </p>
            </div>

            <span
              class="rounded-full bg-gray-100 px-2.5 py-1 text-[10px] font-semibold text-gray-500"
            >
              {{ categories.length }} total
            </span>
          </div>

          <div class="mt-6 space-y-5">
            <div
              v-for="category in categoryBreakdown"
              :key="category.name"
            >
              <div
                class="mb-2 flex items-center justify-between"
              >
                <span
                  class="text-xs font-medium text-gray-600"
                >
                  {{ category.name }}
                </span>

                <span
                  class="text-xs font-bold text-gray-800"
                >
                  {{ category.count }}
                </span>
              </div>

              <div
                class="h-2 overflow-hidden rounded-full bg-gray-100"
              >
                <div
                  class="h-full rounded-full bg-primary transition-all duration-500"
                  :style="{
                    width: `${Math.max(
                      (category.count /
                        maxCategoryCount) *
                        100,
                      4,
                    )}%`,
                  }"
                ></div>
              </div>
            </div>

            <div
              v-if="!categoryBreakdown.length"
              class="py-8 text-center text-sm text-gray-400"
            >
              No categories available.
            </div>
          </div>
        </div>
      </div>

      <!-- =========================
           ORDERS
      ========================== -->

      <div class="card overflow-hidden p-0">
        <div
          class="flex flex-col gap-3 border-b border-gray-100 p-5 sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <h2 class="card-title">
              Recent Orders
            </h2>

            <p class="card-description">
              Latest customer orders
            </p>
          </div>

        </div>

        <div class="overflow-x-auto">
          <table
            class="w-full min-w-[700px] text-left"
          >
            <thead>
              <tr
                class="border-b border-gray-100 bg-gray-50/70 text-[10px] uppercase tracking-wider text-gray-400"
              >
                <th class="px-5 py-3">
                  Order
                </th>

                <th class="px-5 py-3">
                  Customer
                </th>

                <th class="px-5 py-3">
                  Items
                </th>

                <th class="px-5 py-3">
                  Date
                </th>

                <th class="px-5 py-3">
                  Status
                </th>

                <th class="px-5 py-3 text-right">
                  Total
                </th>
              </tr>
            </thead>

            <tbody
              class="divide-y divide-gray-100"
            >
              <tr
                v-for="order in recentOrders"
                :key="order.id"
                class="transition hover:bg-gray-50/70"
              >
                <!-- ID -->

                <td
                  class="px-5 py-4 text-sm font-bold text-gray-800"
                >
                  #{{ String(order.id).slice(-8) }}
                </td>

                <!-- CUSTOMER -->

                <td class="px-5 py-4">
                  <p
                    class="text-sm font-semibold text-gray-800"
                  >
                    {{ order.customerName || "Guest" }}
                  </p>

                  <p
                    class="mt-0.5 text-xs text-gray-400"
                  >
                    {{ order.email || "No email" }}
                  </p>
                </td>

                <!-- ITEMS -->

                <td
                  class="px-5 py-4 text-xs text-gray-500"
                >
                  {{ order.items?.length || 0 }}
                  book(s)
                </td>

                <!-- DATE -->

                <td
                  class="px-5 py-4 text-xs text-gray-500"
                >
                  {{ formatDate(order.createdAt) }}
                </td>

                <!-- STATUS -->

                <td class="px-5 py-4">
                  <span
                    class="inline-flex rounded-full px-2.5 py-1 text-[10px] font-semibold capitalize"
                    :class="
                      statusClass(order.status)
                    "
                  >
                    {{
                      order.status ||
                      "pending"
                    }}
                  </span>
                </td>

                <!-- TOTAL -->

                <td
                  class="px-5 py-4 text-right text-sm font-bold text-gray-900"
                >
                  {{ money(
                    getOrderTotal(order),
                  ) }}
                </td>
              </tr>
            </tbody>
          </table>

          <div
            v-if="!recentOrders.length"
            class="px-5 py-12 text-center"
          >
            <p
              class="text-sm font-medium text-gray-500"
            >
              No orders yet.
            </p>

            <p
              class="mt-1 text-xs text-gray-400"
            >
              Orders will appear here once customers place them.
            </p>
          </div>
        </div>
      </div>

      <!-- =========================
           QUICK SUMMARY
      ========================== -->

      <div
        class="grid gap-4 sm:grid-cols-3"
      >
        <div class="summary-card">
          <span class="summary-number">
            {{ pendingOrders.length }}
          </span>

          <div>
            <p class="summary-title">
              Pending Orders
            </p>

            <p class="summary-text">
              Need fulfillment
            </p>
          </div>
        </div>

        <div class="summary-card">
          <span class="summary-number">
            {{ completedOrders.length }}
          </span>

          <div>
            <p class="summary-title">
              Completed Orders
            </p>

            <p class="summary-text">
              Successfully delivered
            </p>
          </div>
        </div>

        <div class="summary-card">
          <span class="summary-number">
            {{ categories.length }}
          </span>

          <div>
            <p class="summary-title">
              Categories
            </p>

            <p class="summary-text">
              Available in catalog
            </p>
          </div>
        </div>
      </div>
    </template>
  </section>
</template>

<style scoped>
/* =========================
   STAT CARDS
========================= */

.stat-card {
  display: flex;
  min-height: 128px;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  border: 1px solid #e5ebe8;
  border-radius: 0.9rem;
  background: white;
  padding: 1.1rem;
  box-shadow: 0 4px 16px rgba(38, 78, 68, 0.035);
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 22px rgba(38, 78, 68, 0.07);
}

.stat-label {
  color: #8a9894;
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.stat-value {
  margin-top: 0.4rem;
  color: #17231f;
  font-size: 1.65rem;
  font-weight: 800;
  letter-spacing: -0.03em;
}

.stat-description {
  margin-top: 0.55rem;
  color: #9aa6a2;
  font-size: 0.65rem;
}

.stat-icon {
  display: flex;
  height: 2.5rem;
  width: 2.5rem;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  border-radius: 0.7rem;
}

/* =========================
   CARDS
========================= */

.card {
  border: 1px solid #e5ebe8;
  border-radius: 0.9rem;
  background: white;
  padding: 1.2rem;
  box-shadow: 0 4px 16px rgba(38, 78, 68, 0.035);
}

.card-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
}

.card-title {
  color: #17231f;
  font-size: 0.9rem;
  font-weight: 800;
}

.card-description {
  margin-top: 0.25rem;
  color: #98a39f;
  font-size: 0.65rem;
}

/* =========================
   SUMMARY
========================= */

.summary-card {
  display: flex;
  align-items: center;
  gap: 0.9rem;
  border: 1px solid #e5ebe8;
  border-radius: 0.9rem;
  background: white;
  padding: 1rem;
}

.summary-number {
  display: flex;
  height: 2.5rem;
  min-width: 2.5rem;
  align-items: center;
  justify-content: center;
  border-radius: 0.65rem;
  background: #edf7f4;
  color: #0f766e;
  font-size: 0.85rem;
  font-weight: 800;
}

.summary-title {
  color: #26332f;
  font-size: 0.75rem;
  font-weight: 700;
}

.summary-text {
  margin-top: 0.15rem;
  color: #9aa6a2;
  font-size: 0.65rem;
}
</style>
