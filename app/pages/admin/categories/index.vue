<script setup lang="ts">
definePageMeta({
  layout: "admin",
  middleware: "admin",
});

const API_URL = "http://localhost:8000";

const books = ref<any[]>([]);
const loading = ref(true);
const saving = ref(false);
const errorMessage = ref("");

const showForm = ref(false);
const editingBook = ref<any | null>(null);

const loadBooks = async () => {
  loading.value = true;
  errorMessage.value = "";

  try {
    books.value = await $fetch<any[]>(
      `${API_URL}/books`,
    );
  } catch (error) {
    console.error("Load books error:", error);

    errorMessage.value =
      "Unable to load books. Make sure JSON Server is running.";
  } finally {
    loading.value = false;
  }
};

const openCreateForm = () => {
  editingBook.value = null;
  showForm.value = true;
};

const openEditForm = (book: any) => {
  editingBook.value = { ...book };
  showForm.value = true;
};

const closeForm = () => {
  showForm.value = false;
  editingBook.value = null;
};

const saveBook = async (book: any) => {
  saving.value = true;
  errorMessage.value = "";

  try {
    /*
     * CREATE
     *
     * When there is no editingBook,
     * create a new book with POST.
     */
    if (!editingBook.value) {
      const { id, ...bookData } = book;

      console.log("Creating book:", bookData);

      await $fetch(`${API_URL}/books`, {
        method: "POST",
        body: {
          ...bookData,
          createdAt: new Date().toISOString(),
        },
      });
    }

    /*
     * UPDATE
     *
     * When editingBook exists,
     * update that existing book with PATCH.
     */
    else {
      const bookId = editingBook.value.id;

      if (!bookId) {
        throw new Error(
          "Book ID is missing.",
        );
      }

      const { id, ...bookData } = book;

      console.log(
        "Updating book:",
        bookId,
        bookData,
      );

      await $fetch(
        `${API_URL}/books/${bookId}`,
        {
          method: "PATCH",
          body: bookData,
        },
      );
    }

    // Refresh books after saving
    await loadBooks();

    // Close form
    closeForm();
  } catch (error) {
    console.error("Save book error:", error);

    errorMessage.value =
      "Unable to save the book. Please check JSON Server.";
  } finally {
    saving.value = false;
  }
};

const deleteBook = async (book: any) => {
  if (!book?.id) {
    return;
  }

  const confirmed = window.confirm(
    `Delete "${book.title}"?`,
  );

  if (!confirmed) {
    return;
  }

  try {
    await $fetch(
      `${API_URL}/books/${book.id}`,
      {
        method: "DELETE",
      },
    );

    await loadBooks();
  } catch (error) {
    console.error("Delete book error:", error);

    errorMessage.value =
      "Unable to delete this book.";
  }
};

onMounted(loadBooks);
</script>

