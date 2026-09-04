export interface Author {
  id: number
  name: string
  biography: string | null
  nationality: string | null
}

export interface Publisher {
  id: number
  name: string
  description: string | null
}

export interface Category {
  id: number
  name: string
  slug: string
  description: string | null
}

export interface Review {
  id: number
  user_id: number
  rating: number
  comment: string | null
  created_at: string
  user: {
    username: string
    full_name: string | null
  }
}

export interface Book {
  id: number
  title: string
  slug: string
  description: string | null
  isbn: string | null
  price: number
  discount_price: number | null
  stock_quantity: number
  pages: number | null
  language: string | null
  publication_date: string | null
  cover_image: string | null
  is_featured: boolean
  is_bestseller: boolean
  is_new_arrival: boolean
  author: Author | null
  publisher: Publisher | null
  category: Category | null
  reviews: Review[]
  average_rating: number
  created_at: string
}

export interface BookSearchParams {
  query?: string
  category_id?: number
  author_id?: number
  min_price?: number
  max_price?: number
  sort_by?: string
  page?: number
  per_page?: number
}

export interface BookSearchResponse {
  items: Book[]
  total: number
  page: number
  per_page: number
  total_pages: number
}