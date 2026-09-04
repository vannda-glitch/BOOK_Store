<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <div>
      <label class="block text-sm font-medium text-gray-700">Shipping Address</label>
      <textarea
        v-model="form.shipping_address"
        rows="3"
        class="input mt-1"
        required
        placeholder="Enter your complete shipping address"
      ></textarea>
    </div>
    
    <div>
      <label class="block text-sm font-medium text-gray-700">Delivery Method</label>
      <select v-model="form.delivery_method" class="input mt-1">
        <option value="standard">Standard (3-5 days)</option>
        <option value="express">Express (1-2 days)</option>
        <option value="same-day">Same Day Delivery</option>
      </select>
    </div>
    
    <div>
      <label class="block text-sm font-medium text-gray-700">Payment Method</label>
      <div class="grid grid-cols-2 gap-4 mt-2">
        <button
          type="button"
          v-for="method in paymentMethods"
          :key="method.value"
          @click="form.payment_method = method.value"
          class="p-3 border-2 rounded-lg text-center transition-colors"
          :class="form.payment_method === method.value 
            ? 'border-primary-600 bg-primary-50' 
            : 'border-gray-200 hover:border-gray-300'"
        >
          <Icon :name="method.icon" size="24" class="mx-auto" />
          <span class="text-sm mt-1 block">{{ method.label }}</span>
        </button>
      </div>
    </div>
    
    <div>
      <label class="block text-sm font-medium text-gray-700">Notes (Optional)</label>
      <textarea
        v-model="form.notes"
        rows="2"
        class="input mt-1"
        placeholder="Any special instructions for delivery?"
      ></textarea>
    </div>
    
    <div v-if="form.payment_method === 'khqr'" class="bg-gray-50 p-4 rounded-lg">
      <h4 class="font-medium text-gray-900 mb-2">KHQR/Bakong Payment</h4>
      <p class="text-sm text-gray-600">
        You'll be redirected to complete the payment via KHQR/Bakong.
      </p>
    </div>
    
    <button
      type="submit"
      class="btn btn-primary w-full"
      :disabled="loading || !form.shipping_address || !form.payment_method"
    >
      <LoadingSpinner v-if="loading" size="sm" />
      <span v-else>Place Order</span>
    </button>
  </form>
</template>

<script setup lang="ts">
const emit = defineEmits<{
  (e: 'submit', data: any): void
}>()

const loading = ref(false)

const form = reactive({
  shipping_address: '',
  delivery_method: 'standard',
  payment_method: '',
  notes: ''
})

const paymentMethods = [
  { value: 'khqr', label: 'KHQR/Bakong', icon: 'mdi:qrcode' },
  { value: 'card', label: 'Credit/Debit Card', icon: 'mdi:credit-card' },
  { value: 'cash', label: 'Cash on Delivery', icon: 'mdi:cash' }
]

const handleSubmit = () => {
  if (form.shipping_address && form.payment_method) {
    emit('submit', form)
  }
}
</script>