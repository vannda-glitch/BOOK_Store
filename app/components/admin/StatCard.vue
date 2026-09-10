<script setup lang="ts">
defineProps<{ label: string; value: string | number; tone?: 'teal' | 'blue' | 'amber' | 'rose' }>()
</script>

<template><article class="rounded-2xl border border-[#d9e7e2] bg-white p-5 shadow-sm"><div class="flex items-start justify-between gap-4"><div><p class="text-sm text-gray-500">{{ label }}</p><p class="mt-3 text-3xl font-bold text-ink">{{ value }}</p></div><span class="h-3 w-3 rounded-full" :class="{ 'bg-primary': tone === 'teal', 'bg-blue-500': tone === 'blue', 'bg-amber-400': tone === 'amber', 'bg-rose-400': tone === 'rose' }" /></div></article></template>
