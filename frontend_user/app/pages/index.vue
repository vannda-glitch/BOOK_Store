<template>
  <div class="space-y-16 pb-16">
    <!-- Hero Banner -->
    <section class="relative bg-gradient-to-br from-primary-700 via-primary-800 to-slate-900 rounded-3xl overflow-hidden px-8 py-16 md:px-16 md:py-20 shadow-xl">
      <!-- Decorative background elements -->
      <div class="absolute inset-0 bg-[radial-gradient(#1e40af_1px,transparent_1px)] [background-size:16px_16px] opacity-15 pointer-events-none"></div>
      
      <div class="relative z-10 max-w-2xl">
        <span class="inline-block bg-primary-600/40 border border-primary-400/30 text-primary-200 text-xs font-semibold px-3 py-1 rounded-full mb-4 backdrop-blur-sm">
          Welcome to Bookstore
        </span>
        <h1 class="text-4xl md:text-6xl font-extrabold text-white tracking-tight mb-6 leading-tight">
          Discover Your Next <span class="text-primary-300">Great Read</span>
        </h1>
        <p class="text-lg md:text-xl text-primary-100/90 mb-8 font-normal leading-relaxed">
          Explore thousands of books from your favorite authors. Find your next adventure today.
        </p>
        <div class="flex flex-wrap items-center gap-4">
          <NuxtLink 
            to="/books" 
            class="bg-white text-primary-900 px-8 py-3.5 rounded-xl font-semibold hover:bg-primary-50 transition-all duration-200 shadow-md hover:shadow-lg active:scale-95"
          >
            Browse Books
          </NuxtLink>
          <NuxtLink 
            to="/books/category" 
            class="bg-primary-900/40 border border-primary-400/30 text-white px-6 py-3.5 rounded-xl font-medium hover:bg-primary-800/60 transition-all duration-200 backdrop-blur-sm"
          >
            All Categories
          </NuxtLink>
        </div>
      </div>
      
      <div class="absolute right-[-2rem] bottom-[-3rem] opacity-10 pointer-events-none hidden lg:block">
        <Icon name="mdi:bookshelf" size="400" class="text-white" />
      </div>
    </section>

    <!-- Categories Section -->
    <section>
      <div class="flex items-end justify-between mb-8">
        <div>
          <span class="text-primary-600 font-semibold text-xs uppercase tracking-wider">Explore by genre</span>
          <h2 class="text-2xl md:text-3xl font-bold text-slate-900 mt-1">Categories</h2>
        </div>
        <NuxtLink to="/books/category" class="text-primary-600 hover:text-primary-700 font-semibold text-sm flex items-center gap-1 group">
          View All <span class="group-hover:translate-x-1 transition-transform">&rarr;</span>
        </NuxtLink>
      </div>

      <!-- Categories Grid -->
      <div v-if="!loadingCategories" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <div
          v-for="category in categories?.slice(0, 6)"
          :key="category.id"
          class="group bg-white border border-slate-100 rounded-2xl p-5 text-center hover:border-primary-200 hover:shadow-xl hover:shadow-primary-900/5 cursor-pointer transition-all duration-300 hover:-translate-y-1"
          @click="navigateTo(`/books/category/${category.slug}`)"
        >
          <div class="w-12 h-12 mx-auto mb-3 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center group-hover:bg-primary-600 group-hover:text-white transition-colors duration-300">
            <Icon :name="category.icon || 'mdi:book-open-variant'" size="24" />
          </div>
          <h3 class="font-semibold text-slate-800 text-sm truncate group-hover:text-primary-600 transition-colors">{{ category.name }}</h3>
        </div>
      </div>

      <!-- Loading State -->
      <div v-else class="flex justify-center py-12">
        <LoadingSpinner size="md" />
      </div>
    </section>

    <!-- Featured Books -->
    <section class="bg-slate-50/50 border border-slate-100 rounded-3xl p-6 md:p-8">
      <div class="flex items-end justify-between mb-6">
        <div>
          <span class="text-primary-600 font-semibold text-xs uppercase tracking-wider">Handpicked for you</span>
          <h2 class="text-2xl md:text-3xl font-bold text-slate-900 mt-1">Featured Books</h2>
        </div>
        <NuxtLink to="/books" class="text-primary-600 hover:text-primary-700 font-semibold text-sm flex items-center gap-1 group">
          View All <span class="group-hover:translate-x-1 transition-transform">&rarr;</span>
        </NuxtLink>
      </div>
      <BookList :books="featuredBooks" :loading="loadingFeatured" />
    </section>

    <!-- New Arrivals -->
    <section>
      <div class="flex items-end justify-between mb-6">
        <div>
          <span class="text-primary-600 font-semibold text-xs uppercase tracking-wider">Fresh off the press</span>
          <h2 class="text-2xl md:text-3xl font-bold text-slate-900 mt-1">New Arrivals</h2>
        </div>
        <NuxtLink to="/books" class="text-primary-600 hover:text-primary-700 font-semibold text-sm flex items-center gap-1 group">
          View All <span class="group-hover:translate-x-1 transition-transform">&rarr;</span>
        </NuxtLink>
      </div>
      <BookList :books="newArrivals" :loading="loadingNewArrivals" />
    </section>

    <!-- Bestsellers -->
    <section class="bg-slate-50/50 border border-slate-100 rounded-3xl p-6 md:p-8">
      <div class="flex items-end justify-between mb-6">
        <div>
          <span class="text-primary-600 font-semibold text-xs uppercase tracking-wider">Most popular</span>
          <h2 class="text-2xl md:text-3xl font-bold text-slate-900 mt-1">Bestsellers</h2>
        </div>
        <NuxtLink to="/books" class="text-primary-600 hover:text-primary-700 font-semibold text-sm flex items-center gap-1 group">
          View All <span class="group-hover:translate-x-1 transition-transform">&rarr;</span>
        </NuxtLink>
      </div>
      <BookList :books="bestsellers" :loading="loadingBestsellers" />
    </section>
  </div>
</template>

<script setup lang="ts">
import { useBooks } from '~/composables/useBooks'
import BookList from '~/components/books/BookList.vue'
import LoadingSpinner from '~/components/common/LoadingSpinner.vue'

const { 
  categories, 
  featuredBooks, 
  newArrivals, 
  bestsellers,
  loadingCategories,
  loadingFeatured,
  loadingNewArrivals,
  loadingBestsellers,
  fetchCategories,
  fetchFeaturedBooks,
  fetchNewArrivals,
  fetchBestsellers
} = useBooks()

// Safely fetch dashboard data on mount with error handling
try {
  await Promise.all([
    fetchCategories(),
    fetchFeaturedBooks(),
    fetchNewArrivals(),
    fetchBestsellers()
  ])
} catch (error) {
  console.error('Failed to load initial page data:', error)
}
</script>