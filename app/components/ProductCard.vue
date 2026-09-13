<script setup lang="ts">
const { addToCart } = useCart();
const { isFavorite, toggleWishlist, error: wishlistError } = useWishlist();
const cartMessage = ref("");

const orderNow = async (product: Product) => {
  const result = await addToCart(product);
  if (!result?.success) {
    cartMessage.value = result?.message || "Unable to add this book.";
    return;
  }
  await navigateTo("/order");
};

const handleAddToCart = async (product: Product) => {
  const result = await addToCart(product);
  cartMessage.value = result?.success
    ? "Added to cart."
    : result?.message || "Unable to add this book.";
};

type Product = {
  id: number | string;
  title: string;
  author?: string;
  category?: string;
  format?: string;
  price: number;
  originalPrice?: number | null;
  isNew?: boolean;
  image: string;
  shortTitle?: string;
  rating?: number;
  reviews?: number;
  stock?: number;
};

defineProps<{
  product: Product;
}>();
</script>

<template>
  <div
    class="group mt-8 ml-2 overflow-hidden rounded-2xl border border-[#dce9e4] bg-white/85 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
  >
    <!-- Image -->
    <div class="relative overflow-hidden">
      <NuxtLink :to="`/productDetail/${product.id}`">
        <img
          :src="product.image"
          :alt="product.title"
          class="h-72 w-full object-cover transition duration-500 group-hover:scale-105"
        />
      </NuxtLink>
      <button
        type="button"
        :aria-label="
          isFavorite(product.id) ? 'Remove from favorites' : 'Add to favorites'
        "
        class="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-white/95 text-2xl leading-none text-primary shadow-sm transition hover:scale-105"
        @click.stop.prevent="toggleWishlist(product.id)"
      >
        <UiIcon
          name="heart"
          class="h-5 w-5"
          :class="isFavorite(product.id) ? 'fill-current' : ''"
        />
      </button>
      <span
        v-if="product.isNew"
        class="absolute left-3 top-3 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-white shadow-sm"
      >
        NEW
      </span>
    </div>

    <!-- Content -->
    <div class="p-5">
      <p class="text-sm text-gray-500">
        {{ product.category }} • {{ product.format }}
      </p>

      <NuxtLink :to="`/productDetail/${product.id}`">
        <h2
          class="mt-2 font-serif text-lg font-bold text-ink transition group-hover:text-primary"
        >
          {{ product.shortTitle || product.title }}
        </h2>
      </NuxtLink>

      <p class="mt-1 text-sm text-gray-500">
        {{ product.author }}
      </p>

      <!-- Rating -->
      <div v-if="product.rating" class="mt-2 flex items-center gap-1">
        <span
          v-for="star in 5"
          :key="star"
          :class="
            star <= Math.round(product.rating)
              ? 'text-yellow-500'
              : 'text-gray-300'
          "
          class="text-xs"
        >
          <UiIcon name="star" class="h-3 w-3" />
        </span>
        <span v-if="product.reviews" class="ml-1 text-xs text-gray-400"
          >({{ product.reviews }})</span
        >
      </div>

      <StockStatus :stock="product.stock" class="mt-3" />

      <div class="mt-4 flex items-center gap-2">
        <span class="text-xl font-bold text-gray-900">
          ${{ product.price }}
        </span>
        <span
          v-if="product.originalPrice"
          class="text-sm text-gray-400 line-through"
        >
          ${{ product.originalPrice }}
        </span>
      </div>

      <!-- Actions -->
      <div class="mt-5 grid grid-cols-2 gap-2">
        <NuxtLink
          :to="`/productDetail/${product.id}`"
          class="flex-1 rounded-xl bg-ink py-3 text-center text-sm font-semibold text-white transition hover:bg-primary"
        >
          View Details
        </NuxtLink>
        <button
          type="button"
          :disabled="Number(product.stock) === 0"
          @click.stop.prevent="handleAddToCart(product)"
          class="rounded-xl border border-primary py-3 text-sm font-semibold text-primary transition hover:bg-[#edf8f5] disabled:cursor-not-allowed disabled:border-gray-200 disabled:text-gray-400"
        >
          Add to Cart
        </button>
        <button
          type="button"
          :disabled="Number(product.stock) === 0"
          @click.stop.prevent="orderNow(product)"
          class="rounded-xl bg-[#0f766e] py-3 text-sm font-semibold text-white transition hover:bg-[#0b5f59] disabled:cursor-not-allowed disabled:bg-gray-300"
        >
          Order Now
        </button>
      </div>
      <p v-if="wishlistError" class="mt-2 text-xs text-red-600">
        {{ wishlistError }}
      </p>
      <p v-if="cartMessage" class="mt-2 text-xs text-gray-500">
        {{ cartMessage }}
      </p>
    </div>
  </div>
</template>
