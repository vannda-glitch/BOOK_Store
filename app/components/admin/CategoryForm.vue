<script setup lang="ts">

const props = defineProps<{
  category?: any | null
  saving?: boolean
}>()

const emit = defineEmits<{
  'save': [category: any]
  'close': []
}>()

const form = ref({
  name: props.category?.name || '',
  slug: props.category?.slug || ''
})

watch(() => props.category, category => {
  form.value = { name: category?.name || '', slug: category?.slug || '' }
}, { immediate: true })

const generateSlug = (name: string) => {
  return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
}

const handleNameChange = () => {
  if (!props.category) {
    form.value.slug = generateSlug(form.value.name)
  }
}

const handleSubmit = () => {
  emit('save', { ...form.value, id: props.category?.id })
}

</script>


<template>

  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
    <div class="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
      <div class="mb-4 flex items-center justify-between">
        <h3 class="text-lg font-semibold text-gray-950">{{ category ? 'Edit Category' : 'Add New Category' }}</h3>
        <button @click="emit('close')" class="text-gray-400 hover:text-gray-600">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-6 w-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">Category Name</label>
          <input v-model="form.name" type="text" required @input="handleNameChange" class="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-black" placeholder="e.g., Fiction, Science" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Slug</label>
          <input v-model="form.slug" type="text" required class="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-black" placeholder="e.g., fiction, science" />
        </div>
        <div class="flex justify-end gap-3 pt-4">
          <button type="button" @click="emit('close')" class="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
          <button type="submit" :disabled="props.saving" class="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-[#0b5f59] disabled:opacity-50">{{ props.saving ? 'Saving...' : 'Save category' }}</button>
        </div>
      </form>
    </div>
  </div>

</template>
