<script setup lang="ts">
import catalog from '~/api/db.json'

const route = useRoute()

const product = ref<any>(null)
const loading = ref(true)
const errorMessage = ref('')

const selectedId = computed(() => {
  const directId = route.params?.id ?? route.query.id ?? route.query.bookId
  return String(directId ?? '1')
})

const fetchProduct = async () => {
  loading.value = true
  errorMessage.value = ''

  try {
    const books = catalog.books

    const match = books.find((item: any) => String(item.id) === selectedId.value)
    product.value = match ?? books[0] ?? null

    if (!product.value) {
      errorMessage.value = 'No product found for this selection.'
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
  () => {
    fetchProduct()
  },
  { immediate: true }
)
</script>

<template>
  <section class="min-h-screen bg-[#f8f9fc] px-4 py-12 text-gray-900 sm:px-6 lg:px-8">
    <div v-if="loading" class="mx-auto max-w-6xl rounded-2xl border border-gray-200 bg-white p-8 text-sm text-gray-500 shadow-sm">
      Loading product details...
    </div>

    <div v-else-if="!product" class="mx-auto max-w-4xl rounded-2xl border border-dashed border-gray-300 bg-white p-12 text-center shadow-sm">
      <h1 class="font-serif text-3xl font-bold text-gray-950">Product not found</h1>
      <p class="mt-3 text-sm text-gray-600">{{ errorMessage || 'Try another book from the catalog.' }}</p>
      <NuxtLink to="/browse" class="mt-6 inline-block rounded-lg bg-black px-5 py-3 text-sm font-medium text-white transition hover:bg-gray-800">
        Back to browse
      </NuxtLink>
    </div>

    <div v-else class="mx-auto max-w-6xl">
      <div class="mb-6 flex items-center gap-2 text-sm text-gray-500">
        <NuxtLink to="/" class="transition hover:text-black">Home</NuxtLink>
        <span>›</span>
        <NuxtLink to="/browse" class="transition hover:text-black">Browse</NuxtLink>
        <span>›</span>
        <span class="text-gray-800">{{ product.title }}</span>
      </div>

      <div class="grid gap-10 overflow-hidden rounded-[28px] border border-gray-200 bg-white p-6 shadow-[0_20px_60px_rgba(0,0,0,0.06)] md:grid-cols-2 md:p-10">
        <div class="overflow-hidden rounded-2xl bg-[#edf1f7]">
          <img :src="product.image" :alt="product.title" class="h-full w-full object-cover" />
        </div>

        <div class="flex flex-col justify-center">
          <p class="text-[11px] font-semibold uppercase tracking-[0.22em] text-gray-500">Book detail</p>
          <h1 class="mt-3 font-serif text-4xl font-bold tracking-tight text-gray-950 md:text-5xl">{{ product.title }}</h1>
          <p class="mt-3 text-lg text-gray-600">by {{ product.author }}</p>

          <div class="mt-5 flex flex-wrap items-center gap-3 text-sm text-gray-600">
            <span class="rounded-full bg-black px-3 py-1 text-white">★ {{ product.rating }}</span>
            <span>({{ product.reviews }} reviews)</span>
            <span class="rounded-full border border-gray-300 bg-gray-100 px-3 py-1 text-gray-700">{{ product.format }}</span>
          </div>

          <div class="mt-6 flex items-baseline gap-3">
            <span class="text-4xl font-black text-gray-950">${{ Number(product.price).toFixed(2) }}</span>
            <span class="text-sm text-gray-500">Free shipping over $100</span>
          </div>

          <p class="mt-6 max-w-xl text-base leading-7 text-gray-600">
            Discover a thoughtfully curated title that blends visual elegance, timeless ideas, and a rich reading experience for curious minds.
          </p>

          <div class="mt-8 flex flex-wrap gap-4">
            <button class="rounded-lg bg-black px-6 py-3 text-sm font-semibold text-white transition hover:bg-gray-800">
              Add to cart
            </button>
            <NuxtLink to="/browse" class="rounded-lg border border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-700 transition hover:border-gray-400 hover:text-black">
              Continue shopping
            </NuxtLink>
          </div>

          <div class="mt-8 grid gap-4 border-t border-gray-200 pt-6 sm:grid-cols-3">
            <div>
              <p class="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">Genre</p>
              <p class="mt-2 text-sm font-medium text-gray-800">{{ product.genre || 'General' }}</p>
            </div>
            <div>
              <p class="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">Format</p>
              <p class="mt-2 text-sm font-medium text-gray-800">{{ product.format }}</p>
            </div>
            <div>
              <p class="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">Delivery</p>
              <p class="mt-2 text-sm font-medium text-gray-800">2–4 business days</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
