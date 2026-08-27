<script setup lang="ts">
type Product = {
  id: number
  title: string
  author: string
  genre: string
  format: string
  price: number
  originalPrice: number | null
  isNew: boolean
  image: string
}

defineProps<{
  product: Product
}>()
const emit = defineEmits<{
  'add-to-cart': [product: Product]
}>()
</script>
<template>
  <div
    class="group overflow-hidden rounded-2xl bg-white shadow-md transition duration-300 hover:-translate-y-2 hover:shadow-xl mt-8 ml-2"
  >
    <div class="relative overflow-hidden">
      <img
        :src="product.image"
        :alt="product.title"
        class="h-72 w-full object-cover transition duration-300 group-hover:scale-105"
      />
      <span
        v-if="product.isNew"
        class="absolute left-3 top-3 rounded-full bg-black px-3 py-1 text-xs font-semibold text-white"
      >
        NEW
      </span>
    </div>
    <div class="p-5">
      <p class="text-sm text-gray-500">
        {{ product.genre }} • {{ product.format }}
      </p>

      <h2 class="mt-2 text-lg font-bold text-gray-900">
        {{ product.title }}
      </h2>

      <p class="mt-1 text-sm text-gray-500">
        {{ product.author }}
      </p>
      <div class="mt-4 flex items-center gap-2">
        <span class="text-xl font-bold text-gray-900">
          ${{ product.price }}
        </span>
        <span
          v-if="product.originalPrice"
          class="text-sm text-gray-400 line-through"
        >
          ${{ product.originalPrice }}
        </span>
      </div>
      <button
        @click="emit('add-to-cart', product)"
        class="mt-5 w-full rounded-xl bg-blue-700 py-3 font-semibold text-white transition hover:bg-gray-800"
      >
        Add to Cart
      </button>
    </div>
  </div>
</template>