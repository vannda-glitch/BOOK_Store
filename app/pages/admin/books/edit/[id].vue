<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin' })
const route = useRoute(); const API_URL = 'http://localhost:8000'; const book = ref<any | null>(null); const loading = ref(true); const saving = ref(false); const errorMessage = ref('')
const load = async () => { try { book.value = await $fetch<any>(`${API_URL}/books/${route.params.id}`) } catch { errorMessage.value = 'Book not found.' } finally { loading.value = false } }
const save = async (value: any) => { saving.value = true; try { await $fetch(`${API_URL}/books/${route.params.id}`, { method: 'PUT', body: value }); await navigateTo(`/admin/books/${route.params.id}`) } catch { errorMessage.value = 'Unable to save this book.' } finally { saving.value = false } }
onMounted(load)
</script>
<template><section><AdminHeader title="Edit book" description="Update catalog information." /><div v-if="loading" class="py-20 text-center text-sm text-gray-500">Loading book...</div><template v-else-if="book"><AdminBookEditor :book="book" :saving="saving" @save="save" @cancel="navigateTo(`/admin/books/${route.params.id}`)" /></template><p v-else class="rounded-xl bg-red-50 p-4 text-sm text-red-700">{{ errorMessage }}</p></section></template>
