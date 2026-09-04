import { defineStore } from 'pinia'
import type { Book, Category, BookSearchParams, BookSearchResponse } from '~/types'

export const useBooksStore = defineStore('books', {
  state: () => ({
    books: [] as Book[],
    currentBook: null as Book | null,
    featuredBooks: [] as Book[],
    bestsellers: [] as Book[],
    newArrivals: [] as Book[],
    categories: [] as Category[],
    relatedBooks: [] as Book[],
    loading: false,
    loadingFeatured: false,
    loadingBestsellers: false,
    loadingNewArrivals: false,
    loadingCategories: false,
    pagination: {
      total: 0,
      page: 1,
      per_page: 20,
      total_pages: 0
    }
  }),

  actions: {
    async fetchBooks(params?: BookSearchParams) {
      this.loading = true
      try {
        const query = new URLSearchParams()
        if (params) {
          Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
              query.append(key, String(value))
            }
          })
        }
        
        const data = await $fetch<BookSearchResponse>(`/books/?${query.toString()}`, {
          baseURL: useRuntimeConfig().public.apiBase
        })
        
        this.books = data.items
        this.pagination = {
          total: data.total,
          page: data.page,
          per_page: data.per_page,
          total_pages: data.total_pages
        }
        return data
      } finally {
        this.loading = false
      }
    },

    async fetchBook(slug: string) {
      this.loading = true
      try {
        const book = await $fetch<Book>(`/books/${slug}`, {
          baseURL: useRuntimeConfig().public.apiBase
        })
        this.currentBook = book
        return book
      } finally {
        this.loading = false
      }
    },

    async fetchFeaturedBooks() {
      this.loadingFeatured = true
      try {
        const books = await $fetch<Book[]>('/books/featured', {
          baseURL: useRuntimeConfig().public.apiBase
        })
        this.featuredBooks = books
        return books
      } finally {
        this.loadingFeatured = false
      }
    },

    async fetchBestsellers() {
      this.loadingBestsellers = true
      try {
        const books = await $fetch<Book[]>('/books/bestsellers', {
          baseURL: useRuntimeConfig().public.apiBase
        })
        this.bestsellers = books
        return books
      } finally {
        this.loadingBestsellers = false
      }
    },

    async fetchNewArrivals() {
      this.loadingNewArrivals = true
      try {
        const books = await $fetch<Book[]>('/books/new-arrivals', {
          baseURL: useRuntimeConfig().public.apiBase
        })
        this.newArrivals = books
        return books
      } finally {
        this.loadingNewArrivals = false
      }
    },

    async fetchCategories() {
      this.loadingCategories = true
      try {
        const categories = await $fetch<Category[]>('/categories', {
          baseURL: useRuntimeConfig().public.apiBase
        })
        this.categories = categories
        return categories
      } finally {
        this.loadingCategories = false
      }
    },

    async fetchRelatedBooks(bookId: number) {
      try {
        const books = await $fetch<Book[]>(`/books/${bookId}/related`, {
          baseURL: useRuntimeConfig().public.apiBase
        })
        this.relatedBooks = books
        return books
      } catch {
        this.relatedBooks = []
        return []
      }
    },

    async searchBooks(query: string) {
      return this.fetchBooks({ query })
    }
  }
})