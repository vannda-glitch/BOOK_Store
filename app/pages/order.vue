<script setup lang="ts">

definePageMeta({
  layout: "default",
});

const { cart, clearCart, loadCart } = useCart();

const orderPlaced = ref(false);

const orderError = ref("");

// Payment & Modal state
const showPaymentModal = ref(false);
const paymentLoading = ref(false);
const qrData = ref<{
  qr_image: string;
  md5: string;
  bill_number: string;
  amount: number;
  currency: string;
} | null>(null);

let pollInterval: NodeJS.Timeout | null = null;

const orderForm = reactive({

  firstName: "",

  lastName: "",

  email: "",

  phone: "",

  address: "",

  city: "",

  postalCode: "",
});

const API_URL = "http://localhost:8000"; // JSON Server / Main API
const FLASK_API_URL = "http://localhost:5000"; // Flask Bakong KHQR Server

const subtotal = computed(() => {

  return cart.value.reduce(

    (total, item) =>

      total +
      Number(item.price) *
      item.quantity,

    0

  );

});


// =========================================================
// SHIPPING
// =========================================================

const shipping = computed(() => {

  if (subtotal.value >= 100) {

    return 0;

  }

  return 5;

});


// =========================================================
// TOTAL
// =========================================================

const total = computed(() => {
  return subtotal.value + shipping.value;
});

// Step 1: Initiate payment and show Bakong Modal
const startCheckout = async () => {
  loading.value = true;
  orderError.value = "";

  try {
    // Check inventory stock
    for (const item of cart.value) {
      const bookId = item.productId ?? item.id;
      const book = await $fetch<any>(`${API_URL}/books/${bookId}`);
      const stock = Math.max(0, Number(book.stock) || 0);
      if (item.quantity > stock) {
        throw new Error(
          `"${item.title}" only has ${stock} ${stock === 1 ? "copy" : "copies"} left in stock.`,
        );
      }
    }

    paymentLoading.value = true;
    showPaymentModal.value = true;

    // Fetch KHQR base64 image from Flask backend
    const qrResponse = await $fetch<any>(`${FLASK_API_URL}/api/generate-qr`, {
      method: "POST",
      body: {
        amount: total.value,
        currency: "USD",
        description: `Order for ${orderForm.firstName}`,
      },
    });

    if (qrResponse && qrResponse.success) {
      qrData.value = qrResponse;
      startPaymentPolling(qrResponse.md5);
    } else {
      throw new Error("Could not generate KHQR payment code.");
    }
  } catch (error) {
    console.error("Checkout failed:", error);
    orderError.value =
      error instanceof Error
        ? error.message
        : "Failed to initiate payment. Please try again.";
    showPaymentModal.value = false;
  } finally {
    loading.value = false;
    paymentLoading.value = false;
  }
};

// Step 2: Poll Flask server every 3s to verify KHQR status
const startPaymentPolling = (md5: string) => {
  stopPaymentPolling();
  pollInterval = setInterval(async () => {
    try {
      const res = await $fetch<any>(
        `${FLASK_API_URL}/api/check-payment?md5=${md5}`,
      );
      if (res.status === "PAID") {
        stopPaymentPolling();
        await finalizeOrder();
      }
    } catch (err) {
      console.error("Payment polling error:", err);
    }
  }, 3000);
};

const stopPaymentPolling = () => {
  if (pollInterval) {
    clearInterval(pollInterval);
    pollInterval = null;
  }
};

const cancelPayment = () => {
  stopPaymentPolling();
  showPaymentModal.value = false;
  qrData.value = null;
};

