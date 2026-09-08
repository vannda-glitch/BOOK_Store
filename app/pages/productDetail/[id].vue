<script setup lang="ts">

definePageMeta({
  layout: 'default'
})

const route = useRoute()
const API_URL = 'http://localhost:8000'

const { addToCart, loadCart } = useCart()

const book = ref<any | null>(null)
const loading = ref(true)
const error = ref(false)
const quantity = ref(1)
const relatedBooks = ref<any[]>([])
const showCartMessage = ref(false)

const getBook = async () => {
  loading.value = true
  error.value = false

  try {
    const id = String(route.params.id)
    const response = await $fetch<any>(`${API_URL}/books/${id}`)
    book.value = response
  } catch (err) {
    console.error('Failed to fetch book:', err)
    error.value = true
    book.value = null
  } finally {
    loading.value = false
  }
}

const getRelatedBooks = async () => {
  if (!book.value) return

  try {
    const response = await $fetch<any[]>(`${API_URL}/books`)
    relatedBooks.value = response
      .filter(item => String(item.id) !== String(book.value.id))
      .slice(0, 3)
  } catch (err) {
    console.error('Failed to fetch related books:', err)
  }
}

const increaseQuantity = () => {
  quantity.value++
}

const decreaseQuantity = () => {
  if (quantity.value > 1) {
    quantity.value--
  }
}

const handleAddToCart = () => {
  if (!book.value) return
  for (let i = 0; i < quantity.value; i++) {
    addToCart(book.value)
  }
  showCartMessage.value = true
  setTimeout(() => {
    showCartMessage.value = false
  }, 2000)
}

const ratingStars = computed(() => {
  if (!book.value) return 0
  return Math.round(Number(book.value.rating))
})

onMounted(async () => {
  loadCart()
  await getBook()
  if (book.value) {
    await getRelatedBooks()
  }
})

</script>


