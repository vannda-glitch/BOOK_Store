import { defineStore } from 'pinia'
import type { Order, CreateOrderData } from '~/types'

export const useOrdersStore = defineStore('orders', {
  state: () => ({
    orders: [] as Order[],
    currentOrder: null as Order | null,
    loading: false
  }),

  actions: {
    async fetchOrders() {
      this.loading = true
      try {
        const orders = await $fetch<Order[]>('/orders', {
          baseURL: useRuntimeConfig().public.apiBase,
          headers: {
            Authorization: `Bearer ${useAuthStore().token}`
          }
        })
        this.orders = orders
        return orders
      } finally {
        this.loading = false
      }
    },

    async fetchOrder(orderId: number) {
      this.loading = true
      try {
        const order = await $fetch<Order>(`/orders/${orderId}`, {
          baseURL: useRuntimeConfig().public.apiBase,
          headers: {
            Authorization: `Bearer ${useAuthStore().token}`
          }
        })
        this.currentOrder = order
        return order
      } finally {
        this.loading = false
      }
    },

    async createOrder(orderData: CreateOrderData) {
      this.loading = true
      try {
        const order = await $fetch<Order>('/orders', {
          method: 'POST',
          body: orderData,
          baseURL: useRuntimeConfig().public.apiBase,
          headers: {
            Authorization: `Bearer ${useAuthStore().token}`
          }
        })
        
        // Add order to list if it exists
        if (this.orders.length > 0) {
          this.orders.unshift(order)
        }
        
        // Clear cart after successful order
        await useCartStore().clearCart()
        
        return order
      } finally {
        this.loading = false
      }
    },

    async cancelOrder(orderId: number) {
      await $fetch(`/orders/${orderId}`, {
        method: 'DELETE',
        baseURL: useRuntimeConfig().public.apiBase,
        headers: {
          Authorization: `Bearer ${useAuthStore().token}`
        }
      })
      
      // Update order in list
      const index = this.orders.findIndex(o => o.id === orderId)
      if (index !== -1) {
        this.orders[index].status = 'cancelled'
      }
      
      if (this.currentOrder?.id === orderId) {
        this.currentOrder!.status = 'cancelled'
      }
    }
  }
})