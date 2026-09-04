<template>
  <div class="flex items-center gap-4 py-4 border-b border-gray-100">
    <img
      :src="item.book.cover_image || '/images/default-book.jpg'"
      :alt="item.book.title"
      class="w-20 h-28 object-cover rounded-lg"
    />
    
    <div class="flex-1">
      <NuxtLink :to="`/books/${item.book.slug}`" class="font-semibold text-gray-800 hover:text-primary-600">
        {{ item.book.title }}
      </NuxtLink>
      <p class="text-sm text-gray-600">by {{ item.book.author?.name }}</p>
      
      <div class="flex items-center gap-4 mt-2">
        <div class="flex items-center border border-gray-300 rounded-lg">
          <button
            @click="decrementQuantity"
            class="px-3 py-1 hover:bg-gray-100 transition-colors"
            :disabled="item.quantity <= 1"
          >
            <Icon name="mdi:minus" size="16" />
          </button>
          <span class="px-4 py-1 text-center min-w-[40px]">{{ item.quantity }}</span>
          <button
            @click="incrementQuantity"
            class="px-3 py-1 hover:bg-gray-100 transition-colors"
            :disabled="item.quantity >= item.book.stock_quantity"
          >
            <Icon name="mdi:plus" size="16" />
          </button>
        </div>
        
        <button
          @click="removeItem"
          class="text-red-500 hover:text-red-700 text-sm font-medium"
        >
          Remove
        </button>
      </div>
    </div>
    
    <div class="text-right">
      <p class="text-lg font-bold text-primary-600">
        ${{ (item.book.discount_price || item.book.price * item.quantity).toFixed(2) }}
      </p>
      <p v-if="item.book.discount_price" class="text-sm text-gray-400 line-through">
        ${{ (item.book.price * item.quantity).toFixed(2) }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CartItem } from '~/types'

const props = defineProps<{
  item: CartItem
}>()

const emit = defineEmits<{
  (e: 'update', itemId: number, quantity: number): void
  (e: 'remove', itemId: number): void
}>()

const decrementQuantity = () => {
  if (props.item.quantity > 1) {
    emit('update', props.item.id, props.item.quantity - 1)
  }
}

const incrementQuantity = () => {
  if (props.item.quantity < props.item.book.stock_quantity) {
    emit('update', props.item.id, props.item.quantity + 1)
  }
}

const removeItem = () => {
  emit('remove', props.item.id)
}
</script>