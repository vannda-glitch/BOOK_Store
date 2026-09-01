<script setup>
import { ref, computed } from 'vue'

const selectedGenre = ref('All')
const selectedPrice = ref('All')
const selectedFormat = ref('All')
const sortBy = ref('Relevance')
const currentPage = ref(1)
const countcard = ref(0);

const addToCart = () =>{
        countcard.value++;
}

const genres = [
  { name: 'Architecture', count: 12 },
  { name: 'Design', count: 10 },
  { name: 'Art History', count: 8 },
  { name: 'Typography', count: 15 }
]

const priceRanges = [
  'Under $50',
  '$50 - $100',
  'Over $100'
]

const formats = [
  'Hardcover',
  'Paperback',
  'Special Edition'
]

const books = [
  {
    id: 1,
    title: 'The Elements of Typographic Style',
    shortTitle: 'The Elements of Typographic...',
    author: 'Robert Bringhurst',
    price: 45,
    rating: 5,
    reviews: 128,
    genre: 'Typography',
    format: 'Hardcover',
    image:
      'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 2,
    title: 'Grid Systems in Graphic Design',
    shortTitle: 'Grid Systems in Graphic Design',
    author: 'Josef Müller-Brockmann',
    price: 65,
    rating: 5,
    reviews: 342,
    genre: 'Design',
    format: 'Paperback',
    image:
      'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 3,
    title: 'The Visual Display of Quantitative Information',
    shortTitle: 'The Visual Display of...',
    author: 'Edward R. Tufte',
    price: 52,
    rating: 4,
    reviews: 89,
    genre: 'Design',
    format: 'Hardcover',
    image:
      'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 4,
    title: 'Thinking with Type',
    shortTitle: 'Thinking with Type',
    author: 'Ellen Lupton',
    price: 38,
    rating: 5,
    reviews: 215,
    genre: 'Typography',
    format: 'Paperback',
    image:
      'https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 5,
    title: 'The Story of Art',
    shortTitle: 'The Story of Art',
    author: 'E. H. Gombrich',
    price: 72,
    rating: 5,
    reviews: 421,
    genre: 'Art History',
    format: 'Hardcover',
    image:
      'https://images.unsplash.com/photo-1541963463532-d68292c34b19?auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 6,
    title: 'Architectural Drawing',
    shortTitle: 'Architectural Drawing',
    author: 'David Dernie',
    price: 105,
    rating: 4,
    reviews: 74,
    genre: 'Architecture',
    format: 'Special Edition',
    image:
      'https://images.unsplash.com/photo-1531058020387-3be344556be6?auto=format&fit=crop&w=500&q=80'
  }, {
    id: 1,
    title: 'The Elements of Typographic Style',
    shortTitle: 'The Elements of Typographic...',
    author: 'Robert Bringhurst',
    price: 45,
    rating: 5,
    reviews: 128,
    genre: 'Typography',
    format: 'Hardcover',
    image:
      'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 2,
    title: 'Grid Systems in Graphic Design',
    shortTitle: 'Grid Systems in Graphic Design',
    author: 'Josef Müller-Brockmann',
    price: 65,
    rating: 5,
    reviews: 342,
    genre: 'Design',
    format: 'Paperback',
    image:
      'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 3,
    title: 'The Visual Display of Quantitative Information',
    shortTitle: 'The Visual Display of...',
    author: 'Edward R. Tufte',
    price: 52,
    rating: 4,
    reviews: 89,
    genre: 'Design',
    format: 'Hardcover',
    image:
      'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=500&q=80'
  }
]

const filteredBooks = computed(() => {
  let result = books.filter((book) => {
    const genreMatch =
      selectedGenre.value === 'All' ||
      book.genre === selectedGenre.value

    let priceMatch = true

    if (selectedPrice.value === 'Under $50') {
      priceMatch = book.price < 50
    } else if (selectedPrice.value === '$50 - $100') {
      priceMatch = book.price >= 50 && book.price <= 100
    } else if (selectedPrice.value === 'Over $100') {
      priceMatch = book.price > 100
    }

    const formatMatch =
      selectedFormat.value === 'All' ||
      book.format === selectedFormat.value

    return genreMatch && priceMatch && formatMatch
  })

  if (sortBy.value === 'Price: Low to High') {
    result.sort((a, b) => a.price - b.price)
  }

  if (sortBy.value === 'Price: High to Low') {
    result.sort((a, b) => b.price - a.price)
  }

  if (sortBy.value === 'Rating') {
    result.sort((a, b) => b.rating - a.rating)
  }

  return result
})

