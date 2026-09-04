<template>
  <nav class="flex items-center space-x-2 text-sm text-gray-600 mb-4" aria-label="Breadcrumb">
    <NuxtLink to="/" class="hover:text-primary-600 transition-colors">
      <Icon name="mdi:home" size="16" />
    </NuxtLink>
    <span class="text-gray-400">/</span>
    <template v-for="(item, index) in items" :key="index">
      <template v-if="item.link && index < items.length - 1">
        <NuxtLink :to="item.link" class="hover:text-primary-600 transition-colors">
          {{ item.label }}
        </NuxtLink>
        <span class="text-gray-400">/</span>
      </template>
      <template v-else-if="index < items.length - 1">
        <span class="text-gray-600">{{ item.label }}</span>
        <span class="text-gray-400">/</span>
      </template>
      <template v-else>
        <span class="text-gray-900 font-medium">{{ item.label }}</span>
      </template>
    </template>
  </nav>
</template>

<script setup lang="ts">
interface BreadcrumbItem {
  label: string
  link?: string
}

defineProps<{
  items: BreadcrumbItem[]
}>()
</script>