// Step 3: Complete order once KHQR turns PAID
const finalizeOrder = async () => {
  const decrementedBooks: Array<{ id: string | number; stock: number }> = [];

  try {
    for (const item of cart.value) {
      const bookId = item.productId ?? item.id;
      const book = await $fetch<any>(`${API_URL}/books/${bookId}`);
      const stock = Math.max(0, Number(book.stock) || 0);

      await $fetch(`${API_URL}/books/${book.id}`, {
        method: "PATCH",
        body: { stock: stock - item.quantity },
      });
      decrementedBooks.push({ id: book.id, stock });
    }

    await $fetch(`${API_URL}/orders`, {
      method: "POST",
      body: {
        customerName: `${orderForm.firstName} ${orderForm.lastName}`.trim(),
        email: orderForm.email.trim().toLowerCase(),
        phone: orderForm.phone.trim(),
        address: orderForm.address.trim(),
        city: orderForm.city.trim(),
        postalCode: orderForm.postalCode.trim(),
        items: cart.value.map((item) => ({ ...item })),
        subtotal: subtotal.value,
        shipping: shipping.value,
        total: total.value,
        status: "paid",
        billNumber: qrData.value?.bill_number,
        createdAt: new Date().toISOString(),
      },
    });

    showPaymentModal.value = false;
    orderPlaced.value = true;


    await clearCart();
  } catch (error) {
    console.error("Order finalization failed:", error);
    for (const book of decrementedBooks) {
      await $fetch(`${API_URL}/books/${book.id}`, {
        method: "PATCH",
        body: { stock: book.stock },
      }).catch(() => undefined);
    }


    orderError.value =
      "Payment succeeded, but recording your order failed. Please contact support.";
  }
};

onMounted(() => {

  loadCart();

});


// =========================================================
// CLEANUP
// =========================================================

onBeforeUnmount(() => {

  stopPaymentChecking();

});

onUnmounted(() => {
  stopPaymentPolling();
});
</script>


