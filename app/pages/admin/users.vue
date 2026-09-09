<script setup lang="ts">

definePageMeta({
  layout: 'admin',
  middleware: 'admin'
})

const API_URL = 'http://localhost:8000'
const users = ref<any[]>([])
const loading = ref(true)
const errorMessage = ref('')

const fetchUsers = async () => {
  loading.value = true
  errorMessage.value = ''

  try {
    users.value = await $fetch<any[]>(`${API_URL}/users`)
  } catch (error) {
    console.error('Failed to fetch users:', error)
    errorMessage.value = 'Unable to load users. Check that JSON Server is running.'
  } finally {
    loading.value = false
  }
}

const deleteUser = async (id: string | number) => {
  if (!confirm('Are you sure you want to delete this user?')) return

  try {
    await $fetch(`${API_URL}/users/${id}`, { method: 'DELETE' })
    await fetchUsers()
  } catch (error) {
    console.error('Failed to delete user:', error)
    errorMessage.value = 'Unable to delete this user.'
  }
}

onMounted(fetchUsers)
</script>

<template>
  <section>
    <div class="mb-6">
      <h2 class="text-xl font-bold text-gray-950">Users</h2>
      <p class="mt-1 text-sm text-gray-500">Manage registered ReadPlus accounts.</p>
    </div>

    <div v-if="loading" class="flex items-center justify-center py-20">
      <div class="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-black" />
    </div>

    <div v-else-if="errorMessage" class="rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
      {{ errorMessage }}
    </div>

    <UserTable v-else :users="users" @delete="deleteUser" />
  </section>
</template>
