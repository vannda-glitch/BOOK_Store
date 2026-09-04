<template>
  <div v-if="book" class="grid grid-cols-1 lg:grid-cols-2 gap-8">
    <!-- Book Cover -->
    <div class="relative">
      <img
        :src="book.cover_image || '/images/default-book.jpg'"
        :alt="book.title"
        class="w-full max-w-md mx-auto rounded-xl shadow-lg"
      />
      
      <div class="absolute top-4 left-4 space-y-2">
        <span v-if="book.is_featured" class="badge badge-primary block">Featured</span>
        <span v-if="book.is_bestseller" class="badge badge-success block">Bestseller</span>
        <span v-if="book.is_new_arrival" class="badge badge-warning block">New</span>
      </div>
      
      <div v-if="book.discount_price" class="absolute top-4 right-4 bg-red-500 text-white text-sm font-bold px-3 py-2 rounded-lg">
        -{{ discountPercentage }}%
      </div>
    </div>
    
    <!-- Book Info -->
    <div>
      <h1 class="text-3xl font-bold text-gray-900">{{ book.title }}</h1>
      <p class="text-lg text-gray-600 mt-1">
        by <NuxtLink :to="`/authors/${book.author?.id}`" class="text-primary-600 hover:underline">
          {{ book.author?.name }}
        </NuxtLink>
      </p>
      
      <BookRating :rating="book.average_rating" :count="book.reviews?.length || 0" />
      
      <div class="mt-4">
        <span v-if="book.discount_price" class="text-3xl font-bold text-primary-600">
          ${{ book.discount_price.toFixed(2) }}
        </span>
        <span v-else class="text-3xl font-bold text-primary-600">
          ${{ book.price.toFixed(2) }}
        </span>
        <span v-if="book.discount_price" class="text-lg text-gray-400 line-through ml-3">
          ${{ book.price.toFixed(2) }}
        </span>
      </div>
      
      <div class="mt-4 space-y-2 text-sm">
        <p><span class="font-medium">ISBN:</span> {{ book.isbn || 'N/A' }}</p>
        <p><span class="font-medium">Publisher:</span> {{ book.publisher?.name || 'N/A' }}</p>
        <p><span class="font-medium">Publication Date:</span> {{ book.publication_date ? formatDate(book.publication_date) : 'N/A' }}</p>
        <p><span class="font-medium">Pages:</span> {{ book.pages || 'N/A' }}</p>
        <p><span class="font-medium">Language:</span> {{ book.language || 'N/A' }}</p>
        <p><span class="font-medium">Stock:</span> 
          <span :class="book.stock_quantity > 0 ? 'text-green-600' : 'text-red-600'">
            {{ book.stock_quantity > 0 ? `${book.stock_quantity} units available` : 'Out of Stock' }}
          </span>
        </p>
      </div>
      
      <div class="mt-6 flex flex-wrap gap-4">
        <button
          @click="handleAddToCart"
          class="btn btn-primary flex-1"
          :disabled="book.stock_quantity === 0 || addingToCart"
        >
          <LoadingSpinner v-if="addingToCart" size="sm" />
          <span v-else>{{ book.stock_quantity === 0 ? 'Out of Stock' : 'Add to Cart' }}</span>
        </button>
        <button
          @click="toggleWishlist"
          class="btn bg-white border border-gray-300 hover:bg-gray-50"
        >
          <Icon :name="isInWishlist ? 'mdi:heart' : 'mdi:heart-outline'" size="20" class="text-red-500" />
        </button>
      </div>
      
      <div class="mt-8">
        <h3 class="font-semibold text-gray-900 mb-2">Description</h3>
        <p class="text-gray-600 leading-relaxed">{{ book.description || 'No description available' }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Book } from '~/types'
import { useCart } from '~/composables/useCart'
import { useWishlist } from '~/composables/useWishlist'
import { formatters } from '~/utils/formatters'

const props = defineProps<{
  book: Book
}>()

const { addToCart } = useCart()
const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()

const addingToCart = ref(false)

const discountPercentage = computed(() => {
  if (!props.book.discount_price) return 0
  return Math.round(((props.book.price - props.book.discount_price) / props.book.price) * 100)
})

const formatDate = formatters.date

const handleAddToCart = async () => {
  addingToCart.value = true
  try {
    await addToCart(props.book.id)
  } finally {
    addingToCart.value = false
  }
}

const toggleWishlist = async () => {
  if (isInWishlist(props.book.id)) {
    await removeFromWishlist(props.book.id)
  } else {
    await addToWishlist(props.book.id)
  }
}
</script>