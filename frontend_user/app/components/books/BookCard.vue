<template>
  <div class="card overflow-hidden group">
    <div class="relative aspect-[3/4] overflow-hidden bg-gray-100">
      <img
        :src="book.cover_image || '/images/default-book.jpg'"
        :alt="book.title"
        class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        loading="lazy"
      />
      
      <!-- Badges -->
      <div class="absolute top-2 left-2 space-y-1">
        <span v-if="book.is_featured" class="badge badge-primary">Featured</span>
        <span v-if="book.is_bestseller" class="badge badge-success">Bestseller</span>
        <span v-if="book.is_new_arrival" class="badge badge-warning">New</span>
      </div>
      
      <!-- Discount badge -->
      <div v-if="book.discount_price" class="absolute top-2 right-2 bg-red-500 text-white text-sm font-bold px-2 py-1 rounded">
        -{{ discountPercentage }}%
      </div>
      
      <!-- Quick actions on hover -->
      <div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-2">
        <button
          @click="handleAddToCart"
          class="btn btn-primary text-sm"
          :disabled="book.stock_quantity === 0"
        >
          {{ book.stock_quantity === 0 ? 'Out of Stock' : 'Add to Cart' }}
        </button>
        <button
          @click="toggleWishlist"
          class="btn bg-white text-red-500 hover:bg-red-500 hover:text-white"
        >
          <Icon :name="isInWishlist ? 'mdi:heart' : 'mdi:heart-outline'" size="20" />
        </button>
      </div>
    </div>
    
    <div class="p-4">
      <NuxtLink :to="`/books/${book.slug}`" class="block">
        <h3 class="font-semibold text-gray-800 hover:text-primary-600 line-clamp-2">
          {{ book.title }}
        </h3>
      </NuxtLink>
      
      <p class="text-sm text-gray-600 mt-1">
        by <NuxtLink :to="`/authors/${book.author?.id}`" class="hover:text-primary-600">
          {{ book.author?.name }}
        </NuxtLink>
      </p>
      
      <!-- Rating -->
      <BookRating :rating="book.average_rating" :count="book.reviews?.length || 0" />
      
      <!-- Price -->
      <div class="flex items-center justify-between mt-3">
        <div>
          <span v-if="book.discount_price" class="text-lg font-bold text-primary-600">
            ${{ book.discount_price.toFixed(2) }}
          </span>
          <span v-else class="text-lg font-bold text-primary-600">
            ${{ book.price.toFixed(2) }}
          </span>
          <span v-if="book.discount_price" class="text-sm text-gray-400 line-through ml-2">
            ${{ book.price.toFixed(2) }}
          </span>
        </div>
        <span class="text-sm text-gray-500">
          {{ book.stock_quantity > 0 ? `${book.stock_quantity} in stock` : 'Out of stock' }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCart } from '~/composables/useCart'
import { useWishlist } from '~/composables/useWishlist'
import type { Book } from '~/types'

const props = defineProps<{
  book: Book
}>()

const { addToCart } = useCart()
const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()

const discountPercentage = computed(() => {
  if (!props.book.discount_price) return 0
  return Math.round(((props.book.price - props.book.discount_price) / props.book.price) * 100)
})

const isInWishlist = computed(() => {
  return useWishlist().isInWishlist(props.book.id)
})

const handleAddToCart = async () => {
  await addToCart(props.book.id)
}

const toggleWishlist = async () => {
  if (isInWishlist.value) {
    await removeFromWishlist(props.book.id)
  } else {
    await addToWishlist(props.book.id)
  }
}
</script>