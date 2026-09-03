<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import catalog from '~/api/db.json'

const route = useRoute()
const quantity = ref(1)

// const fallbackBooks = [
//   { id: '1', title: 'The Elements of Typographic Style', author: 'Robert Bringhurst', price: 4, rating: 5, reviews: 128, genre: 'Typography', format: 'Hardcover', image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=500&q=80' },
//   { id: '2', title: 'Grid Systems in Graphic Design', author: 'Josef Müller-Brockmann', price: 65, rating: 5, reviews: 342, genre: 'Design', format: 'Paperback', image: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=500&q=80' },
//   { id: '3', title: 'The Visual Display of Quantitative Information', author: 'Edward R. Tufte', price: 52, rating: 4, reviews: 89, genre: 'Design', format: 'Hardcover', image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=500&q=80' },
//   { id: '4', title: 'Thinking with Type', author: 'Ellen Lupton', price: 38, rating: 5, reviews: 215, genre: 'Typography', format: 'Paperback', image: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=500&q=80' },
//   { id: '5', title: 'The Story of Art', author: 'E. H. Gombrich', price: 72, rating: 5, reviews: 421, genre: 'Art History', format: 'Hardcover', image: 'https://images.unsplash.com/photo-1541963463532-d68292c34b19?auto=format&fit=crop&w=500&q=80' },
//   { id: '6', title: 'Architectural Drawing', author: 'David Dernie', price: 105, rating: 4, reviews: 74, genre: 'Architecture', format: 'Special Edition', image: 'https://images.unsplash.com/photo-1531058020387-3be344556be6?auto=format&fit=crop&w=500&q=80' }
// ]

const product = ref(null)
const loading = ref(true)
const errorMessage = ref('')

const routeId = computed(() => String(route.params?.id ?? route.query?.id ?? route.query?.bookId ?? '1'))

const fetchProduct = async () => {
  loading.value = true
  errorMessage.value = ''

  try {
    const books = catalog.books

    product.value = books.find((item) => String(item.id) === routeId.value) ?? books[0] ?? null

    if (!product.value) {
      errorMessage.value = 'This book is not available in the catalog.'
    }
  } catch (error) {
    console.error('Failed to load product:', error)
    product.value = null
    errorMessage.value = 'Unable to load product details.'
  } finally {
    loading.value = false
  }
}

watch(
  () => [route.params.id, route.query.id, route.query.bookId],
  () => fetchProduct(),
  { immediate: true }
)
</script>

