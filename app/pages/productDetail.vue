<script setup>
import { ref, computed } from 'vue'

const route = useRoute()

const count = ref(1)
const addedMessage = ref(false)

const books = [
  {
    id: 1,
    title: 'The Elements of Typographic Style',
    author: 'Robert Bringhurst',
    price: 45,
    rating: 5,
    reviews: 128,
    genre: 'Typography',
    format: 'Hardcover',
    image:
      'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=800&q=80',
    description:
      'The Elements of Typographic Style is a classic guide to typography. It combines practical advice with historical knowledge to help designers create beautiful and readable text.',
    pages: 352,
    publisher: 'Hartley & Marks',
    language: 'English',
    year: 2013
  },

  {
    id: 2,
    title: 'Grid Systems in Graphic Design',
    author: 'Josef Müller-Brockmann',
    price: 65,
    rating: 5,
    reviews: 342,
    genre: 'Design',
    format: 'Paperback',
    image:
      'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=800&q=80',
    description:
      'A practical and influential guide to grid systems and graphic design. Perfect for students and professional designers.',
    pages: 176,
    publisher: 'Niggli',
    language: 'English',
    year: 2018
  },

  {
    id: 3,
    title: 'The Visual Display of Quantitative Information',
    author: 'Edward R. Tufte',
    price: 52,
    rating: 4,
    reviews: 89,
    genre: 'Design',
    format: 'Hardcover',
    image:
      'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80',
    description:
      'A detailed exploration of how information can be presented visually through charts, graphs and data design.',
    pages: 200,
    publisher: 'Graphics Press',
    language: 'English',
    year: 2001
  },

  {
    id: 4,
    title: 'Thinking with Type',
    author: 'Ellen Lupton',
    price: 38,
    rating: 5,
    reviews: 215,
    genre: 'Typography',
    format: 'Paperback',
    image:
      'https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=800&q=80',
    description:
      'Thinking with Type is a practical guide to typography for designers, writers, editors and students.',
    pages: 224,
    publisher: 'Princeton Architectural Press',
    language: 'English',
    year: 2010
  },

  {
    id: 5,
    title: 'The Story of Art',
    author: 'E. H. Gombrich',
    price: 72,
    rating: 5,
    reviews: 421,
    genre: 'Art History',
    format: 'Hardcover',
    image:
      'https://images.unsplash.com/photo-1541963463532-d68292c34b19?auto=format&fit=crop&w=800&q=80',
    description:
      'A beautifully written introduction to the history of art, covering major artists, movements and works.',
    pages: 688,
    publisher: 'Phaidon',
    language: 'English',
    year: 2016
  },

  {
    id: 6,
    title: 'Architectural Drawing',
    author: 'David Dernie',
    price: 105,
    rating: 4,
    reviews: 74,
    genre: 'Architecture',
    format: 'Special Edition',
    image:
      'https://images.unsplash.com/photo-1531058020387-3be344556be6?auto=format&fit=crop&w=800&q=80',
    description:
      'A comprehensive guide to architectural drawing techniques, visual communication and presentation.',
    pages: 224,
    publisher: 'Laurence King',
    language: 'English',
    year: 2014
  }
]

const book = computed(() => {
  return books.find((item) => item.id === Number(route.params.id))
})

const totalPrice = computed(() => {
  if (!book.value) return 0
  return book.value.price * count.value
})

const increaseQuantity = () => {
  count.value++
}

const decreaseQuantity = () => {
  if (count.value > 1) {
    count.value--
  }
}

const addToCart = () => {
  addedMessage.value = true

  setTimeout(() => {
    addedMessage.value = false
  }, 2000)
}
</script>

