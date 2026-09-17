<script setup lang="ts">
definePageMeta({
  layout: "admin",
  middleware: "admin",
});

const router = useRouter();

const API_URL = "http://localhost:8000";

const saving = ref(false);
const errorMessage = ref("");

const handleSave = async (book: any) => {
  saving.value = true;
  errorMessage.value = "";

  try {
    // Remove id when creating a new book
    const { id, ...bookData } = book;

    console.log("Adding book:", bookData);

    await $fetch(`${API_URL}/books`, {
      method: "POST",
      body: {
        ...bookData,
        createdAt: new Date().toISOString(),
      },
    });

    // Successfully added
    await router.push("/admin/books");
  } catch (error) {
    console.error("Failed to add book:", error);

    errorMessage.value =
      "Failed to add book. Please make sure JSON Server is running on port 8000.";
  } finally {
    saving.value = false;
  }
};

const handleCancel = () => {
  router.push("/admin/books");
};
</script>

<template>
  <section class="mx-auto max-w-5xl">
    <!-- Page Header -->
    <div class="mb-6">
      <p
        class="text-[11px] font-bold uppercase tracking-[0.18em] text-primary"
      >
        Catalog
      </p>

      <h1
        class="mt-1 text-2xl font-bold tracking-tight text-gray-900"
      >
        Add New Book
      </h1>

      <p class="mt-1 text-sm text-gray-500">
        Add a new book to your bookstore catalog.
      </p>
    </div>

    <!-- Error -->
    <div
      v-if="errorMessage"
      class="mb-5 flex items-center justify-between gap-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
    >
      <span>{{ errorMessage }}</span>

      <button
        type="button"
        class="font-semibold underline"
        @click="errorMessage = ''"
      >
        Close
      </button>
    </div>

    <!-- Book Form -->
    <BookForm
      :saving="saving"
      @save="handleSave"
      @cancel="handleCancel"
    />
  </section>
</template>
