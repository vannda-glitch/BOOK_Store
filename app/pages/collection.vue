<script setup>
import { ref, computed, onMounted } from 'vue'

/* =========================================================
   NAVIGATION
========================================================= */

const activeNav = ref('Collections')

/* =========================================================
   COLLECTION DATA
========================================================= */

const collections = [
  {
    id: 1,
    name: 'Design & Creativity',
    slug: 'design',
    description:
      'Books about visual thinking, typography, creativity, branding, and the art of making.',
    image:
      'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=1200&q=80',
    count: 24
  },
  {
    id: 2,
    name: 'Art & Architecture',
    slug: 'art',
    description:
      'Explore architecture, art history, photography, and the people who shaped visual culture.',
    image:
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
    count: 18
  },
  {
    id: 3,
    name: 'Modern Classics',
    slug: 'classics',
    description:
      'Timeless books that continue to influence designers, artists, thinkers, and creators.',
    image:
      'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=1200&q=80',
    count: 32
  },
  {
    id: 4,
    name: 'Books for Creators',
    slug: 'creators',
    description:
      'Practical and inspiring books for designers, writers, developers, photographers, and makers.',
    image:
      'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=1200&q=80',
    count: 21
  },
  {
    id: 5,
    name: 'New & Noteworthy',
    slug: 'new',
    description:
      'Recently published books selected for curious readers looking for something new.',
    image:
      'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1200&q=80',
    count: 16
  },
  {
    id: 6,
    name: 'Ideas & Culture',
    slug: 'culture',
    description:
      'Discover books exploring philosophy, society, technology, culture, and the world around us.',
    image:
      'https://images.unsplash.com/photo-1519682337058-a94d519337bc?auto=format&fit=crop&w=1200&q=80',
    count: 27
  }
]

/* =========================================================
   FEATURED BOOKS
   These use the same structure as your Browse products.
========================================================= */

const books = [
  {
    id: 1,
    title: 'The Elements of Typographic Style',
    author: 'Robert Bringhurst',
    price: 45,
    rating: 5,
    reviews: 128,
    collection: 'design',
    format: 'Hardcover',
    image:
      'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=700&q=80'
  },
  {
    id: 2,
    title: 'Grid Systems in Graphic Design',
    author: 'Josef Müller-Brockmann',
    price: 65,
    rating: 5,
    reviews: 342,
    collection: 'design',
    format: 'Hardcover',
    image:
      'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=700&q=80'
  },
  {
    id: 3,
    title: 'The Visual Display of Quantitative Information',
    author: 'Edward R. Tufte',
    price: 52,
    rating: 5,
    reviews: 89,
    collection: 'design',
    format: 'Paperback',
    image:
      'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=700&q=80'
  },
  {
    id: 4,
    title: 'Thinking with Type',
    author: 'Ellen Lupton',
    price: 38,
    rating: 4,
    reviews: 215,
    collection: 'design',
    format: 'Paperback',
    image:
      'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=700&q=80'
  },
  {
    id: 5,
    title: 'Ways of Seeing',
    author: 'John Berger',
    price: 35,
    rating: 5,
    reviews: 176,
    collection: 'art',
    format: 'Paperback',
    image:
      'https://images.unsplash.com/photo-1541963463532-d68292c34b19?auto=format&fit=crop&w=700&q=80'
  },
  {
    id: 6,
    title: 'The Story of Art',
    author: 'E. H. Gombrich',
    price: 58,
    rating: 5,
    reviews: 304,
    collection: 'art',
    format: 'Hardcover',
    image:
      'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=700&q=80'
  },
  {
    id: 7,
    title: 'The Design of Everyday Things',
    author: 'Don Norman',
    price: 42,
    rating: 5,
    reviews: 421,
    collection: 'creators',
    format: 'Paperback',
    image:
      'https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=700&q=80'
  },
  {
    id: 8,
    title: 'Steal Like an Artist',
    author: 'Austin Kleon',
    price: 25,
    rating: 4,
    reviews: 512,
    collection: 'creators',
    format: 'Paperback',
    image:
      'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=700&q=80'
  }
]


/* =========================================================
   STATE
========================================================= */

const selectedCollection = ref('all')
const cart = ref([])
const cartCount = ref(0)
const showCartMessage = ref(false)

/* =========================================================
   FILTER BOOKS
========================================================= */

const filteredBooks = computed(() => {
  if (selectedCollection.value === 'all') {
    return books
  }

  return books.filter(
    book => book.collection === selectedCollection.value
  )
})

