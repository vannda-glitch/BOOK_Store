<script setup lang="ts">
defineProps<{ open: boolean; title?: string; message?: string }>()
const emit = defineEmits<{ confirm: []; cancel: [] }>()
</script>

<template><div v-if="open" class="fixed inset-0 z-[60] flex items-center justify-center bg-ink/40 p-4"><div class="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"><h2 class="font-serif text-2xl font-bold text-ink">{{ title || 'Confirm action' }}</h2><p class="mt-3 text-sm leading-6 text-gray-500">{{ message || 'This action cannot be undone.' }}</p><div class="mt-6 flex justify-end gap-3"><button class="rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-600" @click="emit('cancel')">Cancel</button><button class="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white" @click="emit('confirm')">Confirm</button></div></div></div></template>
