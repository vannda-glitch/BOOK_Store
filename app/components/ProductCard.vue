<script setup lang="ts">

const { addToCart } = useCart()

type Product = {
  id: number | string
  title: string
  author?: string
  genre?: string
  format?: string
  price: number
  originalPrice?: number | null
  isNew?: boolean
  image: string
  shortTitle?: string
  rating?: number
  reviews?: number
}

defineProps<{
  product: Product
}>()

</script>


<template>

  <div class="group overflow-hidden rounded-2xl bg-white shadow-md transition duration-300 hover:-translate-y-2 hover:shadow-xl mt-8 ml-2">

    <!-- Image -->
    <div class="relative overflow-hidden">
      <NuxtLink :to="`/productDetail/${product.id}`">
        <img :src="product.image" :alt="product.title" class="h-72 w-full object-cover transition duration-300 group-hover:scale-105" />
      </NuxtLink>
      <span v-if="product.isNew" class="absolute left-3 top-3 rounded-full bg-black px-3 py-1 text-xs font-semibold text-white">
        NEW
      </span>
    </div>

    <!-- Content -->
    <div class="p-5">
      <p class="text-sm text-gray-500">
        {{ product.genre }} • {{ product.format }}
      </p>

      <NuxtLink :to="`/productDetail/${product.id}`">
        <h2 class="mt-2 text-lg font-bold text-gray-900 transition group-hover:text-blue-600">
          {{ product.shortTitle || product.title }}
        </h2>
      </NuxtLink>

      <p class="mt-1 text-sm text-gray-500">
        {{ product.author }}
      </p>

      <!-- Rating -->
      <div v-if="product.rating" class="mt-2 flex items-center gap-1">
        <span v-for="star in 5" :key="star" :class="star <= Math.round(product.rating) ? 'text-yellow-500' : 'text-gray-300'" class="text-xs">
          ★
        </span>
        <span v-if="product.reviews" class="ml-1 text-xs text-gray-400">({{ product.reviews }})</span>
      </div>

      <div class="mt-4 flex items-center gap-2">
        <span class="text-xl font-bold text-gray-900">
          ${{ product.price }}
        </span>
        <span v-if="product.originalPrice" class="text-sm text-gray-400 line-through">
          ${{ product.originalPrice }}
        </span>
      </div>

      <!-- Actions -->
      <div class="mt-5 flex gap-2">
        <NuxtLink :to="`/productDetail/${product.id}`" class="flex-1 rounded-xl bg-gray-900 py-3 text-center text-sm font-semibold text-white transition hover:bg-gray-800">
          View Details
        </NuxtLink>
        <button type="button" @click.stop.prevent="addToCart(product)" class="flex-1 rounded-xl bg-blue-700 py-3 text-sm font-semibold text-white transition hover:bg-blue-800">
          Add to Cart
        </button>
      </div>
    </div>

  </div>

</template>
