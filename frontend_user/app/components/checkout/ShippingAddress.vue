<template>
  <div class="space-y-4">
    <div>
      <label class="block text-sm font-medium text-gray-700">Address Line 1</label>
      <input v-model="form.address_line1" type="text" class="input mt-1" required />
    </div>
    
    <div>
      <label class="block text-sm font-medium text-gray-700">Address Line 2 (Optional)</label>
      <input v-model="form.address_line2" type="text" class="input mt-1" />
    </div>
    
    <div class="grid grid-cols-2 gap-4">
      <div>
        <label class="block text-sm font-medium text-gray-700">City</label>
        <input v-model="form.city" type="text" class="input mt-1" required />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700">Province</label>
        <input v-model="form.province" type="text" class="input mt-1" required />
      </div>
    </div>
    
    <div class="grid grid-cols-2 gap-4">
      <div>
        <label class="block text-sm font-medium text-gray-700">Postal Code</label>
        <input v-model="form.postal_code" type="text" class="input mt-1" />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700">Phone</label>
        <input v-model="form.phone" type="tel" class="input mt-1" required />
      </div>
    </div>
    
    <div>
      <label class="flex items-center gap-2">
        <input v-model="form.is_default" type="checkbox" class="h-4 w-4 text-primary-600" />
        <span class="text-sm text-gray-700">Set as default address</span>
      </label>
    </div>
  </div>
</template>

<script setup lang="ts">
const form = reactive({
  address_line1: '',
  address_line2: '',
  city: '',
  province: '',
  postal_code: '',
  phone: '',
  is_default: false
})

// Emit form data when it changes
watch(form, () => {
  emit('update', form)
}, { deep: true })

const emit = defineEmits<{
  (e: 'update', data: any): void
}>()
</script>