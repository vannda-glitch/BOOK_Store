import { useBooksStore } from '~/stores/books'
import type { BookSearchParams } from '~/types'

export const useBooks = () => {
  const booksStore = useBooksStore()

  const fetchBooks = async (params?: BookSearchParams) => {
    await booksStore.fetchBooks(params)
  }

  const fetchBook = async (slug: string) => {
    await booksStore.fetchBook(slug)
  }

  const fetchFeaturedBooks = async () => {
    await booksStore.fetchFeaturedBooks()
  }

  const fetchBestsellers = async () => {
    await booksStore.fetchBestsellers()
  }

  const fetchNewArrivals = async () => {
    await booksStore.fetchNewArrivals()
  }

  const fetchCategories = async () => {
    await booksStore.fetchCategories()
  }

  const fetchRelatedBooks = async (bookId: number) => {
    await booksStore.fetchRelatedBooks(bookId)
  }

  const searchBooks = async (query: string) => {
    await booksStore.searchBooks(query)
  }

  return {
    books: computed(() => booksStore.books),
    currentBook: computed(() => booksStore.currentBook),
    featuredBooks: computed(() => booksStore.featuredBooks),
    bestsellers: computed(() => booksStore.bestsellers),
    newArrivals: computed(() => booksStore.newArrivals),
    categories: computed(() => booksStore.categories),
    relatedBooks: computed(() => booksStore.relatedBooks),
    loading: computed(() => booksStore.loading),
    loadingFeatured: computed(() => booksStore.loadingFeatured),
    loadingBestsellers: computed(() => booksStore.loadingBestsellers),
    loadingNewArrivals: computed(() => booksStore.loadingNewArrivals),
    loadingCategories: computed(() => booksStore.loadingCategories),
    pagination: computed(() => booksStore.pagination),
    fetchBooks,
    fetchBook,
    fetchFeaturedBooks,
    fetchBestsellers,
    fetchNewArrivals,
    fetchCategories,
    fetchRelatedBooks,
    searchBooks
  }
}