<script setup lang="ts">
const props = defineProps<{
  book?: any | null;
  saving?: boolean;
}>();

const emit = defineEmits<{
  save: [book: any];
  cancel: [];
}>();

const emptyForm = () => ({
  title: "",
  shortTitle: "",
  author: "",
  price: 0,
  category: "",
  format: "",
  image: "",
  rating: 5,
  reviews: 0,
  stock: 0,
});

const form = reactive(emptyForm());

const imageError = ref("");
const categoryOptions = ref<string[]>([]);
const formatOptions = ref<string[]>([]);

const API_URL = "http://localhost:8000";

const loadOptions = async () => {
  try {
    const [categoryRecords, books] = await Promise.all([
      $fetch<any[]>(`${API_URL}/categories`),
      $fetch<any[]>(`${API_URL}/books`),
    ]);

    categoryOptions.value = categoryRecords
      .map((category) => category.name)
      .filter(Boolean);

    formatOptions.value = [
      ...new Set(books.map((book) => book.format).filter(Boolean)),
    ];
  } catch {
    categoryOptions.value = [];
    formatOptions.value = [];
  }
};

watch(
  () => props.book,
  (value) => {
    Object.assign(form, value || emptyForm());
    imageError.value = "";
  },
  { immediate: true },
);

onMounted(loadOptions);

watch(
  () => [form.category, form.format],
  () => {
    if (
      form.category &&
      !categoryOptions.value.includes(form.category)
    ) {
      categoryOptions.value.push(form.category);
    }

    if (
      form.format &&
      !formatOptions.value.includes(form.format)
    ) {
      formatOptions.value.push(form.format);
    }
  },
);

const handleImageUpload = (event: Event) => {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];

  imageError.value = "";

  if (!file) return;

  if (!file.type.startsWith("image/")) {
    imageError.value = "Please select an image file.";
    input.value = "";
    return;
  }

  if (file.size > 5 * 1024 * 1024) {
    imageError.value = "Image must be 5 MB or smaller.";
    input.value = "";
    return;
  }

  const reader = new FileReader();

  reader.onload = () => {
    form.image = String(reader.result || "");
  };

  reader.onerror = () => {
    imageError.value = "Unable to read this image.";
    input.value = "";
  };

  reader.readAsDataURL(file);
};

const handleSubmit = () => {
  if (!form.image) {
    imageError.value = "Choose an image or enter an image URL.";
    return;
  }

  emit("save", {
    ...form,
    id: props.book?.id,
    price: Number(form.price),
    rating: Number(form.rating),
    reviews: Number(form.reviews),
    stock: Math.max(0, Number(form.stock) || 0),
  });
};
</script>

