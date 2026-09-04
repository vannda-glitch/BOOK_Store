<template>
  <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
    <NuxtLink
      v-for="category in categories"
      :key="category.id"
      :to="`/books/category/${category.slug}`"
      class="card p-6 text-center hover:shadow-xl transition-shadow group"
    >
      <div class="text-3xl mb-2 text-primary-400 group-hover:text-primary-600 transition-colors">
        <Icon :name="category.icon || 'mdi:book-open-variant'" size="32" />
      </div>
      <h3 class="font-medium text-gray-800 group-hover:text-primary-600 transition-colors">
        {{ category.name }}
      </h3>
      <p class="text-sm text-gray-500 mt-1">{{ category.description || 'Browse collection' }}</p>
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
import type { Category } from '~/types'

defineProps<{
  categories: Category[]
}>()
</script>