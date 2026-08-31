<script setup lang="ts">
import { computed, ref } from 'vue'
import userApi from '~/src/api/userapi.json'

const route = useRoute()
type Product = (typeof userApi.products)[number]

const product = computed<Product | undefined>(() => {
  const productId = Number(route.query.id)
  return userApi.products.find(item => item.id === productId)
})

const quantity = ref(1)

const increaseQuantity = () => {
  quantity.value++
}

const decreaseQuantity = () => {
  if (quantity.value > 1) {
    quantity.value--
  }
}
</script>

<template>
  <div v-if="product" class="min-h-screen bg-gray-100 py-10">
    <div class="mx-auto max-w-6xl px-4">

      <!-- Product Detail -->
      <div class="grid gap-10 rounded-2xl bg-white p-6 shadow-lg md:grid-cols-2 md:p-10">

        <!-- LEFT: Image -->
        <div class="relative">
          <div class="overflow-hidden rounded-2xl bg-gray-200">
            <img
              :src="product.image"
              :alt="product.title"
              class="h-[500px] w-full object-cover transition duration-300 hover:scale-105"
            />
          </div>

          <!-- New Badge -->
          <span
            v-if="product.isNew"
            class="absolute left-4 top-4 rounded-full bg-black px-4 py-2 text-sm font-semibold text-white"
          >
            NEW
          </span>
        </div>

        <!-- RIGHT: Product Information -->
        <div class="flex flex-col justify-center">

          <!-- Genre -->
          <p class="mb-2 text-sm font-semibold uppercase tracking-wider text-gray-500">
            {{ product.genre }}
          </p>

          <!-- Title -->
          <h1 class="text-3xl font-bold text-gray-900 md:text-5xl">
            {{ product.title }}
          </h1>

          <!-- Author -->
          <p class="mt-4 text-lg text-gray-600">
            By
            <span class="font-semibold text-black">
              {{ product.author }}
            </span>
          </p>

          <!-- Price -->
          <div class="mt-6 flex items-center gap-4">

            <span class="text-3xl font-bold text-black">
              ${{ product.price }}
            </span>

            <span
              v-if="product.originalPrice"
              class="text-lg text-gray-400 line-through"
            >
              ${{ product.originalPrice }}
            </span>

            <span
              v-if="product.originalPrice"
              class="rounded-md bg-red-100 px-3 py-1 text-sm font-semibold text-red-600"
            >
              SALE
            </span>

          </div>

          <!-- Description -->
          <p class="mt-6 leading-7 text-gray-600">
            Explore this amazing book and discover interesting ideas,
            stories, and inspiration. This book is perfect for readers
            who enjoy {{ product.genre }}.
          </p>

          <!-- Product Details -->
          <div class="mt-8 border-y border-gray-200 py-5">

            <div class="flex items-center justify-between py-3">
              <span class="text-gray-500">
                Genre
              </span>

              <span class="font-semibold text-gray-800">
                {{ product.genre }}
              </span>
            </div>

            <div class="flex items-center justify-between py-3">
              <span class="text-gray-500">
                Format
              </span>

              <span class="font-semibold text-gray-800">
                {{ product.format }}
              </span>
            </div>

            <div class="flex items-center justify-between py-3">
              <span class="text-gray-500">
                Status
              </span>

              <span class="font-semibold text-green-600">
                In Stock
              </span>
            </div>

          </div>

          <!-- Quantity -->
          <div class="mt-6">

            <p class="mb-3 font-semibold text-gray-800">
              Quantity
            </p>

            <div class="flex w-fit items-center rounded-lg border border-gray-300">

              <button
                @click="decreaseQuantity"
                class="px-4 py-2 text-xl hover:bg-gray-100"
              >
                −
              </button>

              <span class="w-12 text-center font-semibold">
                {{ quantity }}
              </span>

              <button
                @click="increaseQuantity"
                class="px-4 py-2 text-xl hover:bg-gray-100"
              >
                +
              </button>

            </div>

          </div>

          <!-- Buttons -->
          <div class="mt-8 flex flex-col gap-4 sm:flex-row">

            <button
              class="flex-1 rounded-xl bg-black py-4 font-semibold text-white transition hover:bg-gray-800"
            >
              Add to Cart
            </button>

            <button
              class="flex-1 rounded-xl border-2 border-black py-4 font-semibold text-black transition hover:bg-black hover:text-white"
            >
              Buy Now
            </button>

          </div>

        </div>

      </div>

    </div>
  </div>
  <div v-else class="min-h-screen bg-gray-100 px-4 py-20 text-center">
    <h1 class="text-2xl font-bold text-gray-900">Product not found</h1>
    <NuxtLink to="/product" class="mt-4 inline-block font-semibold text-blue-700 hover:underline">
      Back to books
    </NuxtLink>
  </div>
</template>