import { Book } from './book'

export interface CartItem {
  id: number
  book: Book
  quantity: number
  created_at: string
}

export interface Cart {
  items: CartItem[]
  subtotal: number
  total_items: number
}

export interface AddToCartData {
  book_id: number
  quantity?: number
}

export interface UpdateCartItemData {
  quantity: number
}