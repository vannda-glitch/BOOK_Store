<template>
  <footer class="bg-white border-t border-gray-200 mt-auto">
    <div class="container mx-auto px-4 py-8">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h3 class="font-bold text-lg text-primary-600 mb-4">BookStore</h3>
          <p class="text-gray-600 text-sm">
            Your one-stop shop for all your reading needs. Discover thousands of books from your favorite authors.
          </p>
        </div>
        
        <div>
          <h4 class="font-semibold text-gray-800 mb-4">Quick Links</h4>
          <ul class="space-y-2 text-sm">
            <li><NuxtLink to="/books" class="text-gray-600 hover:text-primary-600">All Books</NuxtLink></li>
            <li><NuxtLink to="/about" class="text-gray-600 hover:text-primary-600">About Us</NuxtLink></li>
            <li><NuxtLink to="/contact" class="text-gray-600 hover:text-primary-600">Contact</NuxtLink></li>
          </ul>
        </div>
        
        <div>
          <h4 class="font-semibold text-gray-800 mb-4">Categories</h4>
          <ul class="space-y-2 text-sm">
            <li v-for="category in categories.slice(0, 5)" :key="category.id">
              <NuxtLink :to="`/books/category/${category.slug}`" class="text-gray-600 hover:text-primary-600">
                {{ category.name }}
              </NuxtLink>
            </li>
          </ul>
        </div>
        
        <div>
          <h4 class="font-semibold text-gray-800 mb-4">Follow Us</h4>
          <div class="flex space-x-4">
            <a href="#" class="text-gray-400 hover:text-primary-600">
              <Icon name="mdi:facebook" size="24" />
            </a>
            <a href="#" class="text-gray-400 hover:text-primary-600">
              <Icon name="mdi:twitter" size="24" />
            </a>
            <a href="#" class="text-gray-400 hover:text-primary-600">
              <Icon name="mdi:instagram" size="24" />
            </a>
            <a href="#" class="text-gray-400 hover:text-primary-600">
              <Icon name="mdi:youtube" size="24" />
            </a>
          </div>
          <p class="mt-4 text-sm text-gray-500">
            Subscribe to our newsletter for updates
          </p>
        </div>
      </div>
      
      <div class="mt-8 pt-8 border-t border-gray-200 text-center text-sm text-gray-500">
        <p>&copy; {{ new Date().getFullYear() }} BookStore. All rights reserved.</p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { useBooks } from '~/composables/useBooks'

const { categories } = useBooks()
</script>