<template>
  <div class="space-y-4">
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <button
        v-for="method in paymentMethods"
        :key="method.value"
        type="button"
        @click="selectMethod(method.value)"
        class="p-4 border-2 rounded-lg text-center transition-all"
        :class="selected === method.value 
          ? 'border-primary-600 bg-primary-50 shadow-sm' 
          : 'border-gray-200 hover:border-gray-300'"
      >
        <Icon :name="method.icon" size="32" :class="selected === method.value ? 'text-primary-600' : 'text-gray-400'" />
        <p class="mt-2 text-sm font-medium" :class="selected === method.value ? 'text-primary-600' : 'text-gray-700'">
          {{ method.label }}
        </p>
        <p class="text-xs text-gray-500 mt-1">{{ method.description }}</p>
      </button>
    </div>
    
    <!-- KHQR Details -->
    <div v-if="selected === 'khqr'" class="bg-blue-50 border border-blue-200 rounded-lg p-4">
      <div class="flex items-start gap-3">
        <Icon name="mdi:qrcode" size="24" class="text-blue-600 flex-shrink-0 mt-1" />
        <div>
          <h4 class="font-medium text-blue-900">KHQR/Bakong Payment</h4>
          <p class="text-sm text-blue-700 mt-1">
            You will be redirected to complete the payment via KHQR/Bakong mobile app.
          </p>
        </div>
      </div>
    </div>
    
    <!-- Card Details -->
    <div v-if="selected === 'card'" class="bg-gray-50 rounded-lg p-4 space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700">Card Number</label>
        <input v-model="cardForm.number" type="text" class="input mt-1" placeholder="1234 5678 9012 3456" />
      </div>
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">Expiry Date</label>
          <input v-model="cardForm.expiry" type="text" class="input mt-1" placeholder="MM/YY" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">CVV</label>
          <input v-model="cardForm.cvv" type="text" class="input mt-1" placeholder="123" />
        </div>
      </div>
    </div>
    
    <!-- Cash on Delivery -->
    <div v-if="selected === 'cash'" class="bg-green-50 border border-green-200 rounded-lg p-4">
      <div class="flex items-start gap-3">
        <Icon name="mdi:cash" size="24" class="text-green-600 flex-shrink-0 mt-1" />
        <div>
          <h4 class="font-medium text-green-900">Cash on Delivery</h4>
          <p class="text-sm text-green-700 mt-1">
            Pay when you receive your order. Please have exact change ready.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const selected = ref('')

const paymentMethods = [
  { 
    value: 'khqr', 
    label: 'KHQR/Bakong', 
    icon: 'mdi:qrcode',
    description: 'Pay with KHQR mobile app'
  },
  { 
    value: 'card', 
    label: 'Credit/Debit Card', 
    icon: 'mdi:credit-card',
    description: 'Visa, Mastercard, etc.'
  },
  { 
    value: 'cash', 
    label: 'Cash on Delivery', 
    icon: 'mdi:cash',
    description: 'Pay when you receive'
  }
]

const cardForm = reactive({
  number: '',
  expiry: '',
  cvv: ''
})

const selectMethod = (value: string) => {
  selected.value = value
  emit('update', { method: value, cardDetails: cardForm })
}

const emit = defineEmits<{
  (e: 'update', data: any): void
}>()

// Watch for card form changes
watch(cardForm, () => {
  if (selected.value === 'card') {
    emit('update', { method: selected.value, cardDetails: cardForm })
  }
}, { deep: true })
</script>