<template>
  <div class="min-h-screen bg-white text-black antialiased">
    <header class="sticky top-0 z-50 border-b-2 border-black bg-white">
      <div class="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <NuxtLink to="/" class="font-serif text-2xl font-black uppercase tracking-tight">
          Monochrome <span class="bg-black px-1 text-white">Press</span>
        </NuxtLink>
        <NuxtLink to="/" class="flex items-center gap-2 text-sm font-bold uppercase tracking-wider hover:underline">
          ← Back to Catalog
        </NuxtLink>
      </div>
    </header>

    <main class="mx-auto max-w-7xl px-6 py-12">
      <div v-if="loading" class="border-2 border-black bg-neutral-100 p-8 text-center text-sm font-medium uppercase tracking-widest text-neutral-700">
        Loading product...
      </div>

      <div v-else-if="!product" class="border-2 border-black bg-white p-8 py-24 text-center">
        <h1 class="mb-4 font-serif text-4xl font-bold">404 — Book Not Found</h1>
        <p class="mb-6 text-gray-600">{{ errorMessage || 'The publication you are looking for does not exist in our registry.' }}</p>
        <NuxtLink to="/" class="inline-block border border-black bg-black px-6 py-3 text-sm font-bold uppercase tracking-widest text-white transition-colors hover:bg-white hover:text-black">
          Return to Store
        </NuxtLink>
      </div>

      <div v-else class="grid grid-cols-1 items-start gap-12 lg:grid-cols-12">
        <div class="lg:col-span-6">
          <div class="relative flex items-center justify-center border-2 border-black bg-neutral-100 p-8">
            <span class="absolute left-4 top-4 border border-black bg-white px-3 py-1 text-xs font-bold uppercase tracking-widest">
              {{ product.genre }}
            </span>
            <img :src="product.image" :alt="product.title" class="h-125 w-full max-w-md border border-black object-cover grayscale contrast-125 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]" />
          </div>
        </div>

        <div class="flex flex-col gap-6 lg:col-span-6">
          <div class="border-b-2 border-black pb-6">
            <span class="mb-2 block text-xs font-bold uppercase tracking-widest text-neutral-500">
              Catalog #00{{ product.id }}
            </span>
            <h1 class="mb-3 font-serif text-4xl font-black leading-tight lg:text-5xl">
              {{ product.title }}
            </h1>
            <p class="text-lg font-mono text-neutral-700">By {{ product.author }}</p>
          </div>

          <div class="grid grid-cols-3 gap-4 border-b-2 border-black py-2">
            <div class="border-r border-neutral-300 pr-2">
              <span class="block text-xs font-mono uppercase text-neutral-500">Format</span>
              <span class="text-sm font-bold uppercase">{{ product.format }}</span>
            </div>
            <div class="border-r border-neutral-300 pr-2">
              <span class="block text-xs font-mono uppercase text-neutral-500">Rating</span>
              <span class="text-sm font-bold">★ {{ product.rating }}.0 / 5.0</span>
            </div>
            <div>
              <span class="block text-xs font-mono uppercase text-neutral-500">Reviews</span>
              <span class="text-sm font-bold">{{ product.reviews }} Verified</span>
            </div>
          </div>

          <div class="flex items-baseline justify-between pt-2">
            <div>
              <span class="block text-xs font-mono uppercase text-neutral-500">Price</span>
              <span class="font-mono text-4xl font-bold">${{ Number(product.price).toFixed(2) }}</span>
            </div>
            <div class="flex items-center border-2 border-black">
              <button @click="quantity = Math.max(1, quantity - 1)" class="px-3 py-2 text-lg font-bold transition-colors hover:bg-black hover:text-white">-</button>
              <span class="px-4 py-2 font-mono font-bold">{{ quantity }}</span>
              <button @click="quantity++" class="px-3 py-2 text-lg font-bold transition-colors hover:bg-black hover:text-white">+</button>
            </div>
          </div>

          <div class="flex flex-col gap-3 pt-4">
            <button class="w-full border-2 border-black bg-black py-4 text-sm font-bold uppercase tracking-widest text-white shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] transition-all hover:bg-white hover:text-black hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              Add to Cart — ${{ (Number(product.price) * quantity).toFixed(2) }}
            </button>
            <button class="w-full border-2 border-black bg-white py-3 text-sm font-bold uppercase tracking-widest text-black transition-colors hover:bg-neutral-100">
              Save to Wishlist
            </button>
          </div>

          <div class="mt-6 divide-y-2 divide-black border-2 border-black">
            <details class="group cursor-pointer p-4" open>
              <summary class="flex list-none items-center justify-between text-sm font-bold uppercase">
                <span>Shipping & Delivery</span>
                <span class="transition-transform group-open:rotate-180">↓</span>
              </summary>
              <p class="mt-3 text-sm leading-relaxed font-mono text-neutral-600">
                Standard delivery: 3–5 business days. Ships in archival-grade protective monochrome wrapping.
              </p>
            </details>

            <details class="group cursor-pointer p-4">
              <summary class="flex list-none items-center justify-between text-sm font-bold uppercase">
                <span>Binding & Quality Guarantee</span>
                <span class="transition-transform group-open:rotate-180">↓</span>
              </summary>
              <p class="mt-3 text-sm leading-relaxed font-mono text-neutral-600">
                Printed on acid-free paper. Thread-sewn binding for durability and flat opening.
              </p>
            </details>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>
