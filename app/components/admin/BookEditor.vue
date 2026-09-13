<script setup lang="ts">
const props = defineProps<{ book?: any | null; saving?: boolean }>();
const emit = defineEmits<{ save: [book: any]; cancel: [] }>();
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
    if (form.category && !categoryOptions.value.includes(form.category))
      categoryOptions.value.push(form.category);
    if (form.format && !formatOptions.value.includes(form.format))
      formatOptions.value.push(form.format);
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
  <form class="space-y-4" @submit.prevent="handleSubmit">
    <div class="grid gap-3 sm:grid-cols-2">
      <label class="sm:col-span-2"
        ><span class="field-label">Title</span
        ><input v-model="form.title" required class="field-input"
      /></label>
      <label
        ><span class="field-label">Short title</span
        ><input v-model="form.shortTitle" class="field-input"
      /></label>
      <label
        ><span class="field-label">Author</span
        ><input v-model="form.author" required class="field-input"
      /></label>
      <label
        ><span class="field-label">Price</span
        ><input
          v-model.number="form.price"
          required
          min="0"
          step="0.01"
          type="number"
          class="field-input"
      /></label>
      <label
        ><span class="field-label">Category</span
        ><select v-model="form.category" required class="field-input">
          <option value="" disabled>Select a category</option>
          <option
            v-for="category in categoryOptions"
            :key="category"
            :value="category"
          >
            {{ category }}
          </option>
        </select></label
      >
      <label
        ><span class="field-label">Format</span
        ><select v-model="form.format" required class="field-input">
          <option value="" disabled>Select a format</option>
          <option v-for="format in formatOptions" :key="format" :value="format">
            {{ format }}
          </option>
        </select></label
      >
      <label
        ><span class="field-label">Rating</span
        ><input
          v-model.number="form.rating"
          min="0"
          max="5"
          step="0.1"
          type="number"
          class="field-input"
      /></label>
      <label
        ><span class="field-label">Reviews</span
        ><input
          v-model.number="form.reviews"
          min="0"
          type="number"
          class="field-input"
      /></label>
      <label
        ><span class="field-label">Stock</span
        ><input
          v-model.number="form.stock"
          min="0"
          type="number"
          class="field-input"
      /></label>
    </div>
    <div class="space-y-3">
      <label class="field-label">Cover image</label>
      <input
        type="file"
        accept="image/*"
        class="field-input file:mr-3 file:rounded-md file:border-0 file:bg-[#e8f3ef] file:px-3 file:py-2 file:text-xs file:font-semibold file:text-primary"
        @change="handleImageUpload"
      />
      <input
        v-model="form.image"
        type="text"
        placeholder="Or paste an image URL"
        class="field-input"
      />
      <p v-if="imageError" class="text-xs text-red-600">{{ imageError }}</p>
      <img
        v-if="form.image"
        :src="form.image"
        alt="Cover preview"
        class="h-28 w-20 rounded-lg border border-[#d9e7e2] object-cover"
      />
    </div>
    <div
      class="flex flex-col-reverse gap-2 border-t border-[#e6efec] pt-4 sm:flex-row sm:justify-end"
    >
      <button
        type="button"
        class="rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-600 transition hover:bg-[#f3f9f7]"
        @click="emit('cancel')"
      >
        Cancel
      </button>
      <button
        :disabled="saving"
        class="rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0b5f59] disabled:opacity-50"
      >
        {{ saving ? "Saving..." : "Save book" }}
      </button>
    </div>
  </form>
</template>

<style scoped>
.field-label {
  display: block;
  margin-bottom: 0.35rem;
  font-size: 0.7rem;
  font-weight: 700;
  color: #536461;
}
.field-input {
  width: 100%;
  border: 1px solid #d7e1dd;
  border-radius: 0.65rem;
  background: #fff;
  padding: 0.6rem 0.8rem;
  outline: none;
  font-size: 0.875rem;
}
.field-input:focus {
  border-color: #0f766e;
  box-shadow: 0 0 0 4px rgba(15, 118, 110, 0.1);
}
</style>
