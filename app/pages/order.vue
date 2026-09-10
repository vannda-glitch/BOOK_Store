<script setup lang="ts">

definePageMeta({
  layout: 'default'
})

const { cart, cartCount, clearCart, loadCart } = useCart()

const orderPlaced = ref(false)
const loading = ref(false)
const orderError = ref('')
const orderForm = reactive({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  postalCode: ''
})
const API_URL = 'http://localhost:8000'

const subtotal = computed(() => {
  return cart.value.reduce(
    (total, item) => total + Number(item.price) * item.quantity,
    0
  )
})

const shipping = computed(() => {
  if (subtotal.value >= 100) return 0
  return 5
})

const total = computed(() => {
  return subtotal.value + shipping.value
})

const placeOrder = async () => {
  loading.value = true

  orderError.value = ''

  try {
    await $fetch(`${API_URL}/orders`, {
      method: 'POST',
      body: {
        customerName: `${orderForm.firstName} ${orderForm.lastName}`.trim(),
        email: orderForm.email.trim().toLowerCase(),
        phone: orderForm.phone.trim(),
        address: orderForm.address.trim(),
        city: orderForm.city.trim(),
        postalCode: orderForm.postalCode.trim(),
        items: cart.value.map(item => ({ ...item })),
        subtotal: subtotal.value,
        shipping: shipping.value,
        total: total.value,
        status: 'pending',
        createdAt: new Date().toISOString()
      }
    })

    orderPlaced.value = true
    await clearCart()
  } catch (error) {
    console.error('Failed to place order:', error)
    orderError.value = 'Unable to place your order. Please try again.'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadCart()
})

</script>