<template>
  <div v-if="book" class="min-h-screen bg-white">

    <!-- Breadcrumb -->
    <div class="mx-auto max-w-7xl px-6 pt-8 lg:px-8">
      <div class="flex items-center gap-2 text-sm text-gray-500">
        <NuxtLink to="/" class="hover:text-black">
          Home
        </NuxtLink>

        <span>/</span>

        <NuxtLink to="/books" class="hover:text-black">
          Books
        </NuxtLink>

        <span>/</span>

        <span class="text-gray-900">
          {{ book.shortTitle || book.title }}
        </span>
      </div>
    </div>

    <!-- Product Detail -->
    <main class="mx-auto max-w-7xl px-6 py-12 lg:px-8">

      <div class="grid grid-cols-1 gap-12 lg:grid-cols-2">

        <!-- ================= IMAGE ================= -->
        <div>
          <div
            class="flex min-h-[550px] items-center justify-center overflow-hidden bg-[#edf1f8] p-10"
          >
            <img
              :src="book.image"
              :alt="book.title"
              class="h-[500px] w-full object-contain transition duration-500 hover:scale-105"
            />
          </div>

          <!-- Small image info -->
          <div class="mt-4 grid grid-cols-3 gap-3">

            <div
              class="flex h-24 items-center justify-center bg-[#edf1f8]"
            >
              <img
                :src="book.image"
                :alt="book.title"
                class="h-full w-full object-contain p-2"
              />
            </div>

            <div
              class="flex h-24 items-center justify-center border border-gray-200"
            >
              <span class="text-xs text-gray-500">
                {{ book.format }}
              </span>
            </div>

            <div
              class="flex h-24 items-center justify-center border border-gray-200"
            >
              <span class="text-xs text-gray-500">
                {{ book.genre }}
              </span>
            </div>

          </div>
        </div>

        <!-- ================= INFORMATION ================= -->
        <div class="flex flex-col justify-center">

          <!-- Genre -->
          <p
            class="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500"
          >
            {{ book.genre }}
          </p>

          <!-- Title -->
          <h1
            class="mt-3 font-serif text-4xl font-bold leading-tight text-gray-950 md:text-5xl"
          >
            {{ book.title }}
          </h1>

          <!-- Author -->
          <p class="mt-4 text-base text-gray-500">
            by
            <span class="font-medium text-gray-900">
              {{ book.author }}
            </span>
          </p>

          <!-- Rating -->
          <div class="mt-5 flex items-center gap-3">

            <div class="text-sm text-yellow-700">
              <span
                v-for="star in 5"
                :key="star"
              >
                {{ star <= book.rating ? '★' : '☆' }}
              </span>
            </div>

            <span class="text-sm text-gray-500">
              {{ book.rating }} / 5
            </span>

            <span class="text-sm text-gray-400">
              ({{ book.reviews }} reviews)
            </span>

          </div>

          <!-- Price -->
          <div class="mt-7">
            <span class="text-3xl font-bold text-gray-950">
              ${{ book.price.toFixed(2) }}
            </span>
          </div>

          <!-- Description -->
          <p class="mt-7 max-w-xl text-sm leading-7 text-gray-600">
            {{ book.description }}
          </p>

          <!-- Divider -->
          <div class="my-7 border-t border-gray-200"></div>

          <!-- Format -->
          <div class="flex items-center justify-between">
            <span class="text-sm font-medium text-gray-700">
              Format
            </span>

            <span class="text-sm text-gray-900">
              {{ book.format }}
            </span>
          </div>

          <!-- Quantity -->
          <div class="mt-6">

            <p class="mb-3 text-sm font-medium text-gray-700">
              Quantity
            </p>

            <div
              class="flex w-fit items-center border border-gray-300"
            >

              <button
                @click="decreaseQuantity"
                class="flex h-11 w-11 items-center justify-center text-xl text-gray-600 hover:bg-gray-100"
              >
                −
              </button>

              <span
                class="flex h-11 w-12 items-center justify-center border-x border-gray-300 text-sm font-semibold"
              >
                {{ count }}
              </span>

              <button
                @click="increaseQuantity"
                class="flex h-11 w-11 items-center justify-center text-xl text-gray-600 hover:bg-gray-100"
              >
                +
              </button>

            </div>
          </div>

          <!-- Add Cart -->
          <button
            @click="addToCart"
            class="mt-6 flex w-full items-center justify-center gap-3 rounded-sm bg-black px-6 py-4 text-sm font-medium text-white transition hover:bg-gray-800"
          >

            <!-- Cart Icon -->
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.8"
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

            Add to Cart

            <span>
              — ${{ totalPrice.toFixed(2) }}
            </span>

          </button>

          <!-- Success Message -->
          <div
            v-if="addedMessage"
            class="mt-4 border border-green-200 bg-green-50 px-4 py-3 text-center text-sm text-green-700"
          >
            ✓ {{ count }} item(s) added to your cart
          </div>

          <!-- Product Details -->
          <div class="mt-8 grid grid-cols-2 gap-4 border-t border-gray-200 pt-6">

            <div>
              <p class="text-xs text-gray-400">
                Pages
              </p>

              <p class="mt-1 text-sm font-medium">
                {{ book.pages }}
              </p>
            </div>

            <div>
              <p class="text-xs text-gray-400">
                Language
              </p>

              <p class="mt-1 text-sm font-medium">
                {{ book.language }}
              </p>
            </div>

            <div>
              <p class="text-xs text-gray-400">
                Publisher
              </p>

              <p class="mt-1 text-sm font-medium">
                {{ book.publisher }}
              </p>
            </div>

            <div>
              <p class="text-xs text-gray-400">
                Published
              </p>

              <p class="mt-1 text-sm font-medium">
                {{ book.year }}
              </p>
            </div>

          </div>

        </div>
      </div>

      <!-- ================= DESCRIPTION ================= -->
      <section class="mt-20 border-t border-gray-200 pt-12">

        <div class="max-w-3xl">

          <p
            class="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500"
          >
            About this book
          </p>

          <h2
            class="mt-3 font-serif text-3xl font-bold text-gray-950"
          >
            {{ book.title }}
          </h2>

          <p class="mt-5 text-sm leading-8 text-gray-600">
            {{ book.description }}
          </p>

        </div>

      </section>

    </main>
  </div>

  <!-- Book Not Found -->
  <div
    v-else
    class="flex min-h-screen flex-col items-center justify-center"
  >
    <h1 class="text-3xl font-bold">
      Book Not Found
    </h1>

    <p class="mt-3 text-gray-500">
      The book you're looking for doesn't exist.
    </p>

    <NuxtLink
      to="/books"
      class="mt-6 bg-black px-6 py-3 text-sm text-white"
    >
      Back to Books
    </NuxtLink>
  </div>
</template>