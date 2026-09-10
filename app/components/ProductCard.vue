<script setup lang="ts">

const { addToCart } = useCart()

const orderNow = async (product: Product) => {
  await addToCart(product)
  await navigateTo('/order')
}

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

  <div class="group mt-8 ml-2 overflow-hidden rounded-2xl border border-[#dce9e4] bg-white/85 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">

    <!-- Image -->
    <div class="relative overflow-hidden">
      <NuxtLink :to="`/productDetail/${product.id}`">
        <img :src="product.image" :alt="product.title" class="h-72 w-full object-cover transition duration-500 group-hover:scale-105" />
      </NuxtLink>
      <span v-if="product.isNew" class="absolute left-3 top-3 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-white shadow-sm">
        NEW
      </span>
    </div>

    <!-- Content -->
    <div class="p-5">
      <p class="text-sm text-gray-500">
        {{ product.genre }} • {{ product.format }}
      </p>

      <NuxtLink :to="`/productDetail/${product.id}`">
        <h2 class="mt-2 font-serif text-lg font-bold text-ink transition group-hover:text-primary">
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
      <div class="mt-5 grid grid-cols-2 gap-2">
        <NuxtLink :to="`/productDetail/${product.id}`" class="flex-1 rounded-xl bg-ink py-3 text-center text-sm font-semibold text-white transition hover:bg-primary">
          View Details
        </NuxtLink>
        <button type="button" @click.stop.prevent="addToCart(product)" class="rounded-xl border border-primary py-3 text-sm font-semibold text-primary transition hover:bg-[#edf8f5]">
          Add to Cart
        </button>
        <button type="button" @click.stop.prevent="orderNow(product)" class="rounded-xl bg-[#0f766e] py-3 text-sm font-semibold text-white transition hover:bg-[#0b5f59]">
          Order Now
        </button>
      </div>
    </div>

  </div>

</template>
