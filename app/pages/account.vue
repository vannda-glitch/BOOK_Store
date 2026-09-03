<script setup lang="ts">
const user = computed(() => {
  if (import.meta.server) return null

  const savedUser = localStorage.getItem('user')
  return savedUser ? JSON.parse(savedUser) : null
})
</script>

<template>
  <section class="mx-auto max-w-4xl px-6 py-16">
    <h1 class="font-serif text-4xl font-bold text-gray-950">My account</h1>
    <div class="mt-8 rounded-2xl bg-white p-8 shadow-sm ring-1 ring-gray-200">
      <p class="text-sm text-gray-500">Welcome back</p>
      <h2 class="mt-3 text-2xl font-bold text-gray-900">{{ user?.name || 'Guest' }}</h2>
      <p class="mt-2 text-gray-600">{{ user?.email || 'Please log in to view your profile.' }}</p>
    </div>
  </section>
</template>