/* =========================================================
   SELECT COLLECTION
========================================================= */

function selectCollection(slug) {
  selectedCollection.value = slug

  // Smooth scroll to books
  setTimeout(() => {
    document
      .getElementById('collection-books')
      ?.scrollIntoView({
        behavior: 'smooth'
      })
  }, 50)
}

/* =========================================================
   ADD TO CART
   Shared localStorage key:
   "lumina-cart"
========================================================= */

function addToCart(book) {
  const existingBook = cart.value.find(
    item => item.id === book.id
  )

  if (existingBook) {
    existingBook.quantity++
  } else {
    cart.value.push({
      ...book,
      quantity: 1
    })
  }

  updateCart()

  showCartMessage.value = true

  setTimeout(() => {
    showCartMessage.value = false
  }, 2000)
}

/* =========================================================
   UPDATE CART
========================================================= */

function updateCart() {
  localStorage.setItem(
    'lumina-cart',
    JSON.stringify(cart.value)
  )

  cartCount.value = cart.value.reduce(
    (total, item) => total + item.quantity,
    0
  )
}

/* =========================================================
   LOAD CART
========================================================= */

onMounted(() => {
  const savedCart = localStorage.getItem('lumina-cart')

  if (savedCart) {
    try {
      cart.value = JSON.parse(savedCart)

      cartCount.value = cart.value.reduce(
        (total, item) => total + item.quantity,
        0
      )
    } catch (error) {
      console.error('Could not load cart:', error)
    }
  }
})

/* =========================================================
   CART PAGE
========================================================= */

function goToCart() {
  navigateTo('/cart')
}

/* =========================================================
   PRODUCT DETAIL
========================================================= */

function viewBook(book) {
  navigateTo(`/product/${book.id}`)
}
</script>

