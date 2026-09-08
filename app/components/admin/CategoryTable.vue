<script setup lang="ts">

defineProps<{
  categories: any[]
}>()

const emit = defineEmits<{
  'edit': [category: any]
  'delete': [id: string]
}>()

</script>


<template>

  <div class="rounded-xl border border-gray-200 bg-white">
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
              <button @click="emit('edit', category)" class="mr-3 text-blue-600 hover:text-blue-800">Edit</button>
              <button @click="emit('delete', category.id)" class="text-red-600 hover:text-red-800">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-if="categories.length === 0" class="px-6 py-12 text-center text-gray-500">
      No categories found.
    </div>
  </div>

</template>
