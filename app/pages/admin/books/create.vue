<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin' })
const API_URL = 'http://localhost:8000'; const saving = ref(false); const errorMessage = ref('')
const save = async (book: any) => { saving.value = true; try { await $fetch(`${API_URL}/books`, { method: 'POST', body: book }); await navigateTo('/admin/books') } catch { errorMessage.value = 'Unable to create this book.' } finally { saving.value = false } }
</script>
<template><section><AdminHeader title="Add book" description="Create a new title for your catalog." /><p v-if="errorMessage" class="mb-5 rounded-xl bg-red-50 p-4 text-sm text-red-700">{{ errorMessage }}</p><AdminBookEditor :saving="saving" @save="save" @cancel="navigateTo('/admin/books')" /></section></template>