<template>
  <section class="space-y-6">
    <!-- Header -->
    <div
      class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
    >
      <div>
        <p
          class="text-[11px] font-bold uppercase tracking-[0.18em] text-primary"
        >
          Catalog
        </p>

        <h1
          class="mt-1 text-2xl font-bold tracking-tight text-gray-900"
        >
          Books
        </h1>

        <p class="mt-1 text-sm text-gray-500">
          Manage your bookstore catalog.
        </p>
      </div>

      <button
        type="button"
        class="rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0b5f59]"
        @click="openCreateForm"
      >
        + Add New Book
      </button>
    </div>

    <!-- Error -->
    <div
      v-if="errorMessage"
      class="flex items-center justify-between gap-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
    >
      <span>{{ errorMessage }}</span>

      <button
        type="button"
        class="font-semibold underline"
        @click="loadBooks"
      >
        Retry
      </button>
    </div>

    <!-- Form -->
    <BookForm
      v-if="showForm"
      :book="editingBook"
      :saving="saving"
      @save="saveBook"
      @cancel="closeForm"
    />

    <!-- Books Table -->
    <div
      v-else
      class="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"
    >
      <!-- Loading -->
      <div
        v-if="loading"
        class="flex flex-col items-center justify-center py-20"
      >
        <div
          class="h-7 w-7 animate-spin rounded-full border-2 border-gray-200 border-t-primary"
        ></div>

        <p class="mt-3 text-sm text-gray-500">
          Loading books...
        </p>
      </div>

      <!-- Empty -->
      <div
        v-else-if="!books.length"
        class="px-6 py-20 text-center"
      >
        <div
          class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-400"
        >
          📚
        </div>

        <h3
          class="mt-4 text-sm font-semibold text-gray-900"
        >
          No books yet
        </h3>

        <p
          class="mt-1 text-sm text-gray-500"
        >
          Add your first book to the catalog.
        </p>

        <button
          type="button"
          class="mt-5 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white"
          @click="openCreateForm"
        >
          + Add New Book
        </button>
      </div>

      <!-- Table -->
      <div
        v-else
        class="overflow-x-auto"
      >
        <table
          class="w-full min-w-[850px] text-left"
        >
          <thead>
            <tr
              class="border-b border-gray-100 bg-gray-50/70 text-[10px] uppercase tracking-wider text-gray-400"
            >
              <th class="px-5 py-3">
                Book
              </th>

              <th class="px-5 py-3">
                Author
              </th>

              <th class="px-5 py-3">
                Category
              </th>

              <th class="px-5 py-3">
                Price
              </th>

              <th class="px-5 py-3">
                Stock
              </th>

              <th class="px-5 py-3 text-right">
                Actions
              </th>
            </tr>
          </thead>

          <tbody
            class="divide-y divide-gray-100"
          >
            <tr
              v-for="book in books"
              :key="book.id"
              class="transition hover:bg-gray-50/70"
            >
              <!-- Book -->
              <td class="px-5 py-4">
                <div
                  class="flex items-center gap-3"
                >
                  <div
                    class="h-12 w-9 overflow-hidden rounded-md bg-gray-100"
                  >
                    <img
                      v-if="book.image"
                      :src="book.image"
                      :alt="book.title"
                      class="h-full w-full object-cover"
                    />

                    <div
                      v-else
                      class="flex h-full items-center justify-center text-[9px] text-gray-400"
                    >
                      No image
                    </div>
                  </div>

                  <div>
                    <p
                      class="max-w-[260px] truncate text-sm font-semibold text-gray-900"
                    >
                      {{ book.title }}
                    </p>

                    <p
                      class="mt-0.5 text-xs text-gray-400"
                    >
                      ID: {{ book.id }}
                    </p>
                  </div>
                </div>
              </td>

              <!-- Author -->
              <td
                class="px-5 py-4 text-sm text-gray-600"
              >
                {{ book.author || "-" }}
              </td>

              <!-- Category -->
              <td
                class="px-5 py-4"
              >
                <span
                  class="rounded-full bg-gray-100 px-2.5 py-1 text-[10px] font-semibold text-gray-600"
                >
                  {{ book.category || "-" }}
                </span>
              </td>

              <!-- Price -->
              <td
                class="px-5 py-4 text-sm font-bold text-gray-900"
              >
                ${{ Number(book.price || 0).toFixed(2) }}
              </td>

              <!-- Stock -->
              <td
                class="px-5 py-4 text-sm text-gray-600"
              >
                {{ book.stock ?? 0 }}
              </td>

              <!-- Actions -->
              <td
                class="px-5 py-4 text-right"
              >
                <div
                  class="flex justify-end gap-2"
                >
                  <button
                    type="button"
                    class="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-600 transition hover:bg-gray-50 hover:text-gray-900"
                    @click="openEditForm(book)"
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    class="rounded-lg border border-red-100 px-3 py-1.5 text-xs font-semibold text-red-500 transition hover:bg-red-50"
                    @click="deleteBook(book)"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>
</template>
