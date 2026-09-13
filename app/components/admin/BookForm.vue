<script setup lang="ts">

const props = defineProps<{
  book?: any | null
}>()

const emit = defineEmits<{
  'save': [book: any]
  'close': []
}>()

const imageError = ref('')
const categoryOptions = ref<string[]>([])
const formatOptions = ref<string[]>([])
const API_URL = 'http://localhost:8000'

const form = ref({
  title: props.book?.title || '',
  shortTitle: props.book?.shortTitle || '',
  author: props.book?.author || '',
  price: props.book?.price || 0,
  category: props.book?.category || '',
  format: props.book?.format || '',
  image: props.book?.image || '',
  rating: props.book?.rating || 5,
  reviews: props.book?.reviews || 0
})

const handleSubmit = () => {
  if (!form.value.image) {
    imageError.value = 'Choose an image or enter an image URL.'
    return
  }
  emit('save', { ...form.value, id: props.book?.id })
}

const loadOptions = async () => {
  try {
    const [categoryRecords, books] = await Promise.all([
      $fetch<any[]>(`${API_URL}/categories`),
      $fetch<any[]>(`${API_URL}/books`)
    ])
    categoryOptions.value = categoryRecords.map(category => category.name).filter(Boolean)
    formatOptions.value = [...new Set(books.map(book => book.format).filter(Boolean))]
    if (form.value.category && !categoryOptions.value.includes(form.value.category)) categoryOptions.value.push(form.value.category)
    if (form.value.format && !formatOptions.value.includes(form.value.format)) formatOptions.value.push(form.value.format)
  } catch {
    categoryOptions.value = form.value.category ? [form.value.category] : []
    formatOptions.value = form.value.format ? [form.value.format] : []
  }
}

const handleImageUpload = (event: Event) => {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  imageError.value = ''
  if (!file) return
  if (!file.type.startsWith('image/')) {
    imageError.value = 'Please select an image file.'
    input.value = ''
    return
  }
  if (file.size > 5 * 1024 * 1024) {
    imageError.value = 'Image must be 5 MB or smaller.'
    input.value = ''
    return
  }
  const reader = new FileReader()
  reader.onload = () => { form.value.image = String(reader.result || '') }
  reader.onerror = () => { imageError.value = 'Unable to read this image.'; input.value = '' }
  reader.readAsDataURL(file)
}

onMounted(loadOptions)

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
            <label class="block text-sm font-medium text-gray-700">Category</label>
            <select v-model="form.category" required class="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-black"><option value="" disabled>Select a category</option><option v-for="category in categoryOptions" :key="category" :value="category">{{ category }}</option></select>
          </div>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Format</label>
            <select v-model="form.format" required class="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-black"><option value="" disabled>Select a format</option><option v-for="format in formatOptions" :key="format" :value="format">{{ format }}</option></select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Rating</label>
            <input v-model.number="form.rating" type="number" step="0.1" min="0" max="5" class="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-black" />
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Cover image</label>
          <input type="file" accept="image/*" class="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 text-sm" @change="handleImageUpload" />
          <input v-model="form.image" type="text" placeholder="Or paste an image URL" class="mt-2 w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-black" />
          <p v-if="imageError" class="mt-1 text-xs text-red-600">{{ imageError }}</p>
          <img v-if="form.image" :src="form.image" alt="Cover preview" class="mt-2 h-24 w-16 rounded object-cover" />
        </div>
        <div class="flex justify-end gap-3 pt-4">
          <button type="button" @click="emit('close')" class="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
          <button type="submit" class="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800">Save</button>
        </div>
      </form>
    </div>
  </div>

</template>
