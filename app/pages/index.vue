<script setup>
import { ref, computed, onMounted } from 'vue'

/* =========================================================
   BOOK DATA
   Same structure used by Browse + Collections + Cart
========================================================= */

const books = [
  {
    id: 1,
    title: 'The Elements of Typographic Style',
    author: 'Robert Bringhurst',
    price: 45,
    rating: 5,
    reviews: 128,
    format: 'Hardcover',
    collection: 'design',
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
    format: 'Hardcover',
    collection: 'design',
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
    format: 'Paperback',
    collection: 'design',
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
    format: 'Paperback',
    collection: 'design',
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
    format: 'Paperback',
    collection: 'art',
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
    format: 'Hardcover',
    collection: 'art',
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
    format: 'Paperback',
    collection: 'creators',
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
    format: 'Paperback',
    collection: 'creators',
    image:
      'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=700&q=80'
  }
]

/* =========================================================
   COLLECTIONS
========================================================= */

const collections = [
  {
    id: 1,
    name: 'Design & Creativity',
    description:
      'Typography, visual thinking, branding, and creative practice.',
    image:
      'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=1000&q=80'
  },
  {
    id: 2,
    name: 'Art & Architecture',
    description:
      'Explore art history, architecture, photography, and visual culture.',
    image:
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1000&q=80'
  },
  {
    id: 3,
    name: 'Books for Creators',
    description:
      'Ideas and inspiration for designers, writers, developers, and makers.',
    image:
      'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=1000&q=80'
  }
]

/* =========================================================
   CART
========================================================= */

const cart = ref([])
const showCartMessage = ref(false)

/* =========================================================
   CART COUNT
========================================================= */

const cartCount = computed(() => {
  return cart.value.reduce(
    (total, item) => total + item.quantity,
    0
  )
})

/* =========================================================
   LOAD CART
========================================================= */

onMounted(() => {
  const savedCart = localStorage.getItem('lumina-cart')

  if (savedCart) {
    try {
      cart.value = JSON.parse(savedCart)
    } catch (error) {
      console.error('Could not load cart:', error)
      cart.value = []
    }
  }
})

/* =========================================================
   ADD TO CART
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

  localStorage.setItem(
    'lumina-cart',
    JSON.stringify(cart.value)
  )

  showCartMessage.value = true

  setTimeout(() => {
    showCartMessage.value = false
  }, 2000)
}

/* =========================================================
   NAVIGATION
========================================================= */

function goToBrowse() {
  navigateTo('/browse')
}

function goToCart() {
  navigateTo('/cart')
}

function viewBook(book) {
  navigateTo(`/product/${book.id}`)
}
</script>


