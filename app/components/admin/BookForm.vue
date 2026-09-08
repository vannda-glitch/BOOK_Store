<script setup lang="ts">

const props = defineProps<{
  book?: any | null
}>()

const emit = defineEmits<{
  'save': [book: any]
  'close': []
}>()

const form = ref({
  title: props.book?.title || '',
  shortTitle: props.book?.shortTitle || '',
  author: props.book?.author || '',
  price: props.book?.price || 0,
  genre: props.book?.genre || '',
  format: props.book?.format || '',
  image: props.book?.image || '',
  rating: props.book?.rating || 5,
  reviews: props.book?.reviews || 0
})

const handleSubmit = () => {
  emit('save', { ...form.value, id: props.book?.id })
}

</script>


<template>

  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
    <div class="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">
      <div class="mb-4 flex items-center justify-between">
        <h3 class="text-lg font-semibold text-gray-950">{{ book ? 'Edit Book' : 'Add New Book' }}</h3>
        <button @click="emit('close')" class="text-gray-400 hover:text-gray-600">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-6 w-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">Title</label>
          <input v-model="form.title" type="text" required class="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-black" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Short Title</label>
          <input v-model="form.shortTitle" type="text" class="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-black" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Author</label>
          <input v-model="form.author" type="text" required class="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-black" />
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Price</label>
            <input v-model.number="form.price" type="number" step="0.01" required class="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-black" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Genre</label>
            <input v-model="form.genre" type="text" required class="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-black" />
          </div>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Format</label>
            <input v-model="form.format" type="text" required class="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-black" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Rating</label>
            <input v-model.number="form.rating" type="number" step="0.1" min="0" max="5" class="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-black" />
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Image URL</label>
          <input v-model="form.image" type="url" required class="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-black" />
        </div>
        <div class="flex justify-end gap-3 pt-4">
          <button type="button" @click="emit('close')" class="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
          <button type="submit" class="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800">Save</button>
        </div>
      </form>
    </div>
  </div>

</template>
