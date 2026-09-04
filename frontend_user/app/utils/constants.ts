export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    CHANGE_PASSWORD: '/auth/change-password',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    VERIFY_EMAIL: '/auth/verify-email'
  },
  USERS: {
    PROFILE: '/users/me',
    UPDATE_PROFILE: '/users/me',
    ADDRESSES: '/users/me/addresses'
  },
  BOOKS: {
    LIST: '/books',
    FEATURED: '/books/featured',
    BESTSELLERS: '/books/bestsellers',
    NEW_ARRIVALS: '/books/new-arrivals',
    RELATED: (id: number) => `/books/${id}/related`
  },
  CART: {
    LIST: '/cart',
    ITEMS: '/cart/items',
    CLEAR: '/cart/clear'
  },
  ORDERS: {
    LIST: '/orders',
    CREATE: '/orders',
    DETAIL: (id: number) => `/orders/${id}`,
    STATUS: (id: number) => `/orders/${id}/status`
  },
  WISHLIST: {
    LIST: '/wishlist',
    ITEMS: (id: number) => `/wishlist/items/${id}`,
    MOVE_TO_CART: (id: number) => `/wishlist/items/${id}/move-to-cart`
  },
  REVIEWS: {
    CREATE: '/reviews',
    BY_BOOK: (id: number) => `/reviews/book/${id}`,
    APPROVE: (id: number) => `/reviews/${id}/approve`
  },
  ADMIN: {
    DASHBOARD: '/admin/dashboard',
    USERS: '/admin/users',
    CATEGORIES: '/admin/categories',
    AUTHORS: '/admin/authors',
    PUBLISHERS: '/admin/publishers'
  }
} as const

export const ORDER_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled'
} as const

export const PAYMENT_STATUS = {
  PENDING: 'pending',
  PAID: 'paid',
  FAILED: 'failed'
} as const

export const USER_ROLES = {
  USER: 'USER',
  ADMIN: 'ADMIN'
} as const

export const STORAGE_KEYS = {
  TOKEN: 'auth_token',
  USER: 'user_data',
  CART: 'cart_items'
} as const