<template>

  <div class="min-h-screen bg-[#fafafa] text-gray-900">

    <!-- Loading -->
    <main
      v-if="loading"
      class="mx-auto max-w-300 px-5 py-10 md:px-8 lg:px-10"
    >
      <div class="grid animate-pulse grid-cols-1 gap-12 lg:grid-cols-2">
        <div class="h-130 rounded-3xl bg-gray-200"></div>
        <div class="flex flex-col justify-center">
          <div class="h-4 w-24 rounded bg-gray-200"></div>
          <div class="mt-5 h-12 w-3/4 rounded bg-gray-200"></div>
          <div class="mt-4 h-5 w-1/3 rounded bg-gray-200"></div>
          <div class="mt-8 h-5 w-full rounded bg-gray-200"></div>
          <div class="mt-3 h-5 w-5/6 rounded bg-gray-200"></div>
          <div class="mt-10 h-12 w-full rounded bg-gray-200"></div>
        </div>
      </div>
    </main>


    <!-- Error / Not Found -->
    <main
      v-else-if="error || !book"
      class="mx-auto flex min-h-[70vh] max-w-300 items-center justify-center px-5"
    >
      <div class="max-w-md text-center">
        <div class="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-7 w-7 text-gray-400">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m0 3.75h.007M10.29 3.86 2.82 17.25a1.5 1.5 0 0 0 1.3 2.25h15.76a1.5 1.5 0 0 0 1.3-2.25L13.71 3.86a1.5 1.5 0 0 0-2.42 0Z" />
          </svg>
        </div>
        <h1 class="mt-5 font-serif text-3xl font-bold text-gray-950">Book not found</h1>
        <p class="mt-3 text-sm text-gray-500">The book you're looking for doesn't exist or may have been removed.</p>
        <NuxtLink to="/browse" class="mt-7 inline-flex items-center gap-2 rounded-xl bg-black px-6 py-3 text-xs font-semibold text-white transition hover:bg-gray-800">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor" class="h-4 w-4">
            <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
          </svg>
          Back to Browse
        </NuxtLink>
      </div>
    </main>


    <!-- Product Detail -->
    <main
      v-else
      class="mx-auto max-w-300 px-5 py-6 md:px-8 lg:px-10 lg:py-10"
    >

      <!-- Breadcrumb -->
      <nav class="mb-8 flex items-center gap-2 text-[10px] font-medium text-gray-400">
        <NuxtLink to="/" class="transition hover:text-black">Home</NuxtLink>
        <span>/</span>
        <NuxtLink to="/browse" class="transition hover:text-black">Browse</NuxtLink>
        <span>/</span>
        <span class="truncate text-gray-700">{{ book.shortTitle || book.title }}</span>
      </nav>


      <!-- Product Section -->
      <section class="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">

        <!-- Image -->
        <div>
          <div class="group relative overflow-hidden rounded-3xl border border-gray-100 bg-[#f1f2f5] shadow-sm">
            <span v-if="Number(book.rating) >= 4.8" class="absolute left-5 top-5 z-10 rounded-full bg-white/95 px-4 py-2 text-[9px] font-semibold uppercase tracking-wider text-gray-800 shadow-sm backdrop-blur">
              Highly Rated
            </span>
            <div class="flex h-110 items-center justify-center p-10 sm:h-130">
              <img :src="book.image" :alt="book.title" class="h-full w-full object-contain transition duration-700 ease-out group-hover:scale-105" />
            </div>
          </div>

          <!-- Info Cards -->
          <div class="mt-4 grid grid-cols-3 gap-3">
            <div class="rounded-xl border border-gray-200 bg-white p-4 text-center">
              <p class="text-[9px] uppercase tracking-wider text-gray-400">Format</p>
              <p class="mt-1 text-xs font-semibold text-gray-900">{{ book.format || 'N/A' }}</p>
            </div>
            <div class="rounded-xl border border-gray-200 bg-white p-4 text-center">
              <p class="text-[9px] uppercase tracking-wider text-gray-400">Genre</p>
              <p class="mt-1 truncate text-xs font-semibold text-gray-900">{{ book.genre || 'N/A' }}</p>
            </div>
            <div class="rounded-xl border border-gray-200 bg-white p-4 text-center">
              <p class="text-[9px] uppercase tracking-wider text-gray-400">Rating</p>
              <p class="mt-1 text-xs font-semibold text-gray-900">{{ book.rating }}/5</p>
            </div>
          </div>
        </div>


        <!-- Product Information -->
        <div class="flex flex-col justify-center">

          <!-- Genre Tags -->
          <div class="flex flex-wrap items-center gap-2">
            <span v-if="book.genre" class="rounded-full bg-gray-100 px-3 py-1.5 text-[9px] font-semibold uppercase tracking-wider text-gray-600">
              {{ book.genre }}
            </span>
            <span v-if="book.format" class="rounded-full bg-gray-100 px-3 py-1.5 text-[9px] font-semibold uppercase tracking-wider text-gray-600">
              {{ book.format }}
            </span>
          </div>

          <!-- Title -->
          <h1 class="mt-5 max-w-xl font-serif text-4xl font-bold leading-tight tracking-tight text-gray-950 sm:text-5xl">
            {{ book.title }}
          </h1>

          <!-- Author -->
          <p class="mt-4 text-sm text-gray-500">
            by <span class="font-semibold text-gray-800">{{ book.author }}</span>
          </p>

          <!-- Rating -->
          <div class="mt-6 flex items-center gap-3">
            <div class="flex items-center gap-0.5 text-sm">
              <span v-for="star in 5" :key="star" :class="star <= ratingStars ? 'text-gray-900' : 'text-gray-300'">★</span>
            </div>
            <span class="text-xs font-semibold text-gray-800">{{ book.rating }}</span>
            <span class="text-xs text-gray-300">•</span>
            <span class="text-xs text-gray-400">{{ book.reviews }} reviews</span>
          </div>

          <!-- Divider -->
          <div class="my-7 border-t border-gray-200"></div>

          <!-- Price -->
          <div>
            <p class="text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-400">Price</p>
            <div class="mt-2 flex items-end gap-3">
              <span class="text-3xl font-bold tracking-tight text-gray-950">${{ Number(book.price).toFixed(2) }}</span>
              <span class="mb-1 text-xs text-gray-400">USD</span>
            </div>
          </div>

          <!-- Quantity + Cart -->
          <div class="mt-8">
            <div class="flex flex-col gap-3 sm:flex-row">
              <!-- Quantity -->
              <div class="flex h-13 items-center rounded-xl border border-gray-200 bg-white">
                <button type="button" class="flex h-full w-12 items-center justify-center text-gray-500 transition hover:text-black" @click="decreaseQuantity">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor" class="h-4 w-4">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M5 12h14" />
                  </svg>
                </button>
                <span class="w-8 text-center text-sm font-semibold">{{ quantity }}</span>
                <button type="button" class="flex h-full w-12 items-center justify-center text-gray-500 transition hover:text-black" @click="increaseQuantity">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor" class="h-4 w-4">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 5v14m-7-7h14" />
                  </svg>
                </button>
              </div>

              <!-- Add To Cart -->
              <button type="button" class="flex h-13 flex-1 items-center justify-center gap-2 rounded-xl bg-black px-6 text-xs font-semibold text-white transition-all duration-200 hover:bg-gray-800 active:scale-[0.98]" @click.prevent="handleAddToCart">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor" class="h-4 w-4">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M2.75 3.75h2.1l1.55 11.1a2 2 0 0 0 1.98 1.72h8.9a2 2 0 0 0 1.96-1.6L20.5 7H5.2" />
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 20.25h.01M17 20.25h.01" />
                </svg>
                Add to Cart
              </button>
            </div>
            <p class="mt-3 text-center text-[10px] text-gray-400 sm:text-left">
              Quantity: <span class="font-semibold text-gray-600">{{ quantity }}</span>
            </p>
          </div>

          <!-- Product Details -->
          <div class="mt-10 rounded-2xl border border-gray-200 bg-white p-5">
            <h2 class="text-xs font-semibold uppercase tracking-wider text-gray-950">Product Details</h2>
            <div class="mt-5 space-y-4">
              <div class="flex items-center justify-between border-b border-gray-100 pb-4">
                <span class="text-xs text-gray-400">Author</span>
                <span class="text-xs font-semibold text-gray-800">{{ book.author }}</span>
              </div>
              <div class="flex items-center justify-between border-b border-gray-100 pb-4">
                <span class="text-xs text-gray-400">Genre</span>
                <span class="text-xs font-semibold text-gray-800">{{ book.genre }}</span>
              </div>
              <div class="flex items-center justify-between border-b border-gray-100 pb-4">
                <span class="text-xs text-gray-400">Format</span>
                <span class="text-xs font-semibold text-gray-800">{{ book.format }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-xs text-gray-400">Reviews</span>
                <span class="text-xs font-semibold text-gray-800">{{ book.reviews }}</span>
              </div>
            </div>
          </div>

        </div>
      </section>


      <!-- Description -->
      <section class="mt-20 border-t border-gray-200 pt-12">
        <div class="max-w-3xl">
          <p class="text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-400">About this book</p>
          <h2 class="mt-2 font-serif text-3xl font-bold text-gray-950">{{ book.shortTitle || book.title }}</h2>
          <p class="mt-5 text-sm leading-7 text-gray-500">
            Discover <span class="font-medium text-gray-700">{{ book.title }}</span> by <span class="font-medium text-gray-700">{{ book.author }}</span>.
            This book is part of our <span class="font-medium text-gray-700">{{ book.genre }}</span> collection and is available in <span class="font-medium text-gray-700">{{ book.format }}</span> format.
          </p>
        </div>
      </section>


      <!-- Related Books -->
      <section v-if="relatedBooks.length" class="mt-20 border-t border-gray-200 pt-12">
        <div class="flex items-end justify-between">
          <div>
            <p class="text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-400">You may also like</p>
            <h2 class="mt-2 font-serif text-3xl font-bold text-gray-950">Related Books</h2>
          </div>
          <NuxtLink to="/browse" class="hidden items-center gap-2 text-xs font-semibold text-gray-500 transition hover:text-black sm:flex">
            View all
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.7" stroke="currentColor" class="h-4 w-4">
              <path stroke-linecap="round" stroke-linejoin="round" d="M5 12h14m-6-6 6 6-6 6" />
            </svg>
          </NuxtLink>
        </div>

        <div class="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <article v-for="related in relatedBooks" :key="related.id" class="group min-w-0">
            <div class="overflow-hidden rounded-2xl border border-gray-100 bg-[#f1f2f5]">
              <NuxtLink :to="`/productDetail/${related.id}`">
                <div class="flex h-80 items-center justify-center p-7">
                  <img :src="related.image" :alt="related.title" loading="lazy" class="h-full w-full object-contain transition duration-500 group-hover:scale-105" />
                </div>
              </NuxtLink>
            </div>
            <div class="pt-4">
              <div class="flex items-start justify-between gap-4">
                <div class="min-w-0">
                  <NuxtLink :to="`/productDetail/${related.id}`">
                    <h3 class="font-serif text-lg font-bold leading-tight text-gray-950 transition group-hover:text-gray-600">
                      {{ related.shortTitle || related.title }}
                    </h3>
                  </NuxtLink>
                  <p class="mt-1.5 text-xs text-gray-500">{{ related.author }}</p>
                </div>
                <span class="shrink-0 text-sm font-bold text-gray-950">${{ Number(related.price).toFixed(2) }}</span>
              </div>
              <div class="mt-3 flex items-center gap-2">
                <div class="text-[11px]">
                  <span v-for="star in 5" :key="star" :class="star <= Math.round(Number(related.rating)) ? 'text-gray-900' : 'text-gray-300'">★</span>
                </div>
                <span class="text-[10px] text-gray-400">{{ related.rating }}</span>
              </div>
              <button type="button" class="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-black px-4 py-3 text-xs font-semibold text-white transition hover:bg-gray-800 active:scale-[0.98]" @click.prevent="addToCart(related)">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor" class="h-4 w-4">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M2.75 3.75h2.1l1.55 11.1a2 2 0 0 0 1.98 1.72h8.9a2 2 0 0 0 1.96-1.6L20.5 7H5.2" />
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 20.25h.01M17 20.25h.01" />
                </svg>
                Add to Cart
              </button>
            </div>
          </article>
        </div>
      </section>


      <!-- Back to Browse -->
      <div class="mt-20 flex justify-center border-t border-gray-200 pt-8">
        <NuxtLink to="/browse" class="flex items-center gap-2 text-xs font-medium text-gray-500 transition hover:text-black">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.7" stroke="currentColor" class="h-4 w-4">
            <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
          </svg>
          Back to Browse
        </NuxtLink>
      </div>

    </main>


    <!-- Cart Success Message -->
    <Transition enter-active-class="transition duration-300" enter-from-class="translate-y-4 opacity-0" enter-to-class="translate-y-0 opacity-100" leave-active-class="transition duration-300" leave-from-class="translate-y-0 opacity-100" leave-to-class="translate-y-4 opacity-0">
      <div v-if="showCartMessage" class="fixed bottom-6 right-6 z-[100] flex items-center gap-3 bg-black px-5 py-4 text-sm font-medium text-white shadow-xl">
        <span class="flex h-6 w-6 items-center justify-center rounded-full bg-white text-black">✓</span>
        Added to your cart
      </div>
    </Transition>

  </div>

</template>
