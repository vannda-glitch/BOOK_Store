<template>
  <div v-if="totalPages > 1" class="flex items-center justify-center space-x-2 mt-8">
    <button
      @click="handlePageChange(currentPage - 1)"
      :disabled="currentPage === 1"
      class="btn btn-secondary text-sm"
    >
      <Icon name="mdi:chevron-left" size="16" />
      Previous
    </button>
    
    <div class="flex items-center space-x-1">
      <template v-for="page in visiblePages" :key="page">
        <button
          v-if="page !== '...'"
          @click="handlePageChange(page as number)"
          :class="[
            'px-3 py-1 rounded-lg text-sm font-medium transition-colors min-w-[36px]',
            currentPage === page
              ? 'bg-primary-600 text-white'
              : 'text-gray-700 hover:bg-gray-100'
          ]"
        >
          {{ page }}
        </button>
        <span v-else class="px-2 text-gray-500">…</span>
      </template>
    </div>
    
    <button
      @click="handlePageChange(currentPage + 1)"
      :disabled="currentPage === totalPages"
      class="btn btn-secondary text-sm"
    >
      Next
      <Icon name="mdi:chevron-right" size="16" />
    </button>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  currentPage: number
  totalPages: number
  maxVisible?: number
}>()

const emit = defineEmits<{
  (e: 'page-change', page: number): void
}>()

const visiblePages = computed(() => {
  const total = props.totalPages
  const current = props.currentPage
  const maxVisible = props.maxVisible || 5
  
  if (total <= maxVisible) {
    return Array.from({ length: total }, (_, i) => i + 1)
  }
  
  const pages: (number | string)[] = []
  const half = Math.floor(maxVisible / 2)
  
  let start = Math.max(1, current - half)
  let end = Math.min(total, start + maxVisible - 1)
  
  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1)
  }
  
  if (start > 1) {
    pages.push(1)
    if (start > 2) pages.push('...')
  }
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  
  if (end < total) {
    if (end < total - 1) pages.push('...')
    pages.push(total)
  }
  
  return pages
})

const handlePageChange = (page: number) => {
  if (page >= 1 && page <= props.totalPages && page !== props.currentPage) {
    emit('page-change', page)
  }
})
</script>