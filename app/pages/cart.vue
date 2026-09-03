<script setup>
import { ref, computed, onMounted } from 'vue'

/* =========================================================
   CART
========================================================= */

const cart = ref([])
const isLoaded = ref(false)

/* =========================================================
   LOAD CART FROM LOCAL STORAGE
========================================================= */

onMounted(() => {
  const savedCart = localStorage.getItem('lumina-cart')

  if (savedCart) {
    try {
      cart.value = JSON.parse(savedCart)
    } catch (error) {
      console.error('Failed to load cart:', error)
      cart.value = []
    }
  }

  isLoaded.value = true
})

/* =========================================================
   SAVE CART
========================================================= */

function saveCart() {
  localStorage.setItem(
    'lumina-cart',
    JSON.stringify(cart.value)
  )
}

/* =========================================================
   CART COUNT
========================================================= */

const cartCount = computed(() => {
  return cart.value.reduce(
    (total, item) => total + item.quantity,
    0
  )
})

/* =========================================================
   SUBTOTAL
========================================================= */

const subtotal = computed(() => {
  return cart.value.reduce(
    (total, item) => {
      return total + item.price * item.quantity
    },
    0
  )
})

/* =========================================================
   SHIPPING
========================================================= */

const shipping = computed(() => {
  if (subtotal.value === 0) {
    return 0
  }

  // Free shipping over $100
  if (subtotal.value >= 100) {
    return 0
  }

  return 5
})

/* =========================================================
   TOTAL
========================================================= */

const total = computed(() => {
  return subtotal.value + shipping.value
})

/* =========================================================
   INCREASE QUANTITY
========================================================= */

function increaseQuantity(item) {
  item.quantity++
  saveCart()
}

/* =========================================================
   DECREASE QUANTITY
========================================================= */

function decreaseQuantity(item) {
  if (item.quantity > 1) {
    item.quantity--
  } else {
    removeItem(item.id)
    return
  }

  saveCart()
}

/* =========================================================
   REMOVE ITEM
========================================================= */

function removeItem(id) {
  cart.value = cart.value.filter(
    item => item.id !== id
  )

  saveCart()
}

/* =========================================================
   CLEAR CART
========================================================= */

function clearCart() {
  cart.value = []
  saveCart()
}

/* =========================================================
   CONTINUE SHOPPING
========================================================= */

function continueShopping() {
  navigateTo('/browse')
}

/* =========================================================
   CHECKOUT
========================================================= */

function checkout() {
  if (cart.value.length === 0) {
    return
  }

  navigateTo('/checkout')
}
</script>


