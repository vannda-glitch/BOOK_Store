<script setup lang="ts">
const route = useRoute();

// ========================================
// API
// ========================================

const API_URL = "http://localhost:8000";

// ========================================
// Books
// ========================================

const books = ref<any[]>([]);
const categoryRecords = ref<any[]>([]);

// ========================================
// Filter State
// ========================================

const selectedCategory = ref("All");
const selectedPrice = ref("All");
const selectedFormat = ref("All");
const sortBy = ref("Relevance");

// ========================================
// Search
// ========================================

const searchQuery = ref("");

const normalizeSearchText = (value: unknown) => {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
};

// ========================================

// Cart
// ========================================

const { addToCart } = useCart();
const { isFavorite, toggleWishlist, error: wishlistError } = useWishlist();
const cartMessage = ref("");

const handleAddToCart = async (book: any) => {
  const result = await addToCart(book);
  cartMessage.value = result?.success
    ? "Added to cart."
    : result?.message || "Unable to add this book.";
};

// ========================================
// Filter Options
// ========================================

const categories = computed(() => [
  { name: "All", count: books.value.length },
  ...categoryRecords.value.map((category) => ({
    name: category.name,
    count: books.value.filter(
      (book) =>
        normalizeSearchText(book.category) ===
        normalizeSearchText(category.name),
    ).length,
  })),
]);

const priceRanges = ["All", "Under $50", "$50 - $100", "Over $100"];

const formats = ["All", "Hardcover", "Paperback", "Digital"];

// ========================================
// Get Books
// ========================================

const getAllBooks = async () => {
  try {
    const response = await $fetch<any[]>(`${API_URL}/books`);

    books.value = response;
  } catch (error) {
    console.error("Failed to fetch books:", error);
  }
};

const getAllCategories = async () => {
  try {
    categoryRecords.value = await $fetch<any[]>(`${API_URL}/categories`);
  } catch (error) {
    console.error("Failed to fetch categories:", error);
  }
};

// ========================================
// Search From Navbar
// ========================================

watch(
  () => route.query.search,

  (value) => {
    searchQuery.value = String(value || "");
  },

  {
    immediate: true,
  },
);

watch(
  () => route.query.category,

  (value) => {
    selectedCategory.value = String(value || "All");
  },

  {
    immediate: true,
  },
);

// ========================================
// FILTER BOOKS
// ========================================

const filteredBooks = computed(() => {
  const keyword = normalizeSearchText(searchQuery.value);
  const searchTerms = keyword.split(/\s+/).filter(Boolean);

  let result = books.value.filter((book) => {
    // ====================================
    // SEARCH
    // ====================================

    const title = normalizeSearchText(book.title);
    const shortTitle = normalizeSearchText(book.shortTitle);
    const author = normalizeSearchText(book.author);
    const category = normalizeSearchText(book.category);
    const format = normalizeSearchText(book.format);
    const searchableText = `${title} ${shortTitle} ${author} ${category} ${format}`;

    const matchesSearch =
      searchTerms.length === 0 ||
      searchTerms.every((term) => searchableText.includes(term));

    // ====================================
    // CATEGORY
    // ====================================

    const matchesCategory =
      selectedCategory.value === "All" ||
      String(book.category || "").toLowerCase() ===
        selectedCategory.value.toLowerCase();

    // ====================================
    // PRICE
    // ====================================

    const price = Number(book.price);

    let matchesPrice = true;

    if (selectedPrice.value === "Under $50") {
      matchesPrice = price < 50;
    } else if (selectedPrice.value === "$50 - $100") {
      matchesPrice = price >= 50 && price <= 100;
    } else if (selectedPrice.value === "Over $100") {
      matchesPrice = price > 100;
    }

    // ====================================
    // FORMAT
    // ====================================

    const matchesFormat =
      selectedFormat.value === "All" ||
      String(book.format || "").toLowerCase() ===
        selectedFormat.value.toLowerCase();

    // ====================================
    // RETURN
    // ====================================

    return matchesSearch && matchesCategory && matchesPrice && matchesFormat;
  });

  // ====================================
  // SORT
  // ====================================

  if (sortBy.value === "Price: Low to High") {
    result.sort((a, b) => Number(a.price) - Number(b.price));
  } else if (sortBy.value === "Price: High to Low") {
    result.sort((a, b) => Number(b.price) - Number(a.price));
  } else if (sortBy.value === "Rating") {
    result.sort((a, b) => Number(b.rating) - Number(a.rating));
  } else if (keyword) {
    result.sort((a, b) => {
      const score = (book: any) => {
        const title = normalizeSearchText(book.title);
        const shortTitle = normalizeSearchText(book.shortTitle);
        const author = normalizeSearchText(book.author);
        const category = normalizeSearchText(book.category);
        let total = 0;

        for (const term of searchTerms) {
          if (title.startsWith(term) || shortTitle.startsWith(term)) total += 5;
          else if (title.includes(term) || shortTitle.includes(term))
            total += 4;
          else if (author.includes(term)) total += 3;
          else if (category.includes(term)) total += 1;
        }

        return total;
      };

      return score(b) - score(a);
    });
  }

  return result;
});

