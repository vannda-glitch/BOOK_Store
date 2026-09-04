<template>
  <div class="card p-4 flex flex-col sm:flex-row items-center gap-4">
    <img
      :src="book.cover_image || '/images/default-book.jpg'"
      :alt="book.title"
      class="w-24 h-32 object-cover rounded-lg"
    />
    
    <div class="flex-1 text-center sm:text-left">
      <NuxtLink :to="`/books/${book.slug}`" class="font-semibold text-gray-800 hover:text-primary-600">
        {{ book.title }}
      </NuxtLink>
      <p class="text-sm text-gray-600">by {{ book.author?.name }}</p>
      
      <div class="flex items-center justify-center sm:justify-start gap-4 mt-2">
        <div>
          <span v-if="book.discount_price" class="font-bold text-primary-600">
            ${{ book.discount_price.toFixed(2) }}
          </span>
          <span v-else class="font-bold text-primary-600">
            ${{ book.price.toFixed(2) }}
          </span>
          <span v-if="book.discount_price" class="text-sm text-gray-400 line-through ml-2">
            ${{ book.price.toFixed(2) }}
          </span>
        </div>
      </div>
    </div>
    
    <div class="flex flex-col sm:flex-row gap-2">
      <button
        @click="handleMoveToCart"
        class="btn btn-primary text-sm"
        :disabled="book.stock_quantity === 0"
      >
        <Icon name="mdi:cart" size="16" class="inline mr-1" />
        Move to Cart
      </button>
      <button
        @click="handleRemove"
        class="btn btn-danger text-sm"
      >
        <Icon name="mdi:close" size="16" class="inline mr-1" />
        Remove
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Book } from '~/types'

const props = defineProps<{
  book: Book
}>()

const emit = defineEmits<{
  (e: 'move-to-cart', bookId: number): void
  (e: 'remove', bookId: number): void
}>()

const handleMoveToCart = () => {
  emit('move-to-cart', props.book.id)
}

const handleRemove = () => {
  emit('remove', props.book.id)
}
</script>