<template>
  <div class="flex items-center gap-1">
    <div class="flex text-yellow-400">
      <Icon
        v-for="i in 5"
        :key="i"
        :name="i <= filledStars ? 'mdi:star' : i <= Math.round(rating) ? 'mdi:star-half-full' : 'mdi:star-outline'"
        size="16"
      />
    </div>
    <span v-if="showCount" class="text-sm text-gray-500 ml-1">
      ({{ count }} {{ count === 1 ? 'review' : 'reviews' }})
    </span>
    <span v-if="showRating && rating > 0" class="text-sm font-medium text-gray-700 ml-1">
      {{ rating.toFixed(1) }}
    </span>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  rating: number
  count?: number
  showCount?: boolean
  showRating?: boolean
}>(), {
  count: 0,
  showCount: true,
  showRating: false
})

const filledStars = computed(() => Math.floor(rating))
</script>