function selectGenre(genre) {
  selectedGenre.value =
    selectedGenre.value === genre ? 'All' : genre

  currentPage.value = 1
}

function selectPrice(price) {
  selectedPrice.value =
    selectedPrice.value === price ? 'All' : price

  currentPage.value = 1
}

function selectFormat(format) {
  selectedFormat.value =
    selectedFormat.value === format ? 'All' : format

  currentPage.value = 1
}
</script>

<template>
  <div class="min-h-screen bg-[#f8f9fc] text-[#111827]">

    <!-- ================= NAVBAR ================= -->
    <header class="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur">
      <div
        class="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-5 md:px-8"
      >

        <!-- Logo -->
        <NuxtLink
          to="/"
          class="font-serif text-xl font-bold tracking-tight text-gray-950"
        >
          Lumina Books
        </NuxtLink>

        <!-- Navigation -->
        <nav class="hidden items-center gap-7 text-[13px] md:flex">

          <NuxtLink
            to="/search"
            class="border-b border-black pb-1 font-medium text-gray-900"
          >
            Browse
          </NuxtLink>

          <NuxtLink
            to="/collections"
            class="text-gray-600 transition hover:text-black"
          >
            Collections
          </NuxtLink>

          <NuxtLink
            to="/rare-finds"
            class="text-gray-600 transition hover:text-black"
          >
            Rare Finds
          </NuxtLink>

          <NuxtLink
            to="/about"
            class="text-gray-600 transition hover:text-black"
          >
            About
          </NuxtLink>

        </nav>

        <!-- Right icons -->
        <div class="flex items-center gap-5">

          <!-- Search -->
          <button
            class="text-gray-700 transition hover:text-black"
            aria-label="Search"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.7"
              stroke="currentColor"
              class="h-5 w-5"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="m21 21-4.35-4.35m2.1-5.15a7.25 7.25 0 1 1-14.5 0 7.25 7.25 0 0 1 14.5 0Z"
              />
            </svg>
          </button>

         <!-- Cart -->
          <button
            class="relative inline-flex items-center justify-center text-gray-700 transition hover:text-black"
            aria-label="Shopping cart"
          >
            <!-- Cart Number -->
            <span
              v-if="countcard > 0"
              class="absolute -right-2 -top-2 flex h-3 w-3 items-center justify-center rounded-full bg-blue-700 text-xs font-bold text-white"
            >
              {{ countcard }}
            </span>

            <!-- Cart Icon -->
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.7"
              stroke="currentColor"
              class="h-5 w-5"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M2.75 3.75h2.1l1.55 11.1a2 2 0 0 0 2 1.72h8.95a2 2 0 0 0 1.95-1.55L20.75 7H5.3"
              />

              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M9 20.25h.01M18 20.25h.01"
              />
            </svg>
          </button>

          <!-- User -->
          <button
            class="text-gray-700 transition hover:text-black"
            aria-label="Account"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.7"
              stroke="currentColor"
              class="h-5 w-5"
            >
              <circle cx="12" cy="8" r="3.25" />
              <path
                stroke-linecap="round"
                d="M5.5 20c.75-3.15 3.1-4.75 6.5-4.75s5.75 1.6 6.5 4.75"
              />
            </svg>
          </button>

        </div>
      </div>
    </header>


    <!-- ================= MAIN ================= -->
    <main class="mx-auto max-w-[1400px] px-5 py-8 md:px-8 lg:py-10">

      <!-- Breadcrumb -->
      <div class="mb-5 flex items-center gap-2 text-[11px] text-gray-500">
        <NuxtLink to="/" class="hover:text-black">
          Home
        </NuxtLink>

        <span>›</span>

        <NuxtLink to="/search" class="hover:text-black">
          Browse
        </NuxtLink>

        <span>›</span>

        <span class="font-medium text-gray-800">
          Search Results
        </span>
      </div>


      <!-- Title + Sort -->
      <div
        class="mb-7 flex flex-col gap-5 md:flex-row md:items-end md:justify-between"
      >

        <div>
          <h1
            class="font-serif text-4xl font-bold tracking-tight text-gray-950 md:text-5xl"
          >
            Search Results
          </h1>

          <p class="mt-1 text-sm text-gray-500">
            Showing {{ filteredBooks.length }} results for
            <span class="text-gray-700">"Design Systems"</span>
          </p>
        </div>

        <!-- Sort -->
        <div class="flex items-center gap-2">
          <label
            for="sort"
            class="hidden text-xs text-gray-500 sm:block"
          >
            Sort by:
          </label>

          <select
            id="sort"
            v-model="sortBy"
            class="h-9 min-w-[145px] rounded-sm border border-gray-300 bg-white px-3 text-xs outline-none focus:border-black"
          >
            <option>Relevance</option>
            <option>Price: Low to High</option>
            <option>Price: High to Low</option>
            <option>Rating</option>
          </select>
        </div>

      </div>


     <!-- ================= CONTENT ================= -->
