<script setup lang="ts">

definePageMeta({
  layout: 'admin',
  middleware: 'admin'
})

const API_URL = 'http://localhost:8000'

const books = ref<any[]>([])
const loading = ref(true)
const showForm = ref(false)
const editingBook = ref<any | null>(null)

const form = ref({
  title: '',
  author: '',
  price: 0,
  genre: '',
  format: '',
  image: '',
  shortTitle: '',
  rating: 5,
  reviews: 0
})

const fetchBooks = async () => {
  loading.value = true
  try {
    books.value = await $fetch<any[]>(`${API_URL}/books`)
  } catch (error) {
    console.error('Failed to fetch books:', error)
  } finally {
    loading.value = false
  }
}

const openAddForm = () => {
  editingBook.value = null
  form.value = { title: '', author: '', price: 0, genre: '', format: '', image: '', shortTitle: '', rating: 5, reviews: 0 }
  showForm.value = true
}

const openEditForm = (book: any) => {
  editingBook.value = book
  form.value = { ...book }
  showForm.value = true
}

const closeForm = () => {
  showForm.value = false
  editingBook.value = null
}

const saveBook = async () => {
  try {
    if (editingBook.value) {
      await $fetch(`${API_URL}/books/${editingBook.value.id}`, {
        method: 'PUT',
        body: form.value
      })
    } else {
      await $fetch(`${API_URL}/books`, {
        method: 'POST',
        body: form.value
      })
    }
    await fetchBooks()
    closeForm()
  } catch (error) {
    console.error('Failed to save book:', error)
  }
}

const deleteBook = async (id: string) => {
  if (!confirm('Are you sure you want to delete this book?')) return
  try {
    await $fetch(`${API_URL}/books/${id}`, { method: 'DELETE' })
    await fetchBooks()
  } catch (error) {
    console.error('Failed to delete book:', error)
  }
}

onMounted(() => {
  fetchBooks()
})

</script>


<template>

  <div>
    <!-- Header -->
    <div class="mb-6 flex items-center justify-between">
      <div>
        <h2 class="text-xl font-bold text-gray-950">Books Management</h2>
        <p class="mt-1 text-sm text-gray-500">Manage your book inventory</p>
      </div>
      <button @click="openAddForm" class="flex items-center gap-2 rounded-lg bg-black px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-5 w-5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
        Add Book
      </button>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex items-center justify-center py-20">
      <div class="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-black"></div>
    </div>

    <!-- Books Table -->
    <div v-else class="rounded-xl border border-gray-200 bg-white">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Book</th>
              <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Author</th>
              <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Genre</th>
              <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Price</th>
              <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Rating</th>
              <th class="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr v-for="book in books" :key="book.id" class="hover:bg-gray-50">
              <td class="whitespace-nowrap px-6 py-4">
                <div class="flex items-center gap-3">
                  <img :src="book.image" :alt="book.title" class="h-12 w-10 rounded object-cover" />
                  <div>
                    <p class="font-medium text-gray-900">{{ book.title }}</p>
                    <p class="text-xs text-gray-500">{{ book.format }}</p>
                  </div>
                </div>
              </td>
              <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{{ book.author }}</td>
              <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{{ book.genre }}</td>
              <td class="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">${{ Number(book.price).toFixed(2) }}</td>
              <td class="whitespace-nowrap px-6 py-4">
                <div class="flex items-center gap-1">
                  <span class="text-yellow-500">{{ book.rating }}</span>
                  <span class="text-gray-300">★</span>
                </div>
              </td>
              <td class="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                <button @click="openEditForm(book)" class="mr-3 text-blue-600 hover:text-blue-800">Edit</button>
                <button @click="deleteBook(book.id)" class="text-red-600 hover:text-red-800">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Book Form Modal -->
    <div v-if="showForm" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div class="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">
        <div class="mb-4 flex items-center justify-between">
          <h3 class="text-lg font-semibold text-gray-950">{{ editingBook ? 'Edit Book' : 'Add New Book' }}</h3>
          <button @click="closeForm" class="text-gray-400 hover:text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-6 w-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form @submit.prevent="saveBook" class="space-y-4">
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
            <button type="button" @click="closeForm" class="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
            <button type="submit" class="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800">Save</button>
          </div>
        </form>
      </div>
    </div>

  </div>

</template>
