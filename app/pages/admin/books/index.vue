<script setup lang="ts">
definePageMeta({ layout: "admin", middleware: "admin" });
const API_URL = "http://localhost:8000";
const books = ref<any[]>([]);
const loading = ref(true);
const search = ref("");
const category = ref("");
const errorMessage = ref("");
const showBookModal = ref(false);
const editingBook = ref<any | null>(null);
const saving = ref(false);
const load = async () => {
  loading.value = true;
  try {
    books.value = await $fetch<any[]>(`${API_URL}/books`);
  } catch {
    errorMessage.value = "Unable to load books.";
  } finally {
    loading.value = false;
  }
};
const filteredBooks = computed(() =>
  books.value.filter((book) => {
    const term = search.value.toLowerCase();
    return (
      (!term || `${book.title} ${book.author}`.toLowerCase().includes(term)) &&
      (!category.value || book.category === category.value)
    );
  }),
);
const categories = computed(() => [
  ...new Set(books.value.map((book) => book.category).filter(Boolean)),
]);
const deleteBook = async (id: string | number) => {
  if (!confirm("Delete this book?")) return;
  await $fetch(`${API_URL}/books/${id}`, { method: "DELETE" });
  await load();
};
const openAddBook = () => {
  editingBook.value = null;
  showBookModal.value = true;
};
const openEditBook = (book: any) => {
  editingBook.value = book;
  showBookModal.value = true;
};
const changeStock = async (book: any, amount: number) => {
  const nextStock = Math.max(0, (Number(book.stock) || 0) + amount);
  try {
    const updated = await $fetch<any>(`${API_URL}/books/${book.id}`, {
      method: "PATCH",
      body: { stock: nextStock },
    });
    const index = books.value.findIndex((item) => item.id === updated.id);
    if (index !== -1) books.value[index] = updated;
  } catch {
    errorMessage.value = "Unable to update stock.";
  }
};
const saveBook = async (book: any) => {
  saving.value = true;
  errorMessage.value = "";
  try {
    const id = editingBook.value?.id;
    await $fetch(`${API_URL}/books${id ? `/${id}` : ""}`, {
      method: id ? "PUT" : "POST",
      body: { ...book, stock: Math.max(0, Number(book.stock) || 0) },
    });
    showBookModal.value = false;
    await load();
  } catch {
    errorMessage.value = id
      ? "Unable to update this book."
      : "Unable to create this book.";
  } finally {
    saving.value = false;
  }
};
onMounted(load);
</script>
<template>
  <section>
    <div class="mb-8">
      <p class="text-[10px] font-bold uppercase tracking-[0.24em] text-primary">Catalog</p>
      <h1 class="mt-2 font-serif text-3xl font-bold tracking-tight text-ink sm:text-4xl">Books</h1>
      <p class="mt-2 text-sm text-gray-500">Search, edit, and maintain your store inventory.</p>
      <button type="button" class="mt-4 inline-flex items-center rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#0b5f59]" @click="openAddBook">+ Add book</button>
    </div>
    <div
      class="mb-5 flex flex-col gap-3 rounded-2xl border border-[#d9e7e2] bg-white p-4 sm:flex-row"
    >
      <input
        v-model="search"
        placeholder="Search by title or author"
        class="min-w-0 flex-1 rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-primary"
      /><select
        v-model="category"
        class="rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-primary"
      >
        <option value="">All categories</option>
        <option v-for="item in categories" :key="item" :value="item">
          {{ item }}
        </option>
      </select>
    </div>
    <p
      v-if="errorMessage"
      class="mb-5 rounded-xl bg-red-50 p-4 text-sm text-red-700"
    >
      {{ errorMessage }}
    </p>
    <div v-if="loading" class="py-20 text-center text-sm text-gray-500">
      Loading books...
    </div>
    <AdminBookTable
      v-else
      :books="filteredBooks"
      @edit="openEditBook"
      @delete="deleteBook"
      @stock-change="changeStock"
    />
    <div
      v-if="showBookModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4 backdrop-blur-sm"
      @click.self="showBookModal = false"
    >
      <div
        class="flex max-h-[88vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-white/70 bg-white shadow-2xl"
      >
        <div
          class="flex shrink-0 items-center justify-between border-b border-[#e6efec] px-5 py-4 sm:px-6"
        >
          <div>
            <p
              class="text-[10px] font-bold uppercase tracking-[0.18em] text-primary"
            >
              Catalog
            </p>
            <h2 class="mt-1 font-serif text-xl font-bold text-ink">
              {{ editingBook ? "Edit book" : "Add new book" }}
            </h2>
          </div>
          <button
            type="button"
            aria-label="Close book dialog"
            class="rounded-lg p-2 text-gray-400 transition hover:bg-[#f3f9f7] hover:text-ink"
            @click="showBookModal = false"
          >
            &#10005;
          </button>
        </div>
        <div class="min-h-0 overflow-y-auto p-4 sm:p-5">
          <AdminBookEditor
            :book="editingBook"
            :saving="saving"
            @save="saveBook"
            @cancel="showBookModal = false"
          />
        </div>
      </div>
    </div>
  </section>
</template>
