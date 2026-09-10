<script setup lang="ts">
const props = defineProps<{ book?: any | null; saving?: boolean }>()
const emit = defineEmits<{ save: [book: any]; cancel: [] }>()
const form = reactive({ title: '', shortTitle: '', author: '', price: 0, genre: '', format: '', image: '', rating: 5, reviews: 0 })
watch(() => props.book, value => Object.assign(form, value || { title: '', shortTitle: '', author: '', price: 0, genre: '', format: '', image: '', rating: 5, reviews: 0 }), { immediate: true })
</script>

<template><form class="space-y-4" @submit.prevent="emit('save', { ...form, id: props.book?.id, price: Number(form.price), rating: Number(form.rating), reviews: Number(form.reviews) })"><div class="grid gap-3 sm:grid-cols-2"><label class="sm:col-span-2"><span class="field-label">Title</span><input v-model="form.title" required class="field-input" /></label><label><span class="field-label">Short title</span><input v-model="form.shortTitle" class="field-input" /></label><label><span class="field-label">Author</span><input v-model="form.author" required class="field-input" /></label><label><span class="field-label">Price</span><input v-model.number="form.price" required min="0" step="0.01" type="number" class="field-input" /></label><label><span class="field-label">Genre</span><input v-model="form.genre" required class="field-input" /></label><label><span class="field-label">Format</span><input v-model="form.format" required class="field-input" /></label><label><span class="field-label">Rating</span><input v-model.number="form.rating" min="0" max="5" step="0.1" type="number" class="field-input" /></label><label><span class="field-label">Reviews</span><input v-model.number="form.reviews" min="0" type="number" class="field-input" /></label><label class="sm:col-span-2"><span class="field-label">Cover image URL</span><input v-model="form.image" required type="url" class="field-input" /></label></div><div class="flex flex-col-reverse gap-2 border-t border-[#e6efec] pt-4 sm:flex-row sm:justify-end"><button type="button" class="rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-600 transition hover:bg-[#f3f9f7]" @click="emit('cancel')">Cancel</button><button :disabled="saving" class="rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0b5f59] disabled:opacity-50">{{ saving ? 'Saving...' : 'Save book' }}</button></div></form></template>

<style scoped>
.field-label { display: block; margin-bottom: .35rem; font-size: .7rem; font-weight: 700; color: #536461; }
.field-input { width: 100%; border: 1px solid #d7e1dd; border-radius: .65rem; background: #fff; padding: .6rem .8rem; outline: none; font-size: .875rem; }
.field-input:focus { border-color: #0f766e; box-shadow: 0 0 0 4px rgba(15, 118, 110, .1); }
</style>
