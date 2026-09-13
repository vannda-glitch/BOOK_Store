<script setup lang="ts">
const props = defineProps<{ stock?: number | string }>();
const quantity = computed(() => Math.max(0, Number(props.stock) || 0));
const label = computed(() =>
  quantity.value > 5
    ? "In Stock"
    : quantity.value > 0
      ? `Only ${quantity.value} left`
      : "Out of Stock",
);
const tone = computed(() =>
  quantity.value > 5 ? "success" : quantity.value > 0 ? "warning" : "danger",
);
</script>

<template>
  <span
    class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold"
    :class="{
      'bg-emerald-50 text-emerald-700': tone === 'success',
      'bg-amber-50 text-amber-700': tone === 'warning',
      'bg-red-50 text-red-700': tone === 'danger',
    }"
  >
    <UiIcon
      :name="tone === 'success' ? 'check' : tone === 'warning' ? 'alert' : 'x'"
      class="h-3.5 w-3.5"
    />
    {{ label }}
  </span>
</template>
