<template>
  <div class="bg-white rounded-lg shadow-sm p-4 mb-6">
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Search</label>
        <input
          v-model="filters.query"
          type="text"
          placeholder="Search books..."
          class="input"
          @input="applyFilters"
        />
      </div>
      
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Category</label>
        <select v-model="filters.category_id" class="input" @change="applyFilters">
          <option :value="undefined">All Categories</option>
          <option v-for="category in categories" :key="category.id" :value="category.id">
            {{ category.name }}
          </option>
        </select>
      </div>
      
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Price Range</label>
        <div class="flex gap-2">
          <input
            v-model.number="filters.min_price"
            type="number"
            placeholder="Min"
            class="input"
            @input="applyFilters"
          />
          <input
            v-model.number="filters.max_price"
            type="number"
            placeholder="Max"
            class="input"
            @input="applyFilters"
          />
        </div>
      </div>
      
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
        <select v-model="filters.sort_by" class="input" @change="applyFilters">
          <option value="created_at">Newest</option>
          <option value="price">Price: Low to High</option>
          <option value="-price">Price: High to Low</option>
          <option value="title">Title</option>
          <option value="average_rating">Rating</option>
        </select>
      </div>
    </div>
    
    <div v-if="hasActiveFilters" class="mt-4 flex flex-wrap gap-2">
      <span class="text-sm text-gray-600">Active filters:</span>
      <button
        v-for="(value, key) in activeFilters"
        :key="key"
        @click="clearFilter(key)"
        class="inline-flex items-center gap-1 px-2 py-1 bg-primary-50 text-primary-700 rounded-lg text-sm hover:bg-primary-100"
      >
        {{ getFilterLabel(key) }}: {{ value }}
        <Icon name="mdi:close" size="14" />
      </button>
      <button @click="clearAllFilters" class="text-sm text-red-600 hover:text-red-700">
        Clear All
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useBooks } from '~/composables/useBooks'
import type { BookSearchParams } from '~/types'

const emit = defineEmits<{
  (e: 'filter', params: BookSearchParams): void
}>()

const { categories } = useBooks()

const filters = reactive<BookSearchParams>({
  query: '',
  category_id: undefined,
  min_price: undefined,
  max_price: undefined,
  sort_by: 'created_at'
})

const applyFilters = () => {
  const params: BookSearchParams = {}
  
  if (filters.query) params.query = filters.query
  if (filters.category_id) params.category_id = filters.category_id
  if (filters.min_price !== undefined && filters.min_price !== null) params.min_price = filters.min_price
  if (filters.max_price !== undefined && filters.max_price !== null) params.max_price = filters.max_price
  if (filters.sort_by) params.sort_by = filters.sort_by
  
  emit('filter', params)
}

const hasActiveFilters = computed(() => {
  return !!filters.query || filters.category_id || filters.min_price || filters.max_price
})

const activeFilters = computed(() => {
  const active: Record<string, any> = {}
  if (filters.query) active.query = filters.query
  if (filters.category_id) active.category = categories.value.find(c => c.id === filters.category_id)?.name
  if (filters.min_price !== undefined && filters.min_price !== null) active.min_price = `$${filters.min_price}`
  if (filters.max_price !== undefined && filters.max_price !== null) active.max_price = `$${filters.max_price}`
  return active
})

const getFilterLabel = (key: string) => {
  const labels: Record<string, string> = {
    query: 'Search',
    category: 'Category',
    min_price: 'Min Price',
    max_price: 'Max Price'
  }
  return labels[key] || key
}

const clearFilter = (key: string) => {
  if (key === 'query') filters.query = ''
  if (key === 'category') filters.category_id = undefined
  if (key === 'min_price') filters.min_price = undefined
  if (key === 'max_price') filters.max_price = undefined
  applyFilters()
}

const clearAllFilters = () => {
  filters.query = ''
  filters.category_id = undefined
  filters.min_price = undefined
  filters.max_price = undefined
  applyFilters()
}

// Initialize with URL params
const route = useRoute()
if (route.query.search) filters.query = route.query.search as string
if (route.query.category) filters.category_id = Number(route.query.category)
applyFilters()
</script>