<div class="grid grid-cols-1 gap-10 lg:grid-cols-[180px_minmax(0,1fr)]">

  <!-- ================= SIDEBAR ================= -->
  <aside
    class="h-fit w-full self-start lg:sticky lg:top-20 lg:w-[180px]"
  >

    <!-- GENRE -->
    <section class="mb-7">

      <h2
        class="mb-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-gray-900"
      >
        Genre
      </h2>

      <div class="space-y-3">

        <button
          v-for="genre in genres"
          :key="genre.name"
          type="button"
          @click="selectGenre(genre.name)"
          class="group flex w-full items-center justify-between text-left"
        >

          <div class="flex items-center gap-2">

            <!-- Checkbox -->
            <span
              class="flex h-3.5 w-3.5 items-center justify-center border border-gray-400"
              :class="{
                'border-black bg-black':
                  selectedGenre === genre.name
              }"
            >

              <svg
                v-if="selectedGenre === genre.name"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                stroke-width="4"
                class="h-2.5 w-2.5"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="m5 12 4 4L19 6"
                />
              </svg>

            </span>

            <span
              class="text-xs"
              :class="
                selectedGenre === genre.name
                  ? 'font-medium text-black'
                  : 'text-gray-500 group-hover:text-black'
              "
            >
              {{ genre.name }}
            </span>

          </div>

          <span class="text-[10px] text-gray-400">
            ({{ genre.count }})
          </span>

        </button>

      </div>

    </section>


    <!-- DIVIDER -->
    <div class="mb-7 border-t border-gray-200"></div>


    <!-- PRICE RANGE -->
    <section class="mb-7">

      <h2
        class="mb-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-gray-900"
      >
        Price Range
      </h2>

      <div class="space-y-3">

        <button
          v-for="price in priceRanges"
          :key="price"
          type="button"
          @click="selectPrice(price)"
          class="flex items-center gap-2 text-xs"
        >

          <!-- Radio -->
          <span
            class="flex h-3.5 w-3.5 items-center justify-center rounded-full border border-gray-400"
          >

            <span
              v-if="selectedPrice === price"
              class="h-1.5 w-1.5 rounded-full bg-black"
            ></span>

          </span>

          <span
            :class="
              selectedPrice === price
                ? 'font-medium text-black'
                : 'text-gray-500 hover:text-black'
            "
          >
            {{ price }}
          </span>

        </button>

      </div>

    </section>


    <!-- DIVIDER -->
    <div class="mb-7 border-t border-gray-200"></div>


    <!-- FORMAT -->
    <section>

      <h2
        class="mb-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-gray-900"
      >
        Format
      </h2>

      <div class="flex flex-col items-start gap-2">

        <button
          v-for="format in formats"
          :key="format"
          type="button"
          @click="selectFormat(format)"
          class="rounded-full border px-3 py-1 text-[10px] transition"
          :class="
            selectedFormat === format
              ? 'border-gray-300 bg-[#dce6f8] text-gray-900'
              : 'border-gray-300 bg-white text-gray-500 hover:border-gray-500'
          "
        >
          {{ format }}
        </button>

      </div>

    </section>

  </aside>


  <!-- ================= BOOK AREA ================= -->
  <section class="min-w-0">

    <div
      v-if="filteredBooks.length"
      class="grid grid-cols-1 gap-x-5 gap-y-10 sm:grid-cols-2 xl:grid-cols-3"
    >

      <!-- BOOK CARD -->
      <article
        v-for="book in filteredBooks"
        :key="book.id"
        class="group flex min-w-0 flex-col"
      >

        <!-- IMAGE -->
        <NuxtLink
          :to="`/books/${book.id}`"
          class="block overflow-hidden bg-[#edf1f8]"
        >

          <div
            class="flex h-[280px] items-center justify-center p-5"
          >

            <img
              :src="book.image"
              :alt="book.title"
              class="h-full w-full object-contain transition duration-500 group-hover:scale-105"
            />

          </div>

        </NuxtLink>


        <!-- BOOK INFO -->
        <div class="flex flex-1 flex-col pt-4">

          <!-- TITLE + PRICE -->
          <div class="flex items-start justify-between gap-3">

            <NuxtLink
              :to="`/books/${book.id}`"
              class="font-serif text-[17px] font-bold leading-tight text-gray-950 transition hover:text-gray-600"
            >
              {{ book.shortTitle }}
            </NuxtLink>

            <span
              class="shrink-0 text-xs font-semibold text-gray-800"
            >
              ${{ book.price.toFixed(2) }}
            </span>

          </div>


          <!-- AUTHOR -->
          <p class="mt-2 text-[11px] text-gray-500">
            {{ book.author }}
          </p>


          <!-- RATING -->
          <div class="mt-2 flex items-center gap-1">

            <div class="text-[11px] text-yellow-700">

              <span
                v-for="star in 5"
                :key="star"
              >
                {{ star <= book.rating ? '★' : '☆' }}
              </span>

            </div>

            <span class="text-[10px] text-gray-500">
              ({{ book.reviews }})
            </span>

          </div>


          <!-- ADD TO CART -->
          <button
            type="button"
            @click="addToCart(book)"
            class="mt-4 flex w-full items-center justify-center gap-2 rounded-sm bg-black px-4 py-2.5 text-xs font-medium text-white transition hover:bg-gray-800 active:scale-[0.98]"
          >

            <!-- Cart Icon -->
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.8"
              stroke="currentColor"
              class="h-4 w-4"
            >

              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M2.75 3.75h2.1l1.55 11.1a2 2 0 0 0 2 1.72h8.95a2 2 0 0 0 1.95-1.55L20.75 7H5.3"
              />

              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M9 20.25h.01M18 20.25h.01"
              />

            </svg>

            Add to Cart

          </button>

        </div>

      </article>

    </div>


    <!-- NO RESULTS -->
    <div
      v-else
      class="flex min-h-[350px] items-center justify-center border border-dashed border-gray-300 bg-white"
    >

      <div class="text-center">

        <h3 class="font-serif text-xl font-bold">
          No books found
        </h3>

        <p class="mt-2 text-sm text-gray-500">
          Try changing your filters.
        </p>

      </div>

    </div>


    <!-- PAGINATION -->
    <div
      class="mt-12 flex items-center justify-center gap-7 border-t border-gray-200 pt-6"
    >

      <button
        type="button"
        class="text-gray-400 hover:text-black"
        :disabled="currentPage === 1"
        @click="currentPage > 1 && currentPage--"
      >
        ‹
      </button>

      <button
        type="button"
        class="flex h-7 w-7 items-center justify-center rounded-lg bg-black text-[11px] text-white"
      >
        1
      </button>

      <button
        type="button"
        class="text-[11px] text-gray-600 hover:text-black"
        @click="currentPage = 2"
      >
        2
      </button>

      <button
        type="button"
        class="text-[11px] text-gray-600 hover:text-black"
        @click="currentPage = 3"
      >
        3
      </button>

      <span class="text-[11px] text-gray-400">
        ...
      </span>

      <button
        type="button"
        class="text-[11px] text-gray-600 hover:text-black"
        @click="currentPage = 8"
      >
        8
      </button>

      <button
        type="button"
        class="text-gray-700 hover:text-black"
        @click="currentPage++"
      >
        ›
      </button>

    </div>

  </section>

</div>

    </main>


    <!-- ================= FOOTER ================= -->
    <footer class="mt-10 border-t border-gray-200 bg-[#edf2fc]">

      <div
        class="mx-auto flex max-w-[1400px] flex-col gap-4 px-5 py-7 text-[10px] text-gray-700 md:flex-row md:items-center md:justify-between md:px-8"
      >

        <p>
          © 2024 Lumina Books. Curated for the discerning reader.
        </p>

        <div class="flex flex-wrap gap-5">

          <NuxtLink
            to="/terms"
            class="hover:text-black"
          >
            Terms of Service
          </NuxtLink>

          <NuxtLink
            to="/privacy"
            class="hover:text-black"
          >
            Privacy Policy
          </NuxtLink>

          <NuxtLink
            to="/shipping"
            class="hover:text-black"
          >
            Shipping
          </NuxtLink>

          <NuxtLink
            to="/contact"
            class="hover:text-black"
          >
            Contact Us
          </NuxtLink>

        </div>

      </div>

    </footer>

  </div>
</template>