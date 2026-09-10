<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin' })
const API_URL = 'http://localhost:8000'; const users = ref<any[]>([]); const loading = ref(true); const search = ref('')
onMounted(async () => { try { users.value = await $fetch<any[]>(`${API_URL}/users`) } finally { loading.value = false } })
const filtered = computed(() => users.value.filter(user => `${user.name} ${user.email}`.toLowerCase().includes(search.value.toLowerCase())))
</script>
<template><section><AdminHeader title="Users" description="View registered customers and administrators." /><div class="mb-5"><input v-model="search" placeholder="Search users" class="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-primary sm:max-w-sm" /></div><div v-if="loading" class="py-20 text-center text-sm text-gray-500">Loading users...</div><UserTable v-else :users="filtered" /></section></template>
