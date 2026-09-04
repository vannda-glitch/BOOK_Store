<template>
  <div v-if="loading" class="flex justify-center py-8">
    <LoadingSpinner size="md" />
  </div>
  <div v-else-if="books.length > 0" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
    <BookCard
      v-for="book in books"
      :key="book.id"
      :book="book"
    />
  </div>
  <div v-else class="text-center py-12">
    <Icon name="mdi:book-open-variant" size="64" class="text-gray-300 mx-auto" />
    <h3 class="mt-4 text-lg font-medium text-gray-900">No books found</h3>
    <p class="text-gray-500">Check back later for new arrivals</p>
  </div>
</template>

<script setup lang="ts">
import type { Book } from '~/types'

defineProps<{
  books: Book[]
  loading?: boolean
}>()
</script>