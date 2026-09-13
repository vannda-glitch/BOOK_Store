<script setup lang="ts">
definePageMeta({
  layout: "default",
});

const API_URL = "http://localhost:8000";
const isLoggedIn = ref(false);
const books = ref<any[]>([]);
const loadingBooks = ref(false);
const booksError = ref<string | null>(null);

const { addToCart } = useCart();
const {
  wishlist,
  wishlistCount,
  loading: wishlistLoading,
  error: wishlistError,
  loadWishlist,
  removeFromWishlist,
} = useWishlist();

const readUser = () => {
  if (!import.meta.client) return null;

  const savedUser = localStorage.getItem("user");
  if (!savedUser) return null;

  try {
    return JSON.parse(savedUser);
  } catch {
    return null;
  }
};

const favoriteBooks = computed(() => {
  const bookMap = new Map(books.value.map((book) => [String(book.id), book]));
  return wishlist.value
    .map((item) => bookMap.get(String(item.bookId)))
    .filter(Boolean);
});

const loadBooks = async () => {
  loadingBooks.value = true;
  booksError.value = null;

  try {
    books.value = await $fetch<any[]>(`${API_URL}/books`);
  } catch (error) {
    console.error("Failed to load wishlist books:", error);
    booksError.value =
      "Unable to load your favorite books. Please check that JSON Server is running.";
  } finally {
    loadingBooks.value = false;
  }
};

const removeFavorite = async (bookId: string | number) => {
  await removeFromWishlist(bookId);
};

onMounted(async () => {
  isLoggedIn.value = Boolean(readUser());
  if (!isLoggedIn.value) return;

  await loadWishlist();
  if (!wishlistError.value) await loadBooks();
});
</script>

<template>
  <main
    class="min-h-screen bg-[#fafafa] px-5 py-10 text-gray-900 md:px-8 lg:px-10 lg:py-16"
  >
    <div class="mx-auto max-w-7xl">
      <div
        class="flex flex-col justify-between gap-4 border-b border-gray-200 pb-8 sm:flex-row sm:items-end"
      >
        <div>
          <p
            class="text-[10px] font-semibold uppercase tracking-[0.2em] text-primary"
          >
            Saved for later
          </p>
          <h1 class="mt-2 font-serif text-4xl font-bold text-gray-950">
            My Favorites
            <UiIcon
              name="heart"
              class="inline h-5 w-5 align-[-3px] text-primary"
            />
          </h1>
          <p v-if="isLoggedIn" class="mt-3 text-sm text-gray-500">
            {{ wishlistCount }}
            {{ wishlistCount === 1 ? "book" : "books" }} saved
          </p>
        </div>
        <NuxtLink
          to="/browse"
          class="inline-flex items-center gap-2 text-sm font-semibold text-primary transition hover:text-gray-950"
          >Browse Books <span aria-hidden="true">→</span></NuxtLink
        >
      </div>

      <div v-if="!isLoggedIn" class="mx-auto max-w-md py-24 text-center">
        <div
          class="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#eaf6f3] text-3xl text-primary"
        >
          <UiIcon name="heart" class="h-8 w-8 text-primary" />
        </div>
        <h2 class="mt-6 font-serif text-2xl font-bold text-gray-950">
          Sign in to view your favorites
        </h2>
        <p class="mt-3 text-sm text-gray-500">
          Your saved books will be waiting here when you log in.
        </p>
        <NuxtLink
          to="/auth/login"
          class="mt-7 inline-flex rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#0b5f59]"
          >Login</NuxtLink
        >
      </div>

      <div
        v-else-if="wishlistLoading || loadingBooks"
        class="grid grid-cols-1 gap-6 py-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      >
        <div
          v-for="item in 4"
          :key="item"
          class="h-110 animate-pulse rounded-2xl bg-gray-200"
        />
      </div>

      <div v-else-if="wishlistError || booksError" class="py-24 text-center">
        <p class="text-sm text-red-600">{{ wishlistError || booksError }}</p>
        <button
          type="button"
          class="mt-5 rounded-xl border border-primary px-5 py-3 text-sm font-semibold text-primary"
          @click="loadWishlist"
        >
          Try Again
        </button>
      </div>

      <div v-else-if="favoriteBooks.length === 0" class="py-24 text-center">
        <div
          class="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#eaf6f3] text-3xl text-primary"
        >
          <UiIcon name="heart" class="h-8 w-8 text-primary" />
        </div>
        <h2 class="mt-6 font-serif text-2xl font-bold text-gray-950">
          Your wishlist is empty.
        </h2>
        <p class="mt-3 text-sm text-gray-500">
          Save books you love and find them here anytime.
        </p>
        <NuxtLink
          to="/browse"
          class="mt-7 inline-flex rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#0b5f59]"
          >Browse Books</NuxtLink
        >
      </div>

      <div
        v-else
        class="grid grid-cols-1 gap-x-6 gap-y-10 py-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      >
        <article
          v-for="book in favoriteBooks"
          :key="book.id"
          class="overflow-hidden rounded-2xl border border-[#dce9e4] bg-white shadow-sm"
        >
          <NuxtLink
            :to="`/productDetail/${book.id}`"
            class="block overflow-hidden bg-[#f1f2f5]"
          >
            <img
              :src="book.image"
              :alt="book.title"
              class="h-72 w-full object-contain p-6 transition duration-500 hover:scale-105"
            />
          </NuxtLink>
          <div class="p-5">
            <div class="flex items-start justify-between gap-3">
              <div class="min-w-0">
                <NuxtLink
                  :to="`/productDetail/${book.id}`"
                  class="font-serif text-lg font-bold text-gray-950 hover:text-primary"
                  >{{ book.shortTitle || book.title }}</NuxtLink
                >
                <p class="mt-1 text-sm text-gray-500">{{ book.author }}</p>
              </div>
              <span class="shrink-0 text-sm font-bold text-gray-950"
                >${{ Number(book.price).toFixed(2) }}</span
              >
            </div>
            <div class="mt-3 flex items-center gap-2 text-xs">
              <span class="text-yellow-600"
                >{{ "★".repeat(Math.round(Number(book.rating) || 0))
                }}<span class="text-gray-300">{{
                  "★".repeat(5 - Math.round(Number(book.rating) || 0))
                }}</span></span
              >
              <span class="text-gray-400">({{ book.reviews || 0 }})</span>
            </div>
            <div class="mt-5 grid grid-cols-2 gap-2">
              <button
                type="button"
                class="rounded-xl bg-black py-3 text-xs font-semibold text-white transition hover:bg-gray-800"
                @click="addToCart(book)"
              >
                Add to Cart
              </button>
              <button
                type="button"
                class="rounded-xl border border-primary py-3 text-xs font-semibold text-primary transition hover:bg-[#edf8f5]"
                @click="removeFavorite(book.id)"
              >
                Remove
              </button>
            </div>
          </div>
        </article>
      </div>
    </div>
  </main>
</template>
