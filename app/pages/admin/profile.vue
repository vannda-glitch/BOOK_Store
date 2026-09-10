<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin' })
const user = ref<any>({}); onMounted(() => { const saved = localStorage.getItem('user'); if (saved) user.value = JSON.parse(saved) })
</script>
<template><section><AdminHeader title="Profile" description="Your administrator account." /><div class="max-w-xl rounded-2xl border border-[#d9e7e2] bg-white p-7 shadow-sm"><p class="text-sm text-gray-500">Name</p><p class="mt-1 text-lg font-semibold text-ink">{{ user.name || 'Administrator' }}</p><p class="mt-6 text-sm text-gray-500">Email</p><p class="mt-1 text-lg font-semibold text-ink">{{ user.email }}</p><p class="mt-6 text-sm text-gray-500">Role</p><span class="mt-2 inline-block rounded-full bg-[#eaf6f3] px-3 py-1 text-sm font-semibold text-primary">{{ user.role }}</span></div></section></template>
