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
  <div class="rounded-xl border border-gray-200 bg-white">
    <div class="overflow-x-auto">
      <table class="w-full">
        <thead class="bg-gray-50">
          <tr>
            <th
              class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
            >
              Book
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
            >
              Author
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
            >
              Category
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
            >
              Price
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
            >
              Rating
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
            >
              Stock
            </th>
            <th
              class="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500"
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr v-for="book in books" :key="book.id" class="hover:bg-gray-50">
            <td class="whitespace-nowrap px-6 py-4">
              <div class="flex items-center gap-3">
                <img
                  :src="book.image"
                  :alt="book.title"
                  class="h-12 w-10 rounded object-cover"
                />
                <div>
                  <p class="font-medium text-gray-900">
                    {{ book.shortTitle || book.title }}
                  </p>
                  <p class="text-xs text-gray-500">{{ book.format }}</p>
                </div>
              </div>
            </td>
            <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
              {{ book.author }}
            </td>
            <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
              {{ book.category }}
            </td>
            <td
              class="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900"
            >
              ${{ Number(book.price).toFixed(2) }}
            </td>
            <td class="whitespace-nowrap px-6 py-4">
              <div class="flex items-center gap-1">
                <span class="text-yellow-500">{{ book.rating }}</span
                ><span class="text-gray-300">★</span>
              </div>
            </td>
            <td class="whitespace-nowrap px-6 py-4">
              <div class="flex items-center gap-2">
                <button
                  type="button"
                  class="flex h-7 w-7 items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:border-primary hover:text-primary"
                  aria-label="Reduce stock"
                  @click="emit('stock-change', book, -1)"
                >
                  -</button
                ><span
                  class="w-8 text-center text-sm font-semibold text-gray-900"
                  >{{ Math.max(0, Number(book.stock) || 0) }}</span
                ><button
                  type="button"
                  class="flex h-7 w-7 items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:border-primary hover:text-primary"
                  aria-label="Add stock"
                  @click="emit('stock-change', book, 1)"
                >
                  +
                </button>
              </div>
              <StockStatus :stock="book.stock" class="mt-2" />
            </td>
            <td
              class="whitespace-nowrap px-6 py-4 text-right text-sm font-medium"
            >
              <button
                type="button"
                @click="emit('edit', book)"
                class="mr-3 text-blue-600 hover:text-blue-800"
              >
                Edit</button
              ><button
                type="button"
                @click="emit('delete', book.id)"
                class="text-red-600 hover:text-red-800"
              >
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-if="books.length === 0" class="px-6 py-12 text-center text-gray-500">
      No books found.
    </div>
  </div>
</template>