// ========================================
// Select Category
// ========================================

const selectCategory = (category: string) => {
  selectedCategory.value = category;
};

// ========================================
// Select Price
// ========================================

const selectPrice = (price: string) => {
  selectedPrice.value = price;
};

// ========================================
// Select Format
// ========================================

const selectFormat = (format: string) => {
  selectedFormat.value = format;
};

// ========================================
// Reset Filters
// ========================================

const resetFilters = () => {
  selectedCategory.value = "All";

  selectedPrice.value = "All";

  selectedFormat.value = "All";

  sortBy.value = "Relevance";

  searchQuery.value = "";

  navigateTo("/browse");
};

// ========================================
// Load
// ========================================

onMounted(() => {
  Promise.all([getAllBooks(), getAllCategories()]);
});

// ========================================
// Scroll to Top
// ========================================

const scrollToTop = () => {
  if (import.meta.client) {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }
};
</script>

<template>
  <div class="min-h-screen bg-[#fafafa] text-gray-900">
    <main class="mx-auto max-w-300 px-5 py-4 md:px-8 lg:px-10 lg:py-2">
      <!-- ===================================================== -->
      <!-- SEARCH / SORT TOOLBAR -->
      <!-- ===================================================== -->

      <div
        class="mb-8 flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between"
      >
        <!-- Search Information -->

        <div class="flex min-w-0 items-center gap-3">
          <div
            class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-100"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.6"
              stroke="currentColor"
              class="h-5 w-5 text-gray-600"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="m21 21-4.35-4.35m2.1-5.4a7.5 7.5 0 1 1-15 0 7.5 7.5 0 0 1 15 0Z"
              />
            </svg>
          </div>

          <div class="min-w-0">
            <p
              class="text-[10px] font-semibold uppercase tracking-wider text-gray-400"
            >
              Search
            </p>

            <p
              v-if="searchQuery"
              class="truncate text-sm font-medium text-gray-950"
            >
              "{{ searchQuery }}"
            </p>

            <p v-else class="text-sm font-medium text-gray-700">All books</p>
          </div>
        </div>

        <!-- Sort -->

        <div class="flex items-center gap-3">
          <label for="sort" class="shrink-0 text-xs font-medium text-gray-500">
            Sort by
          </label>

          <div class="relative">
            <select
              id="sort"
              v-model="sortBy"
              class="h-10 appearance-none rounded-xl border border-gray-200 bg-gray-50 px-4 pr-10 text-xs font-medium text-gray-800 outline-none transition focus:border-black focus:bg-white"
            >
              <option value="Relevance">Relevance</option>

              <option value="Price: Low to High">Price: Low to High</option>

              <option value="Price: High to Low">Price: High to Low</option>

              <option value="Rating">Rating</option>
            </select>

            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.7"
              stroke="currentColor"
              class="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="m6 9 6 6 6-6"
              />
            </svg>
          </div>
        </div>
      </div>

      <!-- ===================================================== -->
      <!-- ACTIVE FILTERS -->
      <!-- ===================================================== -->

      <div
        v-if="
          selectedCategory !== 'All' ||
          selectedPrice !== 'All' ||
          selectedFormat !== 'All' ||
          searchQuery
        "
        class="mb-8 flex flex-wrap items-center gap-2"
      >
        <span class="mr-1 text-xs font-medium text-gray-400">
          Active filters:
        </span>

        <!-- Search -->

        <button
          v-if="searchQuery"
          type="button"
          class="group flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-[10px] font-medium text-gray-700 shadow-sm"
          @click="
            searchQuery = '';
            navigateTo('/browse');
          "
        >
          Search:
          <span class="font-semibold text-gray-950">
            {{ searchQuery }}
          </span>

          <span class="text-gray-400 group-hover:text-black"> × </span>
        </button>

        <!-- Category -->

        <button
          v-if="selectedCategory !== 'All'"
          type="button"
          class="group flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-[10px] font-medium text-gray-700 shadow-sm"
          @click="selectedCategory = 'All'"
        >
          {{ selectedCategory }}

          <span class="text-gray-400 group-hover:text-black"> × </span>
        </button>

        <!-- Price -->

        <button
          v-if="selectedPrice !== 'All'"
          type="button"
          class="group flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-[10px] font-medium text-gray-700 shadow-sm"
          @click="selectedPrice = 'All'"
        >
          {{ selectedPrice }}

          <span class="text-gray-400 group-hover:text-black"> × </span>
        </button>

        <!-- Format -->

        <button
          v-if="selectedFormat !== 'All'"
          type="button"
          class="group flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-[10px] font-medium text-gray-700 shadow-sm"
          @click="selectedFormat = 'All'"
        >
          {{ selectedFormat }}

          <span class="text-gray-400 group-hover:text-black"> × </span>
        </button>

        <!-- Reset -->

        <button
          type="button"
          class="ml-1 text-[10px] font-semibold text-gray-500 underline underline-offset-4 transition hover:text-black"
          @click="resetFilters"
        >
          Clear all
        </button>
      </div>

      <!-- ===================================================== -->
      <!-- CONTENT -->
      <!-- ===================================================== -->

      <div class="grid grid-cols-1 gap-10 lg:grid-cols-[240px_minmax(0,1fr)]">
        <!-- =================================================== -->
        <!-- SIDEBAR -->
        <!-- =================================================== -->

        <aside
          class="h-fit rounded-2xl border border-gray-200 bg-white p-5 shadow-sm lg:sticky lg:top-24"
        >
          <!-- Sidebar Header -->

          <div class="mb-6 flex items-center justify-between">
            <div>
              <p
                class="text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-400"
              >
                Refine
              </p>

              <h2 class="mt-1 font-serif text-xl font-bold text-gray-950">
                Filters
              </h2>
            </div>

            <button
              v-if="
                selectedCategory !== 'All' ||
                selectedPrice !== 'All' ||
                selectedFormat !== 'All'
              "
              type="button"
              class="text-[10px] font-medium text-gray-400 underline underline-offset-4 hover:text-black"
              @click="resetFilters"
            >
              Reset
            </button>
          </div>

          <!-- ================================================= -->
          <!-- CATEGORY -->
          <!-- ================================================= -->

          <section>
            <h3 class="mb-3 text-xs font-semibold text-gray-950">Category</h3>

            <div class="space-y-1">
              <button
                v-for="category in categories"
                :key="category.name"
                type="button"
                class="group flex w-full items-center justify-between rounded-lg px-2 py-2.5 text-left transition"
                :class="
                  selectedCategory === category.name
                    ? 'bg-gray-100'
                    : 'hover:bg-gray-50'
                "
                @click="selectCategory(category.name)"
              >
                <div class="flex items-center gap-3">
                  <!-- Checkbox -->

                  <span
                    class="flex h-4 w-4 shrink-0 items-center justify-center rounded border transition"
                    :class="
                      selectedCategory === category.name
                        ? 'border-black bg-black'
                        : 'border-gray-300 bg-white group-hover:border-gray-500'
                    "
                  >
                    <svg
                      v-if="selectedCategory === category.name"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="white"
                      stroke-width="3"
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
                      selectedCategory === category.name
                        ? 'font-semibold text-gray-950'
                        : 'text-gray-500 group-hover:text-gray-900'
                    "
                  >
                    {{ category.name }}
                  </span>
                </div>

                <!-- Count -->

                <span
                  v-if="category.name !== 'All'"
                  class="text-[10px] text-gray-400"
                >
                  {{ category.count }}
                </span>
              </button>
            </div>
          </section>

          <!-- ================================================= -->
          <!-- DIVIDER -->
          <!-- ================================================= -->

          <div class="my-6 border-t border-gray-100" />

          <!-- ================================================= -->
          <!-- PRICE -->
          <!-- ================================================= -->

          <section>
            <h3 class="mb-3 text-xs font-semibold text-gray-950">
              Price Range
            </h3>

            <div class="space-y-1">
              <button
                v-for="price in priceRanges"
                :key="price"
                type="button"
                class="group flex w-full items-center gap-3 rounded-lg px-2 py-2.5 text-left transition hover:bg-gray-50"
                @click="selectPrice(price)"
              >
                <!-- Radio -->

                <span
                  class="flex h-4 w-4 shrink-0 items-center justify-center rounded-full border transition"
                  :class="
                    selectedPrice === price
                      ? 'border-black'
                      : 'border-gray-300 group-hover:border-gray-500'
                  "
                >
                  <span
                    v-if="selectedPrice === price"
                    class="h-2 w-2 rounded-full bg-black"
                  />
                </span>

                <span
                  class="text-xs"
                  :class="
                    selectedPrice === price
                      ? 'font-semibold text-gray-950'
                      : 'text-gray-500 group-hover:text-gray-900'
                  "
                >
                  {{ price }}
                </span>
              </button>
            </div>
          </section>

          <!-- ================================================= -->
          <!-- DIVIDER -->
          <!-- ================================================= -->

          <div class="my-6 border-t border-gray-100" />

          <!-- ================================================= -->
          <!-- FORMAT -->
          <!-- ================================================= -->

          <section>
            <h3 class="mb-3 text-xs font-semibold text-gray-950">Format</h3>

            <div class="flex flex-wrap gap-2">
              <button
                v-for="format in formats"
                :key="format"
                type="button"
                class="rounded-full border px-3 py-2 text-[10px] font-medium transition"
                :class="
                  selectedFormat === format
                    ? 'border-black bg-black text-white'
                    : 'border-gray-200 bg-white text-gray-500 hover:border-gray-400 hover:text-gray-900'
                "
                @click="selectFormat(format)"
              >
                {{ format }}
              </button>
            </div>
          </section>

          <!-- ================================================= -->
          <!-- FILTER SUMMARY -->
          <!-- ================================================= -->

          <div class="mt-7 rounded-xl bg-gray-50 p-4">
            <div class="flex items-center justify-between">
              <span class="text-[10px] uppercase tracking-wider text-gray-400">
                Results
              </span>

              <span class="text-sm font-bold text-gray-950">
                {{ filteredBooks.length }}
              </span>
            </div>

            <p class="mt-2 text-[10px] leading-5 text-gray-400">
              Use the filters above to narrow down your book collection.
            </p>
          </div>
        </aside>

        <!-- =================================================== -->
        <!-- BOOKS -->
        <!-- =================================================== -->

        <section class="min-w-0">
          <!-- ================================================= -->
          <!-- BOOK GRID -->
          <!-- ================================================= -->

          <div
            v-if="filteredBooks.length > 0"
            class="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 xl:grid-cols-3"
          >
            <p v-if="wishlistError" class="col-span-full text-sm text-red-600">
              {{ wishlistError }}
            </p>

            <!-- ================================================= -->
            <!-- BOOK CARD -->
            <!-- ================================================= -->

            <article
              v-for="book in filteredBooks"
              :key="book.id"
              class="group min-w-0"
            >
              <!-- IMAGE CONTAINER -->

              <div
                class="relative overflow-hidden rounded-2xl border border-gray-100 bg-[#f1f2f5] shadow-sm transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-lg"
              >
                <!-- Highly Rated -->

                <span
                  v-if="Number(book.rating) >= 4.8"
                  class="absolute left-3 top-3 z-10 rounded-full bg-white/95 px-3 py-1.5 text-[9px] font-semibold uppercase tracking-wider text-gray-800 shadow-sm backdrop-blur"
                >
                  Highly Rated
                </span>

                <!-- Book -->

                <button
                  type="button"
                  :aria-label="
                    isFavorite(book.id)
                      ? 'Remove from favorites'
                      : 'Add to favorites'
                  "
                  class="absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/95 text-2xl leading-none text-primary shadow-sm transition hover:scale-105"
                  @click.stop.prevent="toggleWishlist(book.id)"
                >
                  <UiIcon
                    name="heart"
                    class="h-5 w-5"
                    :class="isFavorite(book.id) ? 'fill-current' : ''"
                  />
                </button>

                <NuxtLink :to="`/productDetail/${book.id}`" class="block">
                  <div
                    class="flex h-85 items-center justify-center overflow-hidden p-7"
                  >
                    <img
                      :src="book.image"
                      :alt="book.title"
                      loading="lazy"
                      class="h-full w-full object-contain transition duration-500 ease-out group-hover:scale-105"
                    />
                  </div>
                </NuxtLink>

                <!-- View Details -->

                <NuxtLink
                  :to="`/productDetail/${book.id}`"
                  class="absolute bottom-4 left-1/2 flex -translate-x-1/2 translate-y-4 items-center gap-2 rounded-full bg-white/95 px-5 py-2.5 text-[10px] font-semibold text-gray-900 opacity-0 shadow-lg backdrop-blur transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100"
                >
                  View Details

                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.8"
                    stroke="currentColor"
                    class="h-3.5 w-3.5"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M5 12h14m-6-6 6 6-6 6"
                    />
                  </svg>
                </NuxtLink>
              </div>

              <!-- ================================================= -->
              <!-- BOOK INFO -->
              <!-- ================================================= -->

              <div class="pt-4">
                <!-- Title + Price -->

                <div class="flex items-start justify-between gap-4">
                  <div class="min-w-0">
                    <NuxtLink :to="`/productDetail/${book.id}`">
                      <h2
                        class="font-serif text-lg font-bold leading-tight text-gray-950 transition group-hover:text-gray-600"
                      >
                        {{ book.shortTitle || book.title }}
                      </h2>
                    </NuxtLink>

                    <p class="mt-1.5 text-xs text-gray-500">
                      {{ book.author }}
                    </p>
                  </div>

                  <!-- Price -->

                  <span class="shrink-0 text-sm font-bold text-gray-950">
                    ${{ Number(book.price).toFixed(2) }}
                  </span>
                </div>

                <!-- ================================================= -->
                <!-- RATING -->
                <!-- ================================================= -->

                <div class="mt-3 flex items-center gap-2">
                  <div class="flex items-center text-[12px] leading-none">
                    <span
                      v-for="star in 5"
                      :key="star"
                      :class="
                        star <= Math.round(Number(book.rating))
                          ? 'text-gray-900'
                          : 'text-gray-300'
                      "
                    >
                      ★
                    </span>
                  </div>

                  <span class="text-[10px] text-gray-400">
                    {{ book.rating }}
                  </span>

                  <span class="text-[10px] text-gray-300"> • </span>

                  <span class="text-[10px] text-gray-400">
                    {{ book.reviews }} reviews
                  </span>
                </div>

                <!-- ================================================= -->
                <!-- TAGS -->
                <!-- ================================================= -->

                <div class="mt-3 flex flex-wrap gap-2">
                  <span
                    v-if="book.category"
                    class="rounded-full bg-gray-100 px-2.5 py-1 text-[9px] font-medium text-gray-600"
                  >
                    {{ book.category }}
                  </span>

                  <span
                    v-if="book.format"
                    class="rounded-full bg-gray-100 px-2.5 py-1 text-[9px] font-medium text-gray-600"
                  >
                    {{ book.format }}
                  </span>
                </div>
                <StockStatus :stock="book.stock" class="mt-3" />

                <!-- ================================================= -->
                <!-- ADD TO CART -->
                <!-- ================================================= -->

                <button
                  type="button"
                  :disabled="Number(book.stock) === 0"
                  class="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-black px-4 py-3 text-xs font-semibold text-white transition-all duration-200 hover:bg-gray-800 active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-gray-300"
                  @click.stop.prevent="handleAddToCart(book)"
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
                <p v-if="cartMessage" class="mt-2 text-xs text-gray-500">
                  {{ cartMessage }}
                </p>
              </div>
            </article>
          </div>

          <!-- ================================================= -->
          <!-- EMPTY RESULT -->
          <!-- ================================================= -->

          <div
            v-else
            class="flex min-h-125 items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white"
          >
            <div class="max-w-md px-6 text-center">
              <!-- Icon -->

              <div
                class="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-100"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="h-7 w-7 text-gray-400"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="m21 21-4.35-4.35m2.1-5.4a7.5 7.5 0 1 1-15 0 7.5 7.5 0 0 1 15 0Z"
                  />
                </svg>
              </div>

              <h2 class="mt-5 font-serif text-2xl font-bold text-gray-950">
                No books found
              </h2>

              <p class="mt-2 text-sm leading-6 text-gray-500">
                We couldn't find any books matching your current filters.
              </p>

              <!-- Current Filters -->

              <div class="mt-5 flex flex-wrap justify-center gap-2">
                <span
                  v-if="selectedCategory !== 'All'"
                  class="rounded-full bg-gray-100 px-3 py-1 text-[10px] text-gray-600"
                >
                  {{ selectedCategory }}
                </span>

                <span
                  v-if="selectedPrice !== 'All'"
                  class="rounded-full bg-gray-100 px-3 py-1 text-[10px] text-gray-600"
                >
                  {{ selectedPrice }}
                </span>

                <span
                  v-if="selectedFormat !== 'All'"
                  class="rounded-full bg-gray-100 px-3 py-1 text-[10px] text-gray-600"
                >
                  {{ selectedFormat }}
                </span>
              </div>

              <!-- Reset -->

              <button
                type="button"
                class="mt-6 rounded-xl bg-black px-6 py-3 text-xs font-semibold text-white transition hover:bg-gray-800"
                @click="resetFilters"
              >
                Clear Filters
              </button>
            </div>
          </div>

          <!-- ================================================= -->
          <!-- FOOTER RESULT -->
          <!-- ================================================= -->

          <div
            v-if="filteredBooks.length > 0"
            class="mt-14 flex flex-col items-center justify-between gap-4 border-t border-gray-200 pt-6 sm:flex-row"
          >
            <p class="text-xs text-gray-400">
              Showing

              <span class="font-semibold text-gray-700">
                {{ filteredBooks.length }}
              </span>

              books
            </p>

            <!-- Back to top -->

            <button
              type="button"
              class="flex items-center gap-2 text-xs font-medium text-gray-500 transition hover:text-black"
              @click="scrollToTop()"
            >
              Back to top

              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.7"
                stroke="currentColor"
                class="h-4 w-4"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="m5 15 7-7 7 7"
                />
              </svg>
            </button>
          </div>
        </section>
      </div>
    </main>
  </div>
</template>
