<script setup lang="ts">

definePageMeta({
  layout: 'admin',
  middleware: 'admin'
})

const API_URL = 'http://localhost:8000'

const categories = ref<any[]>([])
const loading = ref(true)
const showForm = ref(false)
const editingCategory = ref<any | null>(null)

const form = ref({
  name: '',
  slug: ''
})

const fetchCategories = async () => {
  loading.value = true
  try {
    categories.value = await $fetch<any[]>(`${API_URL}/categories`)
  } catch (error) {
    console.error('Failed to fetch categories:', error)
  } finally {
    loading.value = false
  }
}

const generateSlug = (name: string) => {
  return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
}

const openAddForm = () => {
  editingCategory.value = null
  form.value = { name: '', slug: '' }
  showForm.value = true
}

const openEditForm = (category: any) => {
  editingCategory.value = category
  form.value = { ...category }
  showForm.value = true
}

const closeForm = () => {
  showForm.value = false
  editingCategory.value = null
}

const handleNameChange = () => {
  if (!editingCategory.value) {
    form.value.slug = generateSlug(form.value.name)
  }
}

const saveCategory = async () => {
  try {
    if (editingCategory.value) {
      await $fetch(`${API_URL}/categories/${editingCategory.value.id}`, {
        method: 'PUT',
        body: form.value
      })
    } else {
      await $fetch(`${API_URL}/categories`, {
        method: 'POST',
        body: form.value
      })
    }
    await fetchCategories()
    closeForm()
  } catch (error) {
    console.error('Failed to save category:', error)
  }
}

const deleteCategory = async (id: string) => {
  if (!confirm('Are you sure you want to delete this category?')) return
  try {
    await $fetch(`${API_URL}/categories/${id}`, { method: 'DELETE' })
    await fetchCategories()
  } catch (error) {
    console.error('Failed to delete category:', error)
  }
}

onMounted(() => {
  fetchCategories()
})

</script>


<template>

  <div>
    <!-- Header -->
    <div class="mb-6 flex items-center justify-between">
      <div>
        <h2 class="text-xl font-bold text-gray-950">Categories & Products</h2>
        <p class="mt-1 text-sm text-gray-500">Manage product categories</p>
      </div>
      <button @click="openAddForm" class="flex items-center gap-2 rounded-lg bg-black px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-5 w-5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
        Add Category
      </button>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex items-center justify-center py-20">
      <div class="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-black"></div>
    </div>

    <!-- Categories Table -->
    <div v-else class="rounded-xl border border-gray-200 bg-white">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">ID</th>
              <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Name</th>
              <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Slug</th>
              <th class="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr v-for="category in categories" :key="category.id" class="hover:bg-gray-50">
              <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{{ category.id }}</td>
              <td class="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">{{ category.name }}</td>
              <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{{ category.slug }}</td>
              <td class="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                <button @click="openEditForm(category)" class="mr-3 text-blue-600 hover:text-blue-800">Edit</button>
                <button @click="deleteCategory(category.id)" class="text-red-600 hover:text-red-800">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-if="categories.length === 0" class="px-6 py-12 text-center text-gray-500">
        No categories found. Add your first category to get started.
      </div>
    </div>

    <!-- Category Form Modal -->
    <div v-if="showForm" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div class="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
        <div class="mb-4 flex items-center justify-between">
          <h3 class="text-lg font-semibold text-gray-950">{{ editingCategory ? 'Edit Category' : 'Add New Category' }}</h3>
          <button @click="closeForm" class="text-gray-400 hover:text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-6 w-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form @submit.prevent="saveCategory" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Category Name</label>
            <input v-model="form.name" type="text" required @input="handleNameChange" class="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-black" placeholder="e.g., Fiction, Science, History" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Slug</label>
            <input v-model="form.slug" type="text" required class="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-black" placeholder="e.g., fiction, science, history" />
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