<template>
  <div class="min-h-screen bg-[#f8f9fc] text-[#111827]">

    <!-- =====================================================
         HERO
    ====================================================== -->

    <main>

      <section
        class="mx-auto max-w-[2000px] px-6 pb-14 pt-12 lg:px-12 lg:pt-16"
      >

        <!-- Breadcrumb -->
        <div
          class="mb-8 flex items-center gap-2 text-sm text-gray-500"
        >
          <NuxtLink
            to="/"
            class="hover:text-black"
          >
            Home
          </NuxtLink>

          <span>›</span>

          <span class="text-gray-950">
            Collections
          </span>
        </div>


        <!-- Hero -->
        <div
          class="grid overflow-hidden bg-[#e9edf5] lg:grid-cols-2"
        >

          <!-- Text -->
          <div
            class="flex flex-col justify-center px-8 py-14 sm:px-12 lg:px-20 lg:py-20"
          >

            <p
              class="mb-5 text-xs font-semibold uppercase tracking-[0.2em] text-gray-500"
            >
              Curated Reading
            </p>

            <h1
              class="max-w-2xl font-serif text-5xl font-bold leading-[1.05] tracking-tight text-gray-950 sm:text-6xl lg:text-7xl"
            >
              Collections
            </h1>

            <p
              class="mt-7 max-w-xl text-base leading-7 text-gray-600 sm:text-lg"
            >
              Discover books selected around ideas,
              interests, and creative pursuits. Explore
              thoughtfully curated collections made for
              curious readers.
            </p>

            <div class="mt-8 flex items-center gap-5">
              <button
                class="bg-black px-6 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
                @click="selectCollection('all')"
              >
                Explore All Books
              </button>

              <span class="text-sm text-gray-500">
                {{ books.length }} featured books
              </span>
            </div>

          </div>


          <!-- Image -->
          <div class="min-h-[350px] lg:min-h-[500px]">
            <img
              src="https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=1400&q=85"
              alt="Collection of books"
              class="h-full w-full object-cover"
            />
          </div>

        </div>

      </section>


      <!-- =====================================================
           COLLECTION CARDS
      ====================================================== -->

      <section
        class="mx-auto max-w-[1600px] px-6 pb-20 lg:px-12"
      >

        <div
          class="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"
        >
          <div>
            <p
              class="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-gray-500"
            >
              Explore
            </p>

            <h2
              class="font-serif text-4xl font-bold tracking-tight text-gray-950"
            >
              Curated Collections
            </h2>
          </div>

          <p class="max-w-md text-sm leading-6 text-gray-500">
            Each collection brings together books
            connected by a common idea, discipline, or
            creative practice.
          </p>
        </div>


        <!-- Collection Grid -->
        <div
          class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >

          <article
            v-for="collection in collections"
            :key="collection.id"
            class="group cursor-pointer bg-white"
            @click="selectCollection(collection.slug)"
          >

            <!-- Image -->
            <div
              class="relative aspect-[4/3] overflow-hidden bg-gray-100"
            >

              <img
                :src="collection.image"
                :alt="collection.name"
                class="h-full w-full object-cover transition duration-700 group-hover:scale-105"
              />

              <!-- Overlay -->
              <div
                class="absolute inset-0 bg-black/0 transition duration-300 group-hover:bg-black/10"
              />

              <!-- Count -->
              <div
                class="absolute right-4 top-4 bg-white px-3 py-2 text-xs font-medium text-gray-800"
              >
                {{ collection.count }} books
              </div>

            </div>


            <!-- Text -->
            <div class="px-1 pb-5 pt-5">

              <div
                class="flex items-start justify-between gap-4"
              >

                <h3
                  class="font-serif text-2xl font-bold text-gray-950"
                >
                  {{ collection.name }}
                </h3>

                <span
                  class="mt-1 text-xl transition-transform duration-300 group-hover:translate-x-1"
                >
                  →
                </span>

              </div>

              <p
                class="mt-3 max-w-lg text-sm leading-6 text-gray-500"
              >
                {{ collection.description }}
              </p>

              <button
                class="mt-5 border-b border-gray-950 pb-1 text-xs font-semibold uppercase tracking-wider text-gray-950"
              >
                Explore Collection
              </button>

            </div>

          </article>

        </div>

      </section>


      <!-- =====================================================
           FEATURED COLLECTION
      ====================================================== -->

      <section
        class="border-y border-gray-200 bg-white"
      >

        <div
          class="mx-auto grid max-w-[1600px] lg:grid-cols-2"
        >

          <!-- Image -->
          <div class="min-h-[400px] lg:min-h-[560px]">
            <img
              src="https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=1400&q=85"
              alt="Design books"
              class="h-full w-full object-cover"
            />
          </div>


          <!-- Content -->
          <div
            class="flex flex-col justify-center px-8 py-14 sm:px-12 lg:px-20"
          >

            <p
              class="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500"
            >
              Collection of the Month
            </p>

            <h2
              class="mt-5 font-serif text-4xl font-bold leading-tight text-gray-950 sm:text-5xl"
            >
              Design &<br />
              Creativity
            </h2>

            <p
              class="mt-6 max-w-lg text-base leading-7 text-gray-600"
            >
              From typography and visual systems to
              creative thinking and design philosophy,
              this collection brings together essential
              books for anyone interested in how ideas
              become visual.
            </p>

            <div class="mt-8">

              <button
                class="inline-flex items-center gap-3 bg-black px-6 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
                @click="selectCollection('design')"
              >
                Explore Design Collection

                <span>→</span>
              </button>

            </div>

          </div>

        </div>

      </section>


      <!-- =====================================================
           BOOKS
      ====================================================== -->

      <section
        id="collection-books"
        class="mx-auto max-w-[1600px] px-6 py-20 lg:px-12"
      >

        <!-- Heading -->
        <div
          class="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between"
        >

          <div>

            <p
              class="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-gray-500"
            >
              Selected Books
            </p>

            <h2
              class="font-serif text-4xl font-bold tracking-tight text-gray-950"
            >
              {{
                selectedCollection === 'all'
                  ? 'Featured Books'
                  : collections.find(
                      c => c.slug === selectedCollection
                    )?.name
              }}
            </h2>

          </div>


          <!-- Collection Filter -->
          <div
            class="flex flex-wrap gap-2"
          >

            <button
              class="border px-4 py-2 text-xs font-medium transition"
              :class="selectedCollection === 'all'
                ? 'border-black bg-black text-white'
                : 'border-gray-300 bg-white text-gray-600 hover:border-black hover:text-black'"
              @click="selectCollection('all')"
            >
              All
            </button>

            <button
              v-for="collection in collections.slice(0, 4)"
              :key="collection.id"
              class="border px-4 py-2 text-xs font-medium transition"
              :class="selectedCollection === collection.slug
                ? 'border-black bg-black text-white'
                : 'border-gray-300 bg-white text-gray-600 hover:border-black hover:text-black'"
              @click="selectCollection(collection.slug)"
            >
              {{ collection.name }}
            </button>

          </div>

        </div>


        <!-- Book Grid -->
        <div
          class="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >

          <article
            v-for="book in filteredBooks"
            :key="book.id"
            class="group"
          >

            <!-- Image -->
            <div
              class="relative aspect-[3/4] overflow-hidden bg-[#edf1f7]"
            >

              <img
                :src="book.image"
                :alt="book.title"
                class="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
              />

              <!-- Quick View -->
              <button
                class="absolute bottom-4 left-4 right-4 bg-white py-3 text-sm font-semibold opacity-0 shadow-sm transition duration-300 group-hover:opacity-100"
                @click="viewBook(book)"
              >
                View Details
              </button>

            </div>


            <!-- Information -->
            <div class="pt-5">

              <div
                class="flex items-start justify-between gap-3"
              >

                <h3
                  class="font-serif text-xl font-bold leading-tight text-gray-950"
                >
                  {{ book.title }}
                </h3>

                <span
                  class="shrink-0 text-sm font-medium text-gray-950"
                >
                  ${{ book.price }}
                </span>

              </div>


              <p
                class="mt-2 text-sm text-gray-500"
              >
                {{ book.author }}
              </p>


              <!-- Rating -->
              <div
                class="mt-3 flex items-center gap-2"
              >

                <div class="flex">
                  <span
                    v-for="star in 5"
                    :key="star"
                    class="text-sm"
                    :class="star <= book.rating
                      ? 'text-[#b36b00]'
                      : 'text-gray-300'"
                  >
                    ★
                  </span>
                </div>

                <span class="text-xs text-gray-500">
                  ({{ book.reviews }})
                </span>

              </div>


              <!-- Add To Cart -->
              <button
                class="mt-5 flex w-full items-center justify-center gap-3 bg-black py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
                @click="addToCart(book)"
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
                    d="M2.75 3.75h2.1l1.55 11.1a2 2 0 0 0 1.98 1.72h8.9a2 2 0 0 0 1.96-1.6L20.5 7H5.2"
                  />
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M9 20.25h.01M17 20.25h.01"
                  />
                </svg>

                Add to Cart

              </button>

            </div>

          </article>

        </div>


        <!-- No Books -->
        <div
          v-if="filteredBooks.length === 0"
          class="py-20 text-center"
        >
          <h3
            class="font-serif text-2xl font-bold"
          >
            No books found
          </h3>

          <p
            class="mt-2 text-sm text-gray-500"
          >
            Try another collection.
          </p>
        </div>

      </section>


      <!-- =====================================================
           NEWSLETTER
      ====================================================== -->

      <section
        class="border-t border-gray-200 bg-[#e9edf5]"
      >

        <div
          class="mx-auto max-w-3xl px-6 py-20 text-center"
        >

          <p
            class="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500"
          >
            Stay Curious
          </p>

          <h2
            class="mt-4 font-serif text-4xl font-bold text-gray-950"
          >
            Discover something worth reading.
          </h2>

          <p
            class="mx-auto mt-4 max-w-xl text-sm leading-6 text-gray-600"
          >
            Join our newsletter for new collections,
            rare finds, and thoughtful recommendations.
          </p>

          <div
            class="mx-auto mt-8 flex max-w-lg flex-col gap-3 sm:flex-row"
          >

            <input
              type="email"
              placeholder="Your email address"
              class="h-12 flex-1 border border-gray-300 bg-white px-4 text-sm outline-none focus:border-black"
            />

            <button
              class="h-12 bg-black px-7 text-sm font-semibold text-white transition hover:bg-gray-800"
            >
              Subscribe
            </button>

          </div>

        </div>

      </section>

    </main>


    <!-- =====================================================
         ADD TO CART MESSAGE
    ====================================================== -->

    <Transition
      enter-active-class="transition duration-300"
      enter-from-class="translate-y-4 opacity-0"
      enter-to-class="translate-y-0 opacity-100"
      leave-active-class="transition duration-300"
      leave-from-class="translate-y-0 opacity-100"
      leave-to-class="translate-y-4 opacity-0"
    >

      <div
        v-if="showCartMessage"
        class="fixed bottom-6 right-6 z-[100] flex items-center gap-3 bg-black px-5 py-4 text-sm font-medium text-white shadow-xl"
      >

        <span
          class="flex h-6 w-6 items-center justify-center rounded-full bg-white text-black"
        >
          ✓
        </span>

        Added to your cart

      </div>

    </Transition>

  </div>
</template>