<template>

  <div
    class="min-h-screen bg-[#f8f9fc] text-[#111827]"
  >

    <!-- =====================================================
         NAVBAR
    ====================================================== -->

    


    <!-- =====================================================
         HERO
    ====================================================== -->

    <main>

      <section
        class="mx-auto max-w-[1600px] px-6 pt-6 lg:px-12 lg:pt-8"
      >

        <div
          class="grid overflow-hidden bg-[#e9edf5] lg:grid-cols-2"
        >

          <!-- Hero Text -->

          <div
            class="flex flex-col justify-center px-8 py-16 sm:px-12 lg:px-20 lg:py-24"
          >

            <p
              class="text-xs font-semibold uppercase tracking-[0.22em] text-gray-500"
            >
              Lumina Books
            </p>


            <h1
              class="mt-5 max-w-2xl font-serif text-5xl font-bold leading-[1.02] tracking-tight text-gray-950 sm:text-6xl lg:text-7xl"
            >
              Books for
              <br />
              curious minds.
            </h1>


            <p
              class="mt-7 max-w-xl text-base leading-7 text-gray-600 sm:text-lg"
            >
              Discover carefully selected books about
              design, art, architecture, creativity, and
              ideas worth exploring.
            </p>


            <!-- Hero Buttons -->

            <div
              class="mt-9 flex flex-col gap-3 sm:flex-row"
            >

              <button
                class="bg-black px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-gray-800"
                @click="goToBrowse"
              >
                Browse Books
              </button>


              <NuxtLink
                to="/collections"
                class="border border-gray-300 bg-white px-7 py-3.5 text-center text-sm font-semibold text-gray-900 transition hover:border-black"
              >
                Explore Collections
              </NuxtLink>

            </div>

          </div>


          <!-- Hero Image -->

          <div
            class="relative min-h-[420px] lg:min-h-[600px]"
          >

            <img
              src="https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=1400&q=85"
              alt="Lumina Books collection"
              class="h-full w-full object-cover"
            />


            <!-- Hero Label -->

            <div
              class="absolute bottom-6 left-6 bg-white px-5 py-4 shadow-sm sm:bottom-8 sm:left-8"
            >

              <p
                class="text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-400"
              >
                Curated Reading
              </p>

              <p
                class="mt-1 font-serif text-lg font-bold text-gray-950"
              >
                Discover your next book
              </p>

            </div>

          </div>

        </div>

      </section>


      <!-- =====================================================
           QUICK CATEGORIES
      ====================================================== -->

      <section
        class="mx-auto max-w-[1600px] px-6 py-16 lg:px-12"
      >

        <div
          class="grid border-y border-gray-200 sm:grid-cols-2 lg:grid-cols-4"
        >

          <NuxtLink
            to="/browse?genre=design"
            class="group border-b border-gray-200 px-6 py-7 transition hover:bg-white sm:border-r lg:border-b-0"
          >

            <span
              class="text-xs uppercase tracking-[0.15em] text-gray-400"
            >
              01
            </span>

            <h3
              class="mt-3 font-serif text-2xl font-bold"
            >
              Design
            </h3>

            <p
              class="mt-2 text-sm text-gray-500"
            >
              Typography, systems & visual thinking
            </p>

            <span
              class="mt-5 block text-sm font-medium transition-transform group-hover:translate-x-1"
            >
              Explore →
            </span>

          </NuxtLink>


          <NuxtLink
            to="/browse?genre=art"
            class="group border-b border-gray-200 px-6 py-7 transition hover:bg-white lg:border-b-0 lg:border-r"
          >

            <span
              class="text-xs uppercase tracking-[0.15em] text-gray-400"
            >
              02
            </span>

            <h3
              class="mt-3 font-serif text-2xl font-bold"
            >
              Art
            </h3>

            <p
              class="mt-2 text-sm text-gray-500"
            >
              Art history, photography & culture
            </p>

            <span
              class="mt-5 block text-sm font-medium transition-transform group-hover:translate-x-1"
            >
              Explore →
            </span>

          </NuxtLink>


          <NuxtLink
            to="/collections"
            class="group border-b border-gray-200 px-6 py-7 transition hover:bg-white sm:border-r lg:border-b-0"
          >

            <span
              class="text-xs uppercase tracking-[0.15em] text-gray-400"
            >
              03
            </span>

            <h3
              class="mt-3 font-serif text-2xl font-bold"
            >
              Collections
            </h3>

            <p
              class="mt-2 text-sm text-gray-500"
            >
              Curated books around ideas
            </p>

            <span
              class="mt-5 block text-sm font-medium transition-transform group-hover:translate-x-1"
            >
              Explore →
            </span>

          </NuxtLink>


          <NuxtLink
            to="/rare-finds"
            class="group px-6 py-7 transition hover:bg-white"
          >

            <span
              class="text-xs uppercase tracking-[0.15em] text-gray-400"
            >
              04
            </span>

            <h3
              class="mt-3 font-serif text-2xl font-bold"
            >
              Rare Finds
            </h3>

            <p
              class="mt-2 text-sm text-gray-500"
            >
              Limited & collectible editions
            </p>

            <span
              class="mt-5 block text-sm font-medium transition-transform group-hover:translate-x-1"
            >
              Explore →
            </span>

          </NuxtLink>

        </div>

      </section>


      <!-- =====================================================
           POPULAR BOOKS
      ====================================================== -->

      <section
        class="mx-auto max-w-[1600px] px-6 pb-20 lg:px-12"
      >

        <!-- Heading -->

        <div
          class="mb-10 flex items-end justify-between"
        >

          <div>

            <p
              class="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-gray-500"
            >
              Reader Favorites
            </p>

            <h2
              class="font-serif text-4xl font-bold tracking-tight text-gray-950"
            >
              Popular Books
            </h2>

          </div>


          <NuxtLink
            to="/browse"
            class="hidden border-b border-gray-950 pb-1 text-sm font-medium md:block"
          >
            View all books →
          </NuxtLink>

        </div>


        <!-- Books -->

        <div
          class="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4"
        >

          <article
            v-for="book in books.slice(0, 4)"
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


              <!-- View -->

              <button
                class="absolute bottom-4 left-4 right-4 bg-white py-3 text-sm font-semibold opacity-0 shadow-sm transition group-hover:opacity-100"
                @click="viewBook(book)"
              >
                View Details
              </button>

            </div>


            <!-- Info -->

            <div class="pt-5">

              <div
                class="flex items-start justify-between gap-3"
              >

                <h3
                  class="font-serif text-xl font-bold leading-tight"
                >
                  {{ book.title }}
                </h3>

                <span
                  class="shrink-0 text-sm font-semibold"
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

                <span
                  class="text-xs text-gray-500"
                >
                  ({{ book.reviews }})
                </span>

              </div>


              <!-- Add Cart -->

              <button
                class="mt-5 w-full bg-black py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
                @click="addToCart(book)"
              >
                Add to Cart
              </button>

            </div>

          </article>

        </div>

      </section>


      <!-- =====================================================
           COLLECTIONS
      ====================================================== -->

      <section
        class="border-y border-gray-200 bg-white"
      >

        <div
          class="mx-auto max-w-[1600px] px-6 py-20 lg:px-12"
        >

          <div
            class="mb-10 flex flex-col justify-between gap-5 md:flex-row md:items-end"
          >

            <div>

              <p
                class="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-gray-500"
              >
                Explore
              </p>

              <h2
                class="font-serif text-4xl font-bold tracking-tight"
              >
                Curated Collections
              </h2>

            </div>


            <NuxtLink
              to="/collections"
              class="text-sm font-medium underline underline-offset-4"
            >
              View all collections
            </NuxtLink>

          </div>


          <!-- Collection Cards -->

          <div
            class="grid gap-5 lg:grid-cols-3"
          >

            <NuxtLink
              v-for="collection in collections"
              :key="collection.id"
              to="/collections"
              class="group"
            >

              <div
                class="relative aspect-[4/3] overflow-hidden bg-gray-100"
              >

                <img
                  :src="collection.image"
                  :alt="collection.name"
                  class="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                />


                <div
                  class="absolute inset-0 bg-black/10"
                />

              </div>


              <div class="pt-5">

                <div
                  class="flex items-center justify-between"
                >

                  <h3
                    class="font-serif text-2xl font-bold"
                  >
                    {{ collection.name }}
                  </h3>

                  <span
                    class="text-xl transition-transform group-hover:translate-x-1"
                  >
                    →
                  </span>

                </div>


                <p
                  class="mt-2 text-sm leading-6 text-gray-500"
                >
                  {{ collection.description }}
                </p>

              </div>

            </NuxtLink>

          </div>

        </div>

      </section>


      <!-- =====================================================
           BOOK OF THE MONTH
      ====================================================== -->

      <section
        class="mx-auto max-w-[1600px] px-6 py-20 lg:px-12"
      >

        <div
          class="grid overflow-hidden bg-[#e9edf5] lg:grid-cols-2"
        >

          <!-- Book Image -->

          <div
            class="relative min-h-[450px] lg:min-h-[550px]"
          >

            <img
              src="https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=1200&q=85"
              alt="Book of the Month"
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
              Book of the Month
            </p>


            <h2
              class="mt-5 font-serif text-4xl font-bold leading-tight text-gray-950 sm:text-5xl"
            >
              The Elements of
              <br />
              Typographic Style
            </h2>


            <p
              class="mt-3 text-sm text-gray-500"
            >
              Robert Bringhurst
            </p>


            <div
              class="mt-5 flex items-center gap-2"
            >

              <div class="flex">

                <span
                  v-for="star in 5"
                  :key="star"
                  class="text-sm text-[#b36b00]"
                >
                  ★
                </span>

              </div>

              <span
                class="text-xs text-gray-500"
              >
                128 reviews
              </span>

            </div>


            <p
              class="mt-6 max-w-lg text-base leading-7 text-gray-600"
            >
              A classic guide to typography and the art
              of setting type. A thoughtful choice for
              designers, writers, and anyone interested in
              visual communication.
            </p>


            <div
              class="mt-8 flex items-center gap-5"
            >

              <span
                class="font-serif text-2xl font-bold"
              >
                $45.00
              </span>


              <button
                class="bg-black px-6 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
                @click="addToCart(books[0])"
              >
                Add to Cart
              </button>

            </div>


            <button
              class="mt-5 w-fit text-sm font-medium underline underline-offset-4"
              @click="viewBook(books[0])"
            >
              View Book Details
            </button>

          </div>

        </div>

      </section>


      <!-- =====================================================
           NEW ARRIVALS
      ====================================================== -->

      <section
        class="mx-auto max-w-[1600px] px-6 pb-20 lg:px-12"
      >

        <div
          class="mb-10 flex items-end justify-between"
        >

          <div>

            <p
              class="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-gray-500"
            >
              Fresh Arrivals
            </p>

            <h2
              class="font-serif text-4xl font-bold tracking-tight"
            >
              New Arrivals
            </h2>

          </div>


          <NuxtLink
            to="/browse"
            class="hidden text-sm font-medium underline underline-offset-4 md:block"
          >
            Discover more →
          </NuxtLink>

        </div>


        <div
          class="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >

          <article
            v-for="book in books.slice(4, 8)"
            :key="book.id"
            class="group cursor-pointer"
            @click="viewBook(book)"
          >

            <div
              class="aspect-[3/4] overflow-hidden bg-[#edf1f7]"
            >

              <img
                :src="book.image"
                :alt="book.title"
                class="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
              />

            </div>


            <div class="pt-5">

              <div
                class="flex items-start justify-between gap-3"
              >

                <h3
                  class="font-serif text-xl font-bold leading-tight"
                >
                  {{ book.title }}
                </h3>

                <span
                  class="shrink-0 text-sm font-semibold"
                >
                  ${{ book.price }}
                </span>

              </div>


              <p
                class="mt-2 text-sm text-gray-500"
              >
                {{ book.author }}
              </p>

            </div>

          </article>

        </div>

      </section>


      <!-- =====================================================
           RARE FINDS
      ====================================================== -->

      <section
        class="bg-black text-white"
      >

        <div
          class="mx-auto grid max-w-[1600px] lg:grid-cols-2"
        >

          <div
            class="flex flex-col justify-center px-8 py-20 sm:px-12 lg:px-20"
          >

            <p
              class="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400"
            >
              Rare Finds
            </p>


            <h2
              class="mt-5 font-serif text-4xl font-bold leading-tight sm:text-5xl"
            >
              Books with a story
              <br />
              of their own.
            </h2>


            <p
              class="mt-6 max-w-lg text-sm leading-7 text-gray-300"
            >
              Discover signed copies, limited editions,
              first editions, and other special books
              selected for collectors and passionate
              readers.
            </p>


            <div class="mt-8">

              <NuxtLink
                to="/rare-finds"
                class="inline-flex items-center gap-3 bg-white px-7 py-3.5 text-sm font-semibold text-black transition hover:bg-gray-200"
              >
                Explore Rare Finds
                <span>→</span>
              </NuxtLink>

            </div>

          </div>


          <div
            class="min-h-[400px]"
          >

            <img
              src="https://images.unsplash.com/photo-1526243741027-444d633d7365?auto=format&fit=crop&w=1200&q=85"
              alt="Rare books"
              class="h-full w-full object-cover"
            />

          </div>

        </div>

      </section>


      <!-- =====================================================
           NEWSLETTER
      ====================================================== -->

      <section
        class="bg-[#e9edf5]"
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
            Join the Lumina Books newsletter for new
            arrivals, curated collections, rare finds,
            and thoughtful recommendations.
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
         CART SUCCESS MESSAGE
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