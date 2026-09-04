<template>
  <div class="relative w-full">
    <input
      v-model="searchQuery"
      type="text"
      placeholder="Search for books..."
      class="w-full px-4 py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
      @input="handleSearch"
      @keyup.enter="handleSubmit"
    />
    <span class="absolute left-3 top-2.5 text-gray-400">
      <Icon name="mdi:magnify" size="20" />
    </span>
    <button
      v-if="searchQuery"
      @click="clearSearch"
      class="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
    >
      <Icon name="mdi:close" size="20" />
    </button>
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits<{
  (e: 'search', query: string): void
  (e: 'clear'): void
}>()

const searchQuery = ref('')
let searchTimeout: NodeJS.Timeout

const handleSearch = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    if (searchQuery.value.trim()) {
      emit('search', searchQuery.value.trim())
    }
  }, 300)
}

const handleSubmit = () => {
  if (searchQuery.value.trim()) {
    emit('search', searchQuery.value.trim())
  }
}

const clearSearch = () => {
  searchQuery.value = ''
  emit('clear')
}
</script>