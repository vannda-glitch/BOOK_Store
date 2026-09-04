<template>
  <div class="container mx-auto px-4 py-8">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900">Categories</h1>
      <p class="text-gray-600 mt-1">Browse books by category</p>
    </div>
    
    <div v-if="!loadingCategories" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      <NuxtLink
        v-for="category in categories"
        :key="category.id"
        :to="`/books/category/${category.slug}`"
        class="card p-6 text-center hover:shadow-xl transition-all group"
      >
        <div class="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary-200 transition-colors">
          <Icon :name="category.icon || 'mdi:book-open-variant'" size="32" class="text-primary-600" />
        </div>
        <h3 class="font-semibold text-gray-800 group-hover:text-primary-600 transition-colors">
          {{ category.name }}
        </h3>
        <p class="text-sm text-gray-500 mt-1">{{ category.description || 'Browse collection' }}</p>
        <span class="inline-block mt-3 text-xs text-primary-600 group-hover:underline">
          View Books →
        </span>
      </NuxtLink>
    </div>
    
    <div v-else class="flex justify-center py-12">
      <LoadingSpinner size="lg" />
    </div>
    
    <div v-if="categories.length === 0 && !loadingCategories" class="text-center py-12">
      <Icon name="mdi:book-open-variant" size="64" class="text-gray-300 mx-auto" />
      <h3 class="mt-4 text-lg font-medium text-gray-900">No categories found</h3>
      <p class="text-gray-500">Check back later for new categories</p>
    </div>
  </div>
</template>

<script setup lang="ts">

import { useBooks } from '~/composables/useBooks'
import LoadingSpinner from '~/components/common/LoadingSpinner.vue'

const { categories, loadingCategories, fetchCategories } = useBooks()

await fetchCategories()
</script>