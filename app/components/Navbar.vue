<script setup lang="ts">
            const search = ref('')
            const cartCount = ref(0)

</script>
<template>
    <header class="bg-white border-b sticky top-0 z-50">
      <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div class="h-20 flex items-center justify-between gap-6">

          <!-- Logo -->
          <div class="flex items-center gap-3">
            <div
              class="w-11 h-11 rounded-xl bg-indigo-600 flex items-center justify-center text-white text-2xl"
            >
              📚
            </div>

            <div>
              <h1 class="font-bold text-xl text-gray-900">
                Book<span class="text-indigo-600">Nest</span>
              </h1>
              <p class="text-xs text-gray-400">
                Your reading world
              </p>
            </div>
          </div>

          <!-- Search -->
          <div class="hidden md:flex flex-1 max-w-xl relative">
            <input
              v-model="search"
              type="text"
              placeholder="Search books, authors..."
              class="w-full bg-gray-100 border border-transparent rounded-xl
                     py-3 pl-12 pr-4 outline-none
                     focus:bg-white focus:border-indigo-500
                     transition"
            />

            <span
              class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            >
              🔍
            </span>
          </div>

          <!-- Navigation -->
          <div class="flex items-center gap-5">

            <a
              href="#"
              class="hidden lg:block text-sm font-medium hover:text-indigo-600"
            >
              Home
            </a>

            <a
              href="#books"
              class="hidden lg:block text-sm font-medium hover:text-indigo-600"
            >
              Books
            </a>

            <a
              href="#categories"
              class="hidden lg:block text-sm font-medium hover:text-indigo-600"
            >
              Categories
            </a>

            <!-- Cart -->
            <button
              class="relative text-xl hover:text-indigo-600"
            >
              🛒

              <span
                v-if="cartCount > 0"
                class="absolute -top-2 -right-2 bg-indigo-600
                       text-white text-xs w-5 h-5 rounded-full
                       flex items-center justify-center"
              >
                {{ cartCount }}
              </span>
            </button>

            <!-- User -->
            <button
              class="hidden sm:block bg-gray-100 px-4 py-2 rounded-lg
                     text-sm font-medium hover:bg-gray-200"
            >
              Login
            </button>

          </div>
        </div>
      </nav>
    </header>

</template>