<template>

  <div
    class="min-h-screen bg-transparent text-[#17201f]"
  >

    <main
      class="mx-auto max-w-[1600px] px-6 py-12 lg:px-12 lg:py-5"
    >

      <!-- Success Message -->
      <div
        v-if="orderPlaced"
        class="flex min-h-[60vh] flex-col items-center justify-center text-center"
      >

        <div
          class="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="2"
            stroke="currentColor"
            class="h-10 w-10 text-green-600"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="m4.5 12.75 6 6 9-13.5"
            />
          </svg>
        </div>

        <h1
          class="font-serif text-4xl font-bold text-gray-950"
        >
          Order Placed Successfully!
        </h1>

        <p
          class="mt-4 max-w-md text-gray-500"
        >
          Thank you for your purchase. Your books will be delivered soon.
        </p>

        <NuxtLink
          to="/browse"
          class="mt-8 bg-black px-8 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
        >
          Continue Shopping
        </NuxtLink>

      </div>


      <!-- Checkout Form -->
      <div v-else-if="cart.length > 0">

        <div class="mb-8 rounded-[1.5rem] border border-[#dce9e4] bg-white/70 px-6 py-8 shadow-sm backdrop-blur sm:px-10">

          <p
            class="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-gray-500"
          >
            Checkout
          </p>

          <h1
            class="display-heading text-5xl font-bold tracking-tight text-[#17201f] sm:text-6xl"
          >
            Complete your order
          </h1>

        </div>


        <div class="grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px]">

          <!-- Form -->
          <div class="soft-panel p-6 sm:p-9">

            <h2
              class="display-heading text-2xl font-bold text-[#17201f]"
            >
              Customer information
            </h2>

            <div
              v-if="orderError"
              class="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
            >
              {{ orderError }}
            </div>


            <form
              class="mt-6 space-y-5"
              @submit.prevent="placeOrder"
            >

              <div class="grid gap-5 sm:grid-cols-2">

                <div>

                  <label
                    class="mb-2 block text-sm font-medium text-gray-700"
                  >
                    First Name
                  </label>

                  <input
                    type="text"
                    v-model="orderForm.firstName"
                    required
                    class="w-full rounded-xl border border-[#d7e1dd] bg-white/80 px-4 py-3 outline-none transition placeholder:text-gray-400 focus:border-[#0f766e] focus:ring-4 focus:ring-[#0f766e]/10"
                    placeholder="John"
                  />

                </div>

                <div>

                  <label
                    class="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Last Name
                  </label>

                  <input
                    type="text"
                    v-model="orderForm.lastName"
                    required
                    class="w-full rounded-xl border border-[#d7e1dd] bg-white/80 px-4 py-3 outline-none transition placeholder:text-gray-400 focus:border-[#0f766e] focus:ring-4 focus:ring-[#0f766e]/10"
                    placeholder="Doe"
                  />

                </div>

              </div>


              <div>

                <label
                  class="mb-2 block text-sm font-medium text-gray-700"
                >
                  Email
                </label>

                <input
                  type="email"
                  v-model="orderForm.email"
                  required
                  class="w-full rounded-xl border border-[#d7e1dd] bg-white/80 px-4 py-3 outline-none transition placeholder:text-gray-400 focus:border-[#0f766e] focus:ring-4 focus:ring-[#0f766e]/10"
                  placeholder="john@example.com"
                />

              </div>


              <div>

                <label
                  class="mb-2 block text-sm font-medium text-gray-700"
                >
                  Phone
                </label>

                <input
                  type="tel"
                  v-model="orderForm.phone"
                  required
                  class="w-full rounded-xl border border-[#d7e1dd] bg-white/80 px-4 py-3 outline-none transition placeholder:text-gray-400 focus:border-[#0f766e] focus:ring-4 focus:ring-[#0f766e]/10"
                  placeholder="+855 12 345 678"
                />

              </div>


              <div>

                <label
                  class="mb-2 block text-sm font-medium text-gray-700"
                >
                  Address
                </label>

                <input
                  type="text"
                  v-model="orderForm.address"
                  required
                  class="w-full rounded-xl border border-[#d7e1dd] bg-white/80 px-4 py-3 outline-none transition placeholder:text-gray-400 focus:border-[#0f766e] focus:ring-4 focus:ring-[#0f766e]/10"
                  placeholder="123 Street, City"
                />

              </div>


              <div
                class="grid gap-5 sm:grid-cols-2"
              >

                <div>

                  <label
                    class="mb-2 block text-sm font-medium text-gray-700"
                  >
                    City
                  </label>

                  <input
                    type="text"
                    v-model="orderForm.city"
                    required
                    class="w-full rounded-xl border border-[#d7e1dd] bg-white/80 px-4 py-3 outline-none transition placeholder:text-gray-400 focus:border-[#0f766e] focus:ring-4 focus:ring-[#0f766e]/10"
                    placeholder="Phnom Penh"
                  />

                </div>

                <div>

                  <label
                    class="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Postal Code
                  </label>

                  <input
                    type="text"
                    v-model="orderForm.postalCode"
                    required
                    class="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-black"
                    placeholder="12000"
                  />

                </div>

              </div>


              <div class="pt-4">

                <button
                  type="submit"
                  :disabled="loading"
                  class="w-full rounded-xl bg-[#0f766e] py-4 text-sm font-semibold text-white shadow-lg shadow-[#0f766e]/20 transition hover:-translate-y-0.5 hover:bg-[#0b5f59] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <span v-if="loading">
                    Processing...
                  </span>
                  <span v-else>
                    Place Order - ${{ total.toFixed(2) }}
                  </span>
                </button>

              </div>

            </form>

          </div>


          <!-- Order Summary -->
          <aside>

            <div class="sticky top-28 rounded-[1.5rem] border border-[#dce9e4] bg-white/85 p-6 shadow-xl shadow-[#17201f]/5 backdrop-blur sm:p-7">

              <h2
                class="font-serif text-2xl font-bold text-gray-950"
              >
                Your order
              </h2>


              <div
                class="mt-6 space-y-4"
              >

                <div
                  v-for="item in cart"
                  :key="item.id"
                  class="flex gap-3 border-b border-[#edf1ef] pb-4 last:border-0 last:pb-0"
                >

                  <div
                    class="h-16 w-12 shrink-0 overflow-hidden rounded-lg bg-[#e6f0ed] ring-1 ring-[#d5e4df]"
                  >
                    <img
                      :src="item.image"
                      :alt="item.title"
                      class="h-full w-full object-cover"
                    />
                  </div>

                  <div class="min-w-0 flex-1">

                    <p
                      class="truncate text-sm font-medium text-gray-900"
                    >
                      {{ item.title }}
                    </p>

                    <p
                      class="text-xs text-gray-500"
                    >
                      Qty: {{ item.quantity }}
                    </p>

                  </div>

                  <p
                    class="text-sm font-semibold text-gray-900"
                  >
                    ${{ (item.price * item.quantity).toFixed(2) }}
                  </p>

                </div>

              </div>


              <div
                class="mt-6 border-t border-gray-200 pt-4"
              >

                <div
                  class="flex justify-between text-sm text-gray-600"
                >
                  <span>Subtotal</span>
                  <span class="font-medium">${{ subtotal.toFixed(2) }}</span>
                </div>

                <div
                  class="mt-2 flex justify-between text-sm text-gray-600"
                >
                  <span>Shipping</span>
                  <span class="font-medium">
                    {{ shipping === 0 ? 'Free' : '$' + shipping.toFixed(2) }}
                  </span>
                </div>

              </div>


              <div
                class="mt-4 border-t border-gray-200 pt-4"
              >

                <div
                  class="flex items-center justify-between"
                >
                  <span class="font-serif text-lg font-bold text-gray-950">
                    Total
                  </span>
                  <span class="font-serif text-xl font-bold text-gray-950">
                    ${{ total.toFixed(2) }}
                  </span>
                </div>

              </div>

            </div>

          </aside>

        </div>

      </div>


      <!-- Empty Cart -->
      <div
        v-else
          class="flex min-h-[60vh] flex-col items-center justify-center rounded-[1.5rem] border border-[#dce9e4] bg-white/70 px-6 text-center shadow-sm"
      >

        <div
          class="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gray-100"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="h-9 w-9 text-gray-700"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M2.75 3.75h2.1l1.55 11.1a2 2 0 0 0 1.98 1.72h8.9a2 2 0 0 0 1.96-1.6L20.5 7H5.2"
            />
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M9 20.25h.01M17 20.25h.01"
            />
          </svg>
        </div>

        <h1
          class="mt-7 font-serif text-3xl font-bold text-gray-950"
        >
          Your cart is empty
        </h1>

        <p
          class="mx-auto mt-3 max-w-md text-sm text-gray-500"
        >
          Add some books to your cart before checking out.
        </p>

        <NuxtLink
          to="/browse"
          class="mt-8 rounded-xl bg-[#0f766e] px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-[#0f766e]/20 transition hover:-translate-y-0.5 hover:bg-[#0b5f59]"
        >
          Browse Books
        </NuxtLink>

      </div>

    </main>

  </div>

</template>