<template>

  <div
    class="min-h-screen bg-[#f8f9fc] text-[#111827]"
  >
    <!-- =====================================================
         MAIN
    ====================================================== -->

    <main
      class="mx-auto max-w-[1600px] px-6 py-12 lg:px-12 lg:py-16"
    >

      <!-- Breadcrumb -->

      <div
        class="mb-8 flex items-center gap-2 text-sm text-gray-500"
      >

        <NuxtLink
          to="/"
          class="transition hover:text-black"
        >
          Home
        </NuxtLink>

        <span>›</span>

        <span class="text-gray-950">
          Shopping Cart
        </span>

      </div>


      <!-- ===================================================
           PAGE TITLE
      ==================================================== -->

      <div class="mb-12">

        <p
          class="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-gray-500"
        >
          Your Selection
        </p>

        <div
          class="flex flex-col justify-between gap-5 md:flex-row md:items-end"
        >

          <div>

            <h1
              class="font-serif text-5xl font-bold tracking-tight text-gray-950 sm:text-6xl"
            >
              Shopping Cart
            </h1>

            <p
              v-if="isLoaded && cartCount > 0"
              class="mt-4 text-sm text-gray-500"
            >
              {{ cartCount }}
              {{ cartCount === 1 ? 'item' : 'items' }}
              in your cart
            </p>

          </div>


          <!-- Clear Cart -->

          <button
            v-if="cart.length > 0"
            class="text-sm text-gray-500 underline underline-offset-4 transition hover:text-black"
            @click="clearCart"
          >
            Clear cart
          </button>

        </div>

      </div>


      <!-- ===================================================
           LOADING
      ==================================================== -->

      <div
        v-if="!isLoaded"
        class="py-24 text-center"
      >

        <div
          class="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-black"
        />

        <p
          class="mt-4 text-sm text-gray-500"
        >
          Loading your cart...
        </p>

      </div>


      <!-- ===================================================
           EMPTY CART
      ==================================================== -->

      <section
        v-else-if="cart.length === 0"
        class="border border-gray-200 bg-white px-6 py-24 text-center"
      >

        <!-- Cart Icon -->

        <div
          class="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#edf1f7]"
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


        <h2
          class="mt-7 font-serif text-3xl font-bold text-gray-950"
        >
          Your cart is empty
        </h2>


        <p
          class="mx-auto mt-3 max-w-md text-sm leading-6 text-gray-500"
        >
          Looks like you haven't discovered your next
          great read yet. Explore our books and find
          something worth reading.
        </p>


        <button
          class="mt-8 bg-black px-7 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
          @click="continueShopping"
        >
          Continue Shopping
        </button>

      </section>


      <!-- ===================================================
           CART CONTENT
      ==================================================== -->

      <section
        v-else
        class="grid gap-10 lg:grid-cols-[1fr_380px]"
      >

        <!-- =================================================
             CART ITEMS
        ================================================== -->

        <div>

          <!-- Header -->

          <div
            class="hidden border-b border-gray-200 pb-4 text-xs font-semibold uppercase tracking-wider text-gray-500 sm:grid sm:grid-cols-[1fr_120px_120px] sm:gap-6"
          >

            <span>
              Product
            </span>

            <span class="text-center">
              Quantity
            </span>

            <span class="text-right">
              Price
            </span>

          </div>


          <!-- Items -->

          <div>

            <article
              v-for="item in cart"
              :key="item.id"
              class="border-b border-gray-200 py-7"
            >

              <div
                class="grid gap-5 sm:grid-cols-[1fr_120px_120px] sm:items-center sm:gap-6"
              >

                <!-- Product -->

                <div
                  class="flex gap-5"
                >

                  <!-- Image -->

                  <div
                    class="h-32 w-24 shrink-0 overflow-hidden bg-[#edf1f7] sm:h-36 sm:w-28"
                  >

                    <img
                      :src="item.image"
                      :alt="item.title"
                      class="h-full w-full object-cover"
                    />

                  </div>


                  <!-- Info -->

                  <div
                    class="flex min-w-0 flex-col justify-center"
                  >

                    <h2
                      class="font-serif text-xl font-bold leading-tight text-gray-950"
                    >
                      {{ item.title }}
                    </h2>

                    <p
                      class="mt-2 text-sm text-gray-500"
                    >
                      {{ item.author }}
                    </p>

                    <p
                      v-if="item.format"
                      class="mt-2 text-xs text-gray-400"
                    >
                      {{ item.format }}
                    </p>


                    <!-- Remove -->

                    <button
                      class="mt-4 w-fit text-xs font-medium text-gray-500 underline underline-offset-4 transition hover:text-black"
                      @click="removeItem(item.id)"
                    >
                      Remove
                    </button>

                  </div>

                </div>


                <!-- Quantity -->

                <div
                  class="flex items-center justify-start sm:justify-center"
                >

                  <div
                    class="flex h-10 items-center border border-gray-300"
                  >

                    <button
                      class="flex h-full w-9 items-center justify-center text-gray-600 transition hover:bg-gray-100 hover:text-black"
                      @click="decreaseQuantity(item)"
                    >
                      −
                    </button>


                    <span
                      class="flex h-full w-9 items-center justify-center border-x border-gray-300 text-sm font-medium"
                    >
                      {{ item.quantity }}
                    </span>


                    <button
                      class="flex h-full w-9 items-center justify-center text-gray-600 transition hover:bg-gray-100 hover:text-black"
                      @click="increaseQuantity(item)"
                    >
                      +
                    </button>

                  </div>

                </div>


                <!-- Price -->

                <div
                  class="text-left sm:text-right"
                >

                  <p
                    class="text-sm font-semibold text-gray-950"
                  >
                    ${{ (item.price * item.quantity).toFixed(2) }}
                  </p>


                  <p
                    v-if="item.quantity > 1"
                    class="mt-1 text-xs text-gray-400"
                  >
                    ${{ item.price.toFixed(2) }} each
                  </p>

                </div>

              </div>

            </article>

          </div>


          <!-- Continue Shopping -->

          <div class="pt-7">

            <button
              class="inline-flex items-center gap-2 text-sm font-medium text-gray-700 transition hover:text-black"
              @click="continueShopping"
            >

              <span>
                ←
              </span>

              Continue Shopping

            </button>

          </div>

        </div>


        <!-- =================================================
             ORDER SUMMARY
        ================================================== -->

        <aside>

          <div
            class="sticky top-28 border border-gray-200 bg-white p-7"
          >

            <h2
              class="font-serif text-2xl font-bold text-gray-950"
            >
              Order Summary
            </h2>


            <!-- Summary -->

            <div
              class="mt-7 space-y-4 text-sm"
            >

              <div
                class="flex justify-between text-gray-600"
              >

                <span>
                  Subtotal
                </span>

                <span class="font-medium text-gray-950">
                  ${{ subtotal.toFixed(2) }}
                </span>

              </div>


              <div
                class="flex justify-between text-gray-600"
              >

                <span>
                  Shipping
                </span>

                <span
                  v-if="shipping === 0"
                  class="font-medium text-gray-950"
                >
                  Free
                </span>

                <span
                  v-else
                  class="font-medium text-gray-950"
                >
                  ${{ shipping.toFixed(2) }}
                </span>

              </div>

            </div>


            <!-- Free Shipping Message -->

            <div
              v-if="subtotal > 0 && subtotal < 100"
              class="mt-6 bg-[#f1f3f7] p-4 text-xs leading-5 text-gray-600"
            >

              Add
              <strong>
                ${{ (100 - subtotal).toFixed(2) }}
              </strong>
              more to qualify for
              <strong>
                free shipping.
              </strong>

            </div>


            <div
              v-else-if="subtotal >= 100"
              class="mt-6 bg-[#f1f3f7] p-4 text-xs leading-5 text-gray-600"
            >

              ✓ You've qualified for
              <strong>
                free shipping.
              </strong>

            </div>


            <!-- Divider -->

            <div
              class="my-7 border-t border-gray-200"
            />


            <!-- Total -->

            <div
              class="flex items-center justify-between"
            >

              <span
                class="font-serif text-xl font-bold text-gray-950"
              >
                Total
              </span>

              <span
                class="font-serif text-2xl font-bold text-gray-950"
              >
                ${{ total.toFixed(2) }}
              </span>

            </div>


            <!-- Checkout -->

            <button
              class="mt-7 w-full bg-black py-4 text-sm font-semibold text-white transition hover:bg-gray-800"
              @click="checkout"
            >
              Proceed to Checkout
            </button>


            <!-- Secure Checkout -->

            <div
              class="mt-5 flex items-center justify-center gap-2 text-xs text-gray-400"
            >

              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="h-4 w-4"
              >

                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M16.5 10.5V8a4.5 4.5 0 0 0-9 0v2.5m-1.5 0h12a1.5 1.5 0 0 1 1.5 1.5v7.5A1.5 1.5 0 0 1 18 21H6a1.5 1.5 0 0 1-1.5-1.5V12A1.5 1.5 0 0 1 6 10.5Z"
                />

              </svg>

              Secure checkout

            </div>

          </div>

        </aside>

      </section>

    </main>


    <!-- =====================================================
         FOOTER
    ====================================================== -->

    <footer
      class="border-t border-gray-200 bg-white"
    >

      <div
        class="mx-auto max-w-[1600px] px-6 py-10 lg:px-12"
      >

        <div
          class="flex flex-col justify-between gap-5 md:flex-row md:items-center"
        >

          <p
            class="font-serif text-xl font-bold text-gray-950"
          >
            Lumina Books
          </p>

          <p
            class="text-xs text-gray-400"
          >
            © 2026 Lumina Books. All rights reserved.
          </p>

        </div>

      </div>

    </footer>

  </div>

</template>