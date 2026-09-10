<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin' })
const saved = ref(false); const notifications = ref(true)
const save = () => { saved.value = true; setTimeout(() => saved.value = false, 1800) }
</script>
<template><section><AdminHeader title="Settings" description="Manage your admin workspace preferences." /><div class="max-w-xl rounded-2xl border border-[#d9e7e2] bg-white p-7 shadow-sm"><label class="flex items-center justify-between gap-5"><span><strong class="block text-sm text-ink">Order notifications</strong><small class="mt-1 block text-sm text-gray-500">Show updates for newly placed orders.</small></span><input v-model="notifications" type="checkbox" class="h-5 w-5 accent-[#0f766e]" /></label><button class="mt-8 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white" @click="save">{{ saved ? 'Saved' : 'Save settings' }}</button></div></section></template>
