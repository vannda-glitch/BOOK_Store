<script setup lang="ts">
defineProps<{ title: string; description?: string; actionLabel?: string; actionTo?: string }>()
const emit = defineEmits<{ action: [] }>()
</script>

<template>
  <div class="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
    <div><p class="text-[10px] font-bold uppercase tracking-[0.22em] text-primary">Admin workspace</p><h1 class="mt-2 font-serif text-3xl font-bold tracking-tight text-ink sm:text-4xl">{{ title }}</h1><p v-if="description" class="mt-2 text-sm text-gray-500">{{ description }}</p></div>
    <NuxtLink v-if="actionLabel && actionTo" :to="actionTo" class="inline-flex items-center justify-center rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition hover:-translate-y-0.5 hover:bg-[#0b5f59]">+ {{ actionLabel }}</NuxtLink>
    <button v-else-if="actionLabel" type="button" class="inline-flex items-center justify-center rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition hover:-translate-y-0.5 hover:bg-[#0b5f59]" @click="emit('action')">+ {{ actionLabel }}</button>
  </div>
</template>
