<script setup lang="ts">

defineProps<{
  title: string
  value: string | number
  icon: string
  color: 'blue' | 'green' | 'purple' | 'orange'
}>()

const colorClasses = {
  blue: 'bg-blue-100 text-blue-600',
  green: 'bg-green-100 text-green-600',
  purple: 'bg-purple-100 text-purple-600',
  orange: 'bg-orange-100 text-orange-600'
}

</script>


<template>

  <div class="rounded-xl border border-gray-200 bg-white p-6">
    <div class="flex items-center justify-between">
      <div>
        <p class="text-sm text-gray-500">{{ title }}</p>
        <p class="mt-2 text-3xl font-bold text-gray-950">{{ value }}</p>
      </div>
      <div :class="['flex h-12 w-12 items-center justify-center rounded-full', colorClasses[color]]">
        <span class="text-2xl">{{ icon }}</span>
      </div>
    </div>
  </div>

</template>
