
<template>
  <div class="min-h-screen bg-white text-slate-800 font-sans flex flex-col">
    <div class="flex-1 max-w-[1600px] w-full mx-auto flex flex-col md:flex-row">
      <aside class=" md:w-64 bg-blue-500 p-6 space-y-8">
        <nav class="text-2xl font-semibold space-x-1 ">
          <span>home</span>
          <span class="text-yellow-400">&gt;</span>
          <span class="text-slate-800">books</span>
        </nav>
        <div class="space-y-2">
          <h2 class="text-xs font-black uppercase tracking-wider text-slate-900">Sort</h2>
          <div class="relative">
            <select 
             v-model="selectedSort"
              class="w-full bg-white text-slate-800 text-sm font-semibold rounded-lg px-4 py-3 appearance-none shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer pr-8"
            >
              <option value="newest">What's new</option>
              <option value="popular">Most Popular</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
            <div class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
              ▼
            </div>
          </div>
        </div>
        <div class="space-y-3">
          <h2 class="text-xs font-black uppercase tracking-wider text-slate-900">Filter</h2>
          <div class="relative">
            <select 
              v-model="selectedGenre"
              class="w-full bg-white text-slate-700 text-sm font-medium rounded-lg px-4 py-3 appearance-none shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer pr-8"
            >
              <option value="all">Book Genre</option>
              <option value="Fiction">Fiction</option>
              <option value="Non-Fiction">Non-Fiction</option>
              <option value="Sci-Fi">Sci-Fi</option>
              <option value="Design">Design</option>
            </select>
            <div class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">▼</div>
          </div>
          <div class="relative">
            <select 
              v-model="selectedFormat"
              class="w-full bg-white text-slate-700 text-sm font-medium rounded-lg px-4 py-3 appearance-none shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer pr-8"
            >
              <option value="all">Format</option>
              <option value="Hardcover">Hardcover</option>
              <option value="Paperback">Paperback</option>
              <option value="E-Book">E-Book</option>
            </select>
            <div class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">▼</div>
          </div>
          <div class="relative">
            <select class="w-full bg-white text-slate-700 text-sm font-medium rounded-lg px-4 py-3 appearance-none shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer pr-8">
              <option value="all">Language</option>
              <option value="en">English</option>
              <option value="fr">Khmer</option>
            </select>
            <div class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">▼</div>
          </div>
          <div class="relative">
            <select class="w-full bg-white text-slate-700 text-sm font-medium rounded-lg px-4 py-3 appearance-none shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer pr-8">
              <option value="all">Author</option>
              <option value="a1">Agatha Christie</option>
              <option value="a1">Mark Twain</option>
              <option value="a1">Leo Tolstoy</option>
              <option value="a1">Jane Austen</option>
            </select>
            <div class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">▼</div>
          </div>
          <div class="relative">
            <select class="w-full bg-white text-slate-700 text-sm font-medium rounded-lg px-4 py-3 appearance-none shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer pr-8">
              <option value="all">Price range</option>
              <option value="under20">Under $150</option>
              <option value="20-50">$45 - $150</option>
            </select>
            <div class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">▼</div>
          </div>
        </div>
      </aside>
      <main class="flex-1 flex flex-col bg-white">
        <div class="p-8 pb-4 border-b border-slate-100">
          <input 
            v-model="searchQuery"
            type="text" 
            placeholder="Search books, authors, genres..." 
            class="w-full text-4xl md:text-5xl font-bold placeholder-slate-300 border-none outline-none focus:ring-0 text-slate-800 bg-transparent"
          />
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-slate-100 border-b border-slate-100">
          <ProductCard
            v-for="e in filteredBooks" 
            :key="e.id"
            :product="e"
            @add-to-cart="addToCart"
          />
        </div>
        <div v-if="filteredBooks.length === 0" class="p-16 text-center text-slate-400">
          <p class="text-xl font-bold">No books found matching your filter criteria.</p>
        </div>
      </main>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import ProductCard from '~/components/ProductCard.vue'
import userApi from '~/src/api/userapi.json'
import Product from './admin/product.vue'

type Product = (typeof userApi.products)[number]

const cartCount = ref(2)
const searchQuery = ref('')
const selectedSort = ref('newest')
const selectedGenre = ref('all')
const selectedFormat = ref('all')
const books = ref<Product[]>(userApi.products)
// Computed property to filter and search books dynamically
const filteredBooks = computed(() => {
  return books.value.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                          book.author.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesGenre = selectedGenre.value === 'all' || book.genre === selectedGenre.value
    const matchesFormat = selectedFormat.value === 'all' || book.format === selectedFormat.value

    return matchesSearch && matchesGenre && matchesFormat
  })
}) 
const addToCart = (book: Product) => {
cartCount.value++
}
</script>