<template>
  <div class="min-h-screen bg-gray-50/50 text-slate-900 font-sans antialiased">
    <main class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <!-- SUCCESS SCREEN -->
      <div
        v-if="orderPlaced"
        class="mx-auto my-12 max-w-lg rounded-3xl border border-gray-100 bg-white p-8 text-center shadow-xl shadow-slate-200/50 sm:p-12"
      >
        <div
          class="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 ring-8 ring-emerald-50/50"
        >
          <svg class="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 class="text-3xl font-extrabold tracking-tight text-slate-900">
          Payment Confirmed!
        </h1>

        <p class="mt-3 text-sm leading-relaxed text-slate-500">
          Thank you for your order. We’ve received your Bakong payment and are preparing your books for dispatch.
        </p>

        <NuxtLink
          to="/browse"
          class="mt-8 inline-flex w-full items-center justify-center rounded-xl bg-slate-900 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-slate-800 shadow-lg shadow-slate-900/10"
        >
          Continue Shopping
        </NuxtLink>
      </div>

      <!-- MAIN CHECKOUT VIEW -->
      <div v-else-if="cart.length > 0" class="space-y-8">
        <!-- Header -->
        <header class="flex flex-col gap-2 border-b border-gray-200/80 pb-6">
          <div class="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-teal-600">
            <span>Store Checkout</span>
            <span>&bull;</span>
            <span>Secure Bakong KHQR</span>
          </div>
          <h1 class="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Complete Your Purchase
          </h1>
        </header>

        <div class="grid gap-8 lg:grid-cols-12 lg:items-start">
          <!-- Customer Information Form (Left) -->
          <section class="lg:col-span-7">
            <div class="rounded-3xl border border-gray-200/70 bg-white p-6 shadow-sm sm:p-8">
              <div class="flex items-center gap-3 border-b border-gray-100 pb-5">
                <span class="flex h-8 w-8 items-center justify-center rounded-full bg-teal-50 text-xs font-bold text-teal-700">
                  1
                </span>
                <h2 class="text-lg font-bold text-slate-900">
                  Shipping & Contact Details
                </h2>
              </div>

              <!-- Error Alert -->
              <div
                v-if="orderError"
                class="mt-6 flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50/80 p-4 text-sm text-rose-700"
              >
                <svg class="h-5 w-5 shrink-0 text-rose-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{{ orderError }}</span>
              </div>

              <form class="mt-6 space-y-5" @submit.prevent="startCheckout">
                <div class="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label class="mb-1.5 block text-xs font-semibold text-slate-700">First Name</label>
                    <input
                      type="text"
                      v-model="orderForm.firstName"
                      required
                      placeholder="John"
                      class="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-sm outline-none transition focus:border-teal-600 focus:bg-white focus:ring-4 focus:ring-teal-500/10"
                    />
                  </div>

                  <div>
                    <label class="mb-1.5 block text-xs font-semibold text-slate-700">Last Name</label>
                    <input
                      type="text"
                      v-model="orderForm.lastName"
                      required
                      placeholder="Doe"
                      class="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-sm outline-none transition focus:border-teal-600 focus:bg-white focus:ring-4 focus:ring-teal-500/10"
                    />
                  </div>
                </div>

                <div class="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label class="mb-1.5 block text-xs font-semibold text-slate-700">Email Address</label>
                    <input
                      type="email"
                      v-model="orderForm.email"
                      required
                      placeholder="john.doe@example.com"
                      class="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-sm outline-none transition focus:border-teal-600 focus:bg-white focus:ring-4 focus:ring-teal-500/10"
                    />
                  </div>

                  <div>
                    <label class="mb-1.5 block text-xs font-semibold text-slate-700">Phone Number</label>
                    <input
                      type="tel"
                      v-model="orderForm.phone"
                      required
                      placeholder="+855 12 345 678"
                      class="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-sm outline-none transition focus:border-teal-600 focus:bg-white focus:ring-4 focus:ring-teal-500/10"
                    />
                  </div>
                </div>

                <div>
                  <label class="mb-1.5 block text-xs font-semibold text-slate-700">Delivery Address</label>
                  <input
                    type="text"
                    v-model="orderForm.address"
                    required
                    placeholder="House/Street Address"
                    class="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-sm outline-none transition focus:border-teal-600 focus:bg-white focus:ring-4 focus:ring-teal-500/10"
                  />
                </div>

                <div class="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label class="mb-1.5 block text-xs font-semibold text-slate-700">City</label>
                    <input
                      type="text"
                      v-model="orderForm.city"
                      required
                      placeholder="Phnom Penh"
                      class="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-sm outline-none transition focus:border-teal-600 focus:bg-white focus:ring-4 focus:ring-teal-500/10"
                    />
                  </div>

                  <div>
                    <label class="mb-1.5 block text-xs font-semibold text-slate-700">Postal Code</label>
                    <input
                      type="text"
                      v-model="orderForm.postalCode"
                      required
                      placeholder="12000"
                      class="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-sm outline-none transition focus:border-teal-600 focus:bg-white focus:ring-4 focus:ring-teal-500/10"
                    />
                  </div>
                </div>

                <div class="pt-4">
                  <button
                    type="submit"
                    :disabled="loading"
                    class="relative flex w-full items-center justify-center gap-2 rounded-xl bg-teal-600 py-4 text-sm font-bold text-white shadow-lg shadow-teal-600/25 transition hover:bg-teal-700 disabled:opacity-50"
                  >
                    <span v-if="loading" class="flex items-center gap-2">
                      <svg class="h-4 w-4 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Generating KHQR...
                    </span>
                    <span v-else class="flex items-center gap-2">
                      <span>Pay with Bakong KHQR</span>
                      <span>&bull;</span>
                      <span>${{ total.toFixed(2) }}</span>
                    </span>
                  </button>
                </div>
              </form>
            </div>
          </section>

          <!-- Order Summary (Right) -->
          <aside class="lg:col-span-5">
            <div class="sticky top-8 rounded-3xl border border-gray-200/70 bg-white p-6 shadow-sm sm:p-8">
              <h2 class="text-lg font-bold text-slate-900 border-b border-gray-100 pb-4">
                Order Summary
              </h2>

              <ul class="mt-4 divide-y divide-gray-100 max-h-80 overflow-y-auto pr-1">
                <li
                  v-for="item in cart"
                  :key="item.id"
                  class="flex items-center gap-4 py-3.5"
                >
                  <div class="h-16 w-12 shrink-0 overflow-hidden rounded-xl border border-gray-100 bg-gray-50">
                    <img :src="item.image" :alt="item.title" class="h-full w-full object-cover" />
                  </div>

                  <div class="min-w-0 flex-1">
                    <h3 class="truncate text-sm font-semibold text-slate-800">{{ item.title }}</h3>
                    <p class="mt-0.5 text-xs text-slate-400">Qty: {{ item.quantity }}</p>
                  </div>

                  <span class="text-sm font-bold text-slate-900">
                    ${{ (item.price * item.quantity).toFixed(2) }}
                  </span>
                </li>
              </ul>

              <div class="mt-6 border-t border-gray-100 pt-4 space-y-2.5 text-sm">
                <div class="flex justify-between text-slate-500">
                  <span>Subtotal</span>
                  <span class="font-semibold text-slate-800">${{ subtotal.toFixed(2) }}</span>
                </div>

                <div class="flex justify-between text-slate-500">
                  <span>Shipping</span>
                  <span class="font-semibold text-slate-800">
                    {{ shipping === 0 ? "Free" : "$" + shipping.toFixed(2) }}
                  </span>
                </div>

                <div class="flex justify-between border-t border-gray-100 pt-3 text-base font-bold text-slate-900">
                  <span>Total Amount</span>
                  <span class="text-xl text-teal-700">${{ total.toFixed(2) }}</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>

      <!-- EMPTY CART STATE -->
      <div
        v-else
        class="mx-auto my-12 max-w-md rounded-3xl border border-gray-100 bg-white p-8 text-center shadow-sm"
      >
        <div class="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100 text-gray-400">
          <svg class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        </div>
        <h2 class="mt-4 text-xl font-bold text-slate-900">Your cart is empty</h2>
        <p class="mt-2 text-sm text-slate-500">Add books to your shopping cart to process an order.</p>
        <NuxtLink
          to="/browse"
          class="mt-6 inline-flex rounded-xl bg-teal-600 px-6 py-3 text-sm font-semibold text-white hover:bg-teal-700 transition"
        >
          Explore Catalog
        </NuxtLink>
      </div>

      <!-- KHQR PAYMENT SHEET MODAL -->
      <Transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div
          v-if="showPaymentModal"
          class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm"
        >
          <div
            class="w-full max-w-sm overflow-hidden rounded-3xl bg-white p-6 shadow-2xl transition-all sm:p-8"
          >
            <!-- Modal Header -->
            <div class="text-center">
              <div class="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1 text-xs font-bold text-red-600">
                <span class="h-1.5 w-1.5 rounded-full bg-red-600"></span>
                Bakong KHQR Payment
              </div>
              <h3 class="mt-3 text-xl font-bold text-slate-900">Scan QR Code</h3>
              <p class="mt-1 text-xs text-slate-500">
                Open Bakong or any Cambodian Banking App
              </p>
            </div>

            <!-- QR Container -->
            <div
              class="my-6 flex min-h-[260px] flex-col items-center justify-center rounded-2xl border border-gray-100 bg-gray-50/70 p-4"
            >
              <div v-if="paymentLoading" class="flex flex-col items-center gap-3 text-slate-400">
                <svg class="h-8 w-8 animate-spin text-teal-600" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                <span class="text-xs font-medium">Generating KHQR...</span>
              </div>

              <template v-else-if="qrData">
                <div class="rounded-xl bg-white p-3 shadow-md ring-1 ring-gray-100">
                  <img
                    :src="qrData.qr_image"
                    alt="Bakong KHQR Code"
                    class="h-56 w-56 object-contain"
                  />
                </div>
                <div class="mt-3 text-center">
                  <span class="text-2xl font-extrabold text-slate-900">
                    ${{ qrData.amount.toFixed(2) }}
                  </span>
                  <p class="text-[10px] uppercase tracking-wider text-slate-400 mt-0.5">
                    Ref: {{ qrData.bill_number }}
                  </p>
                </div>
              </template>
            </div>

            <!-- Live Polling Indicator -->
            <div class="mb-5 flex items-center justify-center gap-2 text-xs font-medium text-slate-500">
              <span class="relative flex h-2 w-2">
                <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                <span class="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
              </span>
              Waiting for mobile confirmation...
            </div>

            <!-- Cancel Button -->
            <button
              type="button"
              @click="cancelPayment"
              class="w-full rounded-xl border border-gray-200 bg-white py-3 text-xs font-semibold text-slate-700 transition hover:bg-gray-50"
            >
              Cancel Payment
            </button>
          </div>
        </div>
      </Transition>
    </main>
  </div>

</template>