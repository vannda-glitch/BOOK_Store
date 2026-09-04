import { Book } from './book'

export interface OrderItem {
  id: number
  book: Book
  quantity: number
  unit_price: number
  total_price: number
}

export interface Order {
  id: number
  order_number: string
  subtotal: number
  discount_amount: number
  shipping_fee: number
  total_amount: number
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  payment_status: 'pending' | 'paid' | 'failed'
  shipping_address: string
  payment_method: string | null
  notes: string | null
  items: OrderItem[]
  created_at: string
}

export interface CreateOrderData {
  shipping_address: string
  payment_method: string
  notes?: string
}

export interface OrderStatusUpdate {
  status: string
}