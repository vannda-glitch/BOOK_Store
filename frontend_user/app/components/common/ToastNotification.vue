<template>
  <div
    v-if="visible"
    class="fixed top-4 right-4 z-50 max-w-sm w-full"
    :class="animationClass"
  >
    <div
      class="rounded-lg shadow-lg p-4"
      :class="{
        'bg-green-50 border border-green-200': type === 'success',
        'bg-red-50 border border-red-200': type === 'error',
        'bg-yellow-50 border border-yellow-200': type === 'warning',
        'bg-blue-50 border border-blue-200': type === 'info'
      }"
    >
      <div class="flex items-start">
        <div class="flex-shrink-0">
          <Icon
            :name="iconMap[type]"
            size="20"
            :class="{
              'text-green-400': type === 'success',
              'text-red-400': type === 'error',
              'text-yellow-400': type === 'warning',
              'text-blue-400': type === 'info'
            }"
          />
        </div>
        <div class="ml-3 flex-1">
          <p class="text-sm font-medium" :class="textColorClass">
            {{ message }}
          </p>
        </div>
        <button
          @click="close"
          class="ml-4 flex-shrink-0 text-gray-400 hover:text-gray-600"
        >
          <Icon name="mdi:close" size="20" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  message: string
  type?: 'success' | 'error' | 'warning' | 'info'
  duration?: number
}>()

const visible = ref(true)
const isClosing = ref(false)

const iconMap = {
  success: 'mdi:check-circle',
  error: 'mdi:alert-circle',
  warning: 'mdi:alert',
  info: 'mdi:information'
}

const textColorClass = computed(() => {
  const classes = {
    success: 'text-green-800',
    error: 'text-red-800',
    warning: 'text-yellow-800',
    info: 'text-blue-800'
  }
  return classes[props.type || 'info']
})

const animationClass = computed(() => {
  if (isClosing.value) {
    return 'animate-fade-out transform translate-x-full'
  }
  return 'animate-slide-in transform translate-x-0'
})

const close = () => {
  isClosing.value = true
  setTimeout(() => {
    visible.value = false
  }, 300)
}

// Auto close after duration
if (props.duration !== 0) {
  setTimeout(() => {
    close()
  }, props.duration || 5000)
}
</script>

<style scoped>
@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes fadeOut {
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(100%);
    opacity: 0;
  }
}

.animate-slide-in {
  animation: slideIn 0.3s ease-out;
}

.animate-fade-out {
  animation: fadeOut 0.3s ease-in forwards;
}
</style>