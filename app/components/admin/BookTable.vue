<script setup lang="ts">
const props = defineProps<{
  books: any[];
  loading?: boolean;
}>();

const emit = defineEmits<{
  edit: [book: any];
  delete: [id: string];
  "stock-change": [book: any, amount: number];
}>();
</script>

<template>
  <div class="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
    <!-- Table -->
    <div class="overflow-x-auto">
      <table class="w-full min-w-[900px]">
        <!-- Header -->
        <thead class="border-b border-gray-200 bg-gray-50/80">
          <tr>
            <th
              class="px-6 py-4 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500"
            >
              Book
            </th>

            <th
              class="px-6 py-4 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500"
            >
              Author
            </th>

            <th
              class="px-6 py-4 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500"
            >
              Category
            </th>

            <th
              class="px-6 py-4 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500"
            >
              Price
            </th>

            <th
              class="px-6 py-4 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500"
            >
              Rating
            </th>

            <th
              class="px-6 py-4 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500"
            >
              Stock
            </th>

            <th
              class="px-6 py-4 text-right text-[11px] font-semibold uppercase tracking-wider text-gray-500"
            >
              Actions
            </th>
          </tr>
        </thead>

        <!-- Body -->
        <tbody class="divide-y divide-gray-100">
          <tr
            v-for="book in books"
            :key="book.id"
            class="group transition-colors duration-150 hover:bg-gray-50/70"
          >
            <!-- Book -->
            <td class="px-6 py-4">
              <div class="flex items-center gap-4">
                <div
                  class="h-14 w-11 shrink-0 overflow-hidden rounded-lg border border-gray-200 bg-gray-100 shadow-sm"
                >
                  <img
                    :src="book.image"
                    :alt="book.title"
                    class="h-full w-full object-cover"
                  />
                </div>

                <div class="min-w-0">
                  <p
                    class="max-w-[220px] truncate text-sm font-semibold text-gray-900"
                  >
                    {{ book.shortTitle || book.title }}
                  </p>

                  <p class="mt-1 text-xs text-gray-400">
                    {{ book.format || "Paperback" }}
                  </p>
                </div>
              </div>
            </td>

            <!-- Author -->
            <td class="px-6 py-4">
              <span class="text-sm text-gray-600">
                {{ book.author || "—" }}
              </span>
            </td>

            <!-- Category -->
            <td class="px-6 py-4">
              <span
                class="inline-flex rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600"
              >
                {{ book.category || "Uncategorized" }}
              </span>
            </td>

            <!-- Price -->
            <td class="px-6 py-4">
              <span class="text-sm font-semibold text-gray-900">
                ${{ Number(book.price || 0).toFixed(2) }}
              </span>
            </td>

            <!-- Rating -->
            <td class="px-6 py-4">
              <div class="flex items-center gap-1.5">
                <span class="text-sm font-medium text-gray-700">
                  {{ Number(book.rating || 0).toFixed(1) }}
                </span>

                <span class="text-sm text-amber-400">★</span>
              </div>
            </td>

            <!-- Stock -->
            <td class="px-6 py-4">
              <div class="flex items-center gap-2">
                <!-- Minus -->
                <button
                  type="button"
                  class="flex h-7 w-7 items-center justify-center rounded-md border border-gray-200 bg-white text-gray-500 transition hover:border-gray-300 hover:bg-gray-50 hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-40"
                  :disabled="Number(book.stock) <= 0"
                  aria-label="Reduce stock"
                  @click="emit('stock-change', book, -1)"
                >
                  <span class="text-base leading-none">−</span>
                </button>

                <!-- Stock number -->
                <span
                  class="w-7 text-center text-sm font-semibold text-gray-900"
                >
                  {{ Math.max(0, Number(book.stock) || 0) }}
                </span>

                <!-- Plus -->
                <button
                  type="button"
                  class="flex h-7 w-7 items-center justify-center rounded-md border border-gray-200 bg-white text-gray-500 transition hover:border-gray-300 hover:bg-gray-50 hover:text-gray-900"
                  aria-label="Add stock"
                  @click="emit('stock-change', book, 1)"
                >
                  <span class="text-base leading-none">+</span>
                </button>
              </div>

              <StockStatus
                :stock="book.stock"
                class="mt-2"
              />
            </td>

            <!-- Actions -->
            <td class="px-6 py-4">
              <div class="flex items-center justify-end gap-1">
                <!-- Edit -->
                <button
                  type="button"
                  class="flex h-9 w-9 items-center justify-center rounded-lg text-gray-400 transition hover:bg-blue-50 hover:text-blue-600"
                  aria-label="Edit book"
                  title="Edit book"
                  @click="emit('edit', book)"
                >
                  <UiIcon name="edit" class="h-4 w-4" />
                </button>

                <!-- Delete -->
                <button
                  type="button"
                  class="flex h-9 w-9 items-center justify-center rounded-lg text-gray-400 transition hover:bg-red-50 hover:text-red-600"
                  aria-label="Delete book"
                  title="Delete book"
                  @click="emit('delete', book.id)"
                >
                  <UiIcon name="delete" class="h-4 w-4" />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Empty state -->
    <div
      v-if="!loading && books.length === 0"
      class="flex flex-col items-center justify-center px-6 py-16 text-center"
    >
      <div
        class="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100"
      >
        <svg
          class="h-6 w-6 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.8"
            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
          />
        </svg>
      </div>

      <h3 class="text-sm font-semibold text-gray-900">
        No books found
      </h3>

      <p class="mt-1 text-sm text-gray-500">
        Try changing your search or add a new book.
      </p>
    </div>

    <!-- Loading -->
    <div
      v-if="loading"
      class="flex items-center justify-center px-6 py-16"
    >
      <div class="flex items-center gap-3 text-sm text-gray-500">
        <div
          class="h-5 w-5 animate-spin rounded-full border-2 border-gray-200 border-t-gray-700"
        ></div>

        Loading books...
      </div>
    </div>
  </div>
</template>
