<template>
  <div class="flex justify-center items-center" :class="containerClass">
    <div
      class="animate-spin rounded-full border-t-2 border-b-2 border-primary-600"
      :class="sizeClasses[size]"
    ></div>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  size?: 'sm' | 'md' | 'lg'
  fullScreen?: boolean
}>(), {
  size: 'md',
  fullScreen: false
})

const sizeClasses = {
  sm: 'h-6 w-6 border-2',
  md: 'h-10 w-10 border-3',
  lg: 'h-16 w-16 border-4'
}

const containerClass = computed(() => props.fullScreen ? 'min-h-screen' : '')
</script>