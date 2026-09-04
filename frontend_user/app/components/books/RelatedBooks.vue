<template>
  <div v-if="books.length > 0" class="mt-12">
    <h3 class="text-xl font-semibold text-gray-900 mb-6">You might also like</h3>
    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      <BookCard v-for="book in books" :key="book.id" :book="book" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Book } from '~/types'

defineProps<{
  books: Book[]
}>()
</script>