<template>
  <form
    class="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
    @submit.prevent="handleSubmit"
  >
    <!-- Header -->
    <div class="border-b border-gray-100 px-6 py-5">
      <h2 class="text-lg font-semibold text-gray-900">
        {{ props.book ? "Edit book" : "Add new book" }}
      </h2>

      <p class="mt-1 text-sm text-gray-500">
        {{
          props.book
            ? "Update the information for this book."
            : "Add a new book to your store."
        }}
      </p>
    </div>

    <!-- Form Content -->
    <div class="space-y-8 p-6">
      <!-- Basic Information -->
      <section>
        <div class="mb-4">
          <h3 class="text-sm font-semibold text-gray-900">
            Basic information
          </h3>

          <p class="mt-1 text-xs text-gray-500">
            Enter the main details about the book.
          </p>
        </div>

        <div class="grid gap-5 sm:grid-cols-2">
          <!-- Title -->
          <label class="sm:col-span-2">
            <span class="field-label">
              Title <span class="text-red-500">*</span>
            </span>

            <input
              v-model="form.title"
              type="text"
              required
              placeholder="Enter book title"
              class="field-input"
            />
          </label>

          <!-- Short Title -->
          <label>
            <span class="field-label">Short title</span>

            <input
              v-model="form.shortTitle"
              type="text"
              placeholder="Optional short title"
              class="field-input"
            />
          </label>

          <!-- Author -->
          <label>
            <span class="field-label">
              Author <span class="text-red-500">*</span>
            </span>

            <input
              v-model="form.author"
              type="text"
              required
              placeholder="Enter author name"
              class="field-input"
            />
          </label>

          <!-- Category -->
          <label>
            <span class="field-label">
              Category <span class="text-red-500">*</span>
            </span>

            <select
              v-model="form.category"
              required
              class="field-input"
            >
              <option value="" disabled>
                Select a category
              </option>

              <option
                v-for="category in categoryOptions"
                :key="category"
                :value="category"
              >
                {{ category }}
              </option>
            </select>
          </label>

          <!-- Format -->
          <label>
            <span class="field-label">
              Format <span class="text-red-500">*</span>
            </span>

            <select
              v-model="form.format"
              required
              class="field-input"
            >
              <option value="" disabled>
                Select a format
              </option>

              <option
                v-for="format in formatOptions"
                :key="format"
                :value="format"
              >
                {{ format }}
              </option>
            </select>
          </label>
        </div>
      </section>

      <!-- Pricing & Inventory -->
      <section class="border-t border-gray-100 pt-7">
        <div class="mb-4">
          <h3 class="text-sm font-semibold text-gray-900">
            Pricing & inventory
          </h3>

          <p class="mt-1 text-xs text-gray-500">
            Set the price, rating and available stock.
          </p>
        </div>

        <div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <!-- Price -->
          <label>
            <span class="field-label">
              Price <span class="text-red-500">*</span>
            </span>

            <div class="relative">
              <span
                class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400"
              >
                $
              </span>

              <input
                v-model.number="form.price"
                required
                min="0"
                step="0.01"
                type="number"
                placeholder="0.00"
                class="field-input pl-7"
              />
            </div>
          </label>

          <!-- Rating -->
          <label>
            <span class="field-label">Rating</span>

            <div class="relative">
              <input
                v-model.number="form.rating"
                min="0"
                max="5"
                step="0.1"
                type="number"
                class="field-input pr-9"
              />

              <span
                class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-amber-400"
              >
                ★
              </span>
            </div>
          </label>

          <!-- Reviews -->
          <label>
            <span class="field-label">Reviews</span>

            <input
              v-model.number="form.reviews"
              min="0"
              type="number"
              placeholder="0"
              class="field-input"
            />
          </label>

          <!-- Stock -->
          <label>
            <span class="field-label">Stock</span>

            <input
              v-model.number="form.stock"
              min="0"
              type="number"
              placeholder="0"
              class="field-input"
            />
          </label>
        </div>
      </section>

      <!-- Cover Image -->
      <section class="border-t border-gray-100 pt-7">
        <div class="mb-4">
          <h3 class="text-sm font-semibold text-gray-900">
            Cover image
          </h3>

          <p class="mt-1 text-xs text-gray-500">
            Upload a cover image or paste an image URL.
          </p>
        </div>

        <div class="grid gap-6 sm:grid-cols-[auto_1fr]">
          <!-- Preview -->
          <div class="flex justify-center sm:justify-start">
            <div
              class="flex h-40 w-28 items-center justify-center overflow-hidden rounded-xl border border-dashed border-gray-300 bg-gray-50"
            >
              <img
                v-if="form.image"
                :src="form.image"
                alt="Cover preview"
                class="h-full w-full object-cover"
              />

              <div
                v-else
                class="flex flex-col items-center px-3 text-center"
              >
                <svg
                  class="mb-2 h-7 w-7 text-gray-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="1.5"
                    d="M3 16.5V8a2 2 0 012-2h14a2 2 0 012 2v8.5a2 2 0 01-2 2H5a2 2 0 01-2-2z"
                  />
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="1.5"
                    d="M8 13l2.5-2.5L13 13l1.5-1.5L18 15M8 10h.01"
                  />
                </svg>

                <span class="text-[11px] text-gray-400">
                  Preview
                </span>
              </div>
            </div>
          </div>

          <!-- Upload -->
          <div class="space-y-3">
            <label class="field-label">
              Upload image
            </label>

            <input
              type="file"
              accept="image/*"
              class="field-input file:mr-3 file:cursor-pointer file:rounded-lg file:border-0 file:bg-gray-100 file:px-3 file:py-2 file:text-xs file:font-semibold file:text-gray-700 hover:file:bg-gray-200"
              @change="handleImageUpload"
            />

            <div class="flex items-center gap-3">
              <div class="h-px flex-1 bg-gray-100"></div>
              <span class="text-[11px] font-medium text-gray-400">
                OR
              </span>
              <div class="h-px flex-1 bg-gray-100"></div>
            </div>

            <input
              v-model="form.image"
              type="text"
              placeholder="https://example.com/book-cover.jpg"
              class="field-input"
            />

            <p class="text-[11px] text-gray-400">
              JPG, PNG or WEBP. Maximum file size: 5 MB.
            </p>

            <p
              v-if="imageError"
              class="flex items-center gap-1.5 text-xs font-medium text-red-600"
            >
              <span>⚠</span>
              {{ imageError }}
            </p>
          </div>
        </div>
      </section>
    </div>

    <!-- Footer -->
    <div
      class="flex flex-col-reverse gap-3 border-t border-gray-100 bg-gray-50/50 px-6 py-4 sm:flex-row sm:justify-end"
    >
      <button
        type="button"
        class="rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-600 transition hover:bg-gray-50 hover:text-gray-900 disabled:opacity-50"
        :disabled="saving"
        @click="emit('cancel')"
      >
        Cancel
      </button>

      <button
        type="submit"
        :disabled="saving"
        class="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0b5f59] disabled:cursor-not-allowed disabled:opacity-50"
      >
        <span
          v-if="saving"
          class="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white"
        ></span>

        {{ saving ? "Saving..." : props.book ? "Update book" : "Save book" }}
      </button>
    </div>
  </form>
</template>

<style scoped>
.field-label {
  display: block;
  margin-bottom: 0.4rem;
  font-size: 0.75rem;
  font-weight: 600;
  color: #374151;
}

.field-input {
  width: 100%;
  border: 1px solid #e5e7eb;
  border-radius: 0.65rem;
  background: #fff;
  padding: 0.65rem 0.8rem;
  outline: none;
  font-size: 0.875rem;
  color: #111827;
  transition:
    border-color 150ms ease,
    box-shadow 150ms ease,
    background-color 150ms ease;
}

.field-input::placeholder {
  color: #9ca3af;
}

.field-input:hover {
  border-color: #d1d5db;
}

.field-input:focus {
  border-color: #0f766e;
  box-shadow: 0 0 0 3px rgba(15, 118, 110, 0.1);
}

.field-input:disabled {
  cursor: not-allowed;
  background: #f9fafb;
  opacity: 0.7;
}
</style>
