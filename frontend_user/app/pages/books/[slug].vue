```vue
<template>
  <div class="min-h-screen bg-gray-50">
    <div class="container mx-auto px-4 py-8 sm:py-10 lg:py-12">

      <!-- Page Header -->
      <div class="mb-8">
        <div class="flex items-center gap-2 text-sm text-gray-500 mb-3">
          <NuxtLink
            to="/books"
            class="transition hover:text-gray-900"
          >
            Books
          </NuxtLink>

          <Icon
            name="mdi:chevron-right"
            size="18"
          />

          <span class="text-gray-900">
            {{ categoryName }}
          </span>
        </div>

        <div class="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1
              class="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900"
            >
              {{ categoryName }}
            </h1>

            <p class="mt-2 text-gray-600">
              Browse our collection of books in this category.
            </p>
          </div>

          <!-- Book Count -->
          <div
            v-if="!loading && books.length > 0"
            class="inline-flex w-fit items-center rounded-full
                   bg-white border border-gray-200
                   px-4 py-2 text-sm font-medium text-gray-600"
          >
            <Icon
              name="mdi:book-open-variant"
              size="18"
              class="mr-2 text-gray-400"
            />

            {{ books.length }}
            {{ books.length === 1 ? 'book' : 'books' }}
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div
        v-if="loading"
        class="flex min-h-[300px] items-center justify-center"
      >
        <LoadingSpinner size="lg" />
      </div>

      <!-- Books -->
      <template v-else>
        <div
          v-if="books.length > 0"
          class="grid grid-cols-2 gap-4 sm:grid-cols-2
                 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
        >
          <BookCard
            v-for="book in books"
            :key="book.id"
            :book="book"
          />
        </div>

        <!-- Empty State -->
        <div
          v-else
          class="flex min-h-[400px] flex-col items-center
                 justify-center rounded-2xl border border-gray-200
                 bg-white px-6 text-center"
        >
          <div
            class="flex h-16 w-16 items-center justify-center
                   rounded-2xl bg-gray-100 text-gray-400"
          >
            <Icon
              name="mdi:book-open-variant"
              size="32"
            />
          </div>

          <h2 class="mt-5 text-xl font-semibold text-gray-900">
            No books found
          </h2>

          <p class="mt-2 max-w-sm text-sm leading-6 text-gray-500">
            There are currently no books available in
            <span class="font-medium text-gray-700">
              {{ categoryName }}
            </span>.
          </p>

          <NuxtLink
            to="/books"
            class="mt-6 inline-flex items-center gap-2
                   rounded-xl bg-gray-900 px-5 py-3
                   text-sm font-semibold text-white
                   transition hover:bg-gray-800"
          >
            <Icon
              name="mdi:arrow-left"
              size="18"
            />

            Browse all books
          </NuxtLink>
        </div>
      </template>

    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

import { useBooks } from '~/composables/useBooks'
import BookCard from '~/components/books/BookCard.vue'
import LoadingSpinner from '~/components/common/LoadingSpinner.vue'

definePageMeta({
  layout: 'default'
})

const route = useRoute()

const {
  books,
  categories,
  loading,
  fetchBooks
} = useBooks()

const slug = computed(() => String(route.params.slug))

const category = computed(() =>
  categories.value.find(
    category => category.slug === slug.value
  )
)

const categoryName = computed(() =>
  category.value?.name || 'Category'
)

// Fetch books when category is available
await fetchBooks({
  category_id: category.value?.id
})
</script>
```
