<script setup lang="ts">
// ========================================
// Router & State
// ========================================
const route = useRoute();
const { cartCount, loadCart } = useCart();
const { wishlistCount, loadWishlist, clearWishlist } = useWishlist();

const user = ref<any>(null);
const isMobileMenuOpen = ref(false);

// ========================================
// Navigation Config
// ========================================
const navItems = computed(() => {
  const items = [
    { label: "Home", path: "/" },
    { label: "Browse", path: "/browse" },
    { label: "Collections", path: "/collection" },
    { label: "About", path: "/about" },
  ];
  if (user.value?.role === "admin") {
    items.push({ label: "Admin", path: "/admin" });
  }
  return items;
});

const isActive = (path: string) => route.path === path;

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
};

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false;
};

// ========================================
// Quick Actions
// ========================================
const goToCart = () => {
  closeMobileMenu();
  navigateTo("/cart");
};

// Watch route changes to close mobile drawer on navigate
watch(() => route.path, () => {
  closeMobileMenu();
});

// ========================================
// Search Logic
// ========================================
const searchText = ref("");
const showSearch = ref(false);
const searchInput = ref<HTMLInputElement | null>(null);

const openSearch = async () => {
  showSearch.value = true;
  await nextTick();
  searchInput.value?.focus();
};

const closeSearch = () => {
  showSearch.value = false;
  searchText.value = "";
};

const searchBooks = () => {
  const keyword = searchText.value.trim();
  if (!keyword) {
    openSearch();
    return;
  }
  closeMobileMenu();
  navigateTo({ path: "/browse", query: { search: keyword } });
  closeSearch();
};

const handleSearchKeydown = (e: KeyboardEvent) => {
  if (e.key === "Escape") closeSearch();
};

// ========================================
// Auth Logic
// ========================================
const loadUser = () => {
  if (!import.meta.client) return;
  const savedUser = localStorage.getItem("user");
  user.value = savedUser ? JSON.parse(savedUser) : null;
};

const logout = () => {
  localStorage.removeItem("user");
  user.value = null;
  clearWishlist();
  closeMobileMenu();
  window.dispatchEvent(new CustomEvent("auth-changed"));
  navigateTo("/auth/login");
};

const handleStorage = () => {
  loadUser();
  loadWishlist();
};

const handleResize = () => {
  if (window.innerWidth >= 768) {
    closeMobileMenu();
  }
};

onMounted(() => {
  loadUser();
  loadCart();
  loadWishlist();
  window.addEventListener("storage", handleStorage);
  window.addEventListener("auth-changed", handleStorage);
  window.addEventListener("resize", handleResize);
});

onBeforeUnmount(() => {
  if (import.meta.client) {
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener("auth-changed", handleStorage);
    window.removeEventListener("resize", handleResize);
  }
});
</script>

<template>
  <header class="sticky top-0 z-50 border-b border-stone-200/80 bg-[#f7f7f2]/95 backdrop-blur-md">
    <div class="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
      
      <!-- Brand Logo -->
      <NuxtLink to="/" class="group flex items-center gap-2 font-serif text-xl font-bold tracking-tight text-stone-900" @click="closeMobileMenu">
        <span class="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-800 text-xs font-sans font-bold text-white shadow-sm transition-transform duration-200 group-hover:scale-105">
          R+
        </span>
        <span>Read<span class="text-emerald-800">Plus</span></span>
      </NuxtLink>

      <!-- Desktop Navigation -->
      <nav class="hidden items-center gap-8 md:flex">
        <NuxtLink
          v-for="item in navItems"
          :key="item.path"
          :to="item.path"
          class="relative py-1 text-sm font-medium transition-colors hover:text-emerald-800"
          :class="isActive(item.path) ? 'font-semibold text-stone-900' : 'text-stone-500'"
        >
          {{ item.label }}
          <span
            v-if="isActive(item.path)"
            class="absolute -bottom-1 left-0 h-0.5 w-full rounded-full bg-emerald-800"
          />
        </NuxtLink>
<<<<<<< HEAD

        <!-- Browse -->

        <NuxtLink
          to="/browse"
          class="relative py-2 text-sm transition"
          :class="
            isActive('/browse')
              ? 'font-bold text-gray-950'
              : 'text-gray-600 hover:text-primary'
          "
        >
          Browse

          <span
            v-if="isActive('/browse')"
            class="absolute bottom-0 left-0 h-0.5 w-full rounded-full bg-primary"
          />
        </NuxtLink>

        <!-- Collections -->

        <NuxtLink
          to="/collection"
          class="relative py-2 text-sm transition"
          :class="
            isActive('/collection')
              ? 'font-bold text-gray-950'
              : 'text-gray-600 hover:text-primary'
          "
        >
          Collections

          <span
            v-if="isActive('/collection')"
            class="absolute bottom-0 left-0 h-0.5 w-full rounded-full bg-primary"
          />
        </NuxtLink>

        <!-- About -->

        <NuxtLink
          to="/about"
          class="relative py-2 text-sm transition"
          :class="
            isActive('/about')
              ? 'font-bold text-gray-950'
              : 'text-gray-600 hover:text-primary'
          "
        >
          About

          <span
            v-if="isActive('/about')"
            class="absolute bottom-0 left-0 h-0.5 w-full rounded-full bg-primary"
          />
        </NuxtLink>

        <!-- Admin -->

        <NuxtLink
          v-if="user?.role === 'admin'"
          to="/admin"
          class="relative py-2 text-sm font-semibold text-gray-700 transition hover:text-black"
        >
          Admin Dashboard
        </NuxtLink>
=======
>>>>>>> c7a6db1caddb0885b5a27066299d9d1e6fa3ffbf
      </nav>

      <!-- Desktop Action Group -->
      <div class="hidden items-center gap-2 sm:gap-3 md:flex">
        
        <!-- Clean Inline Search Bar -->
        <div class="relative flex items-center">
          <button
            v-if="!showSearch"
            type="button"
            aria-label="Search"
            class="flex h-9 w-9 items-center justify-center rounded-full text-stone-600 transition hover:bg-stone-200/50 hover:text-emerald-800"
            @click="openSearch"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor" class="h-5 w-5">
              <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-4.35-4.35m2.1-5.4a7.5 7.5 0 1 1-15 0 7.5 7.5 0 0 1 15 0Z" />
            </svg>
          </button>

          <form
            v-else
            class="flex w-52 sm:w-64 items-center gap-2 rounded-full border border-stone-300 bg-white px-3 py-1.5 transition-all duration-200"
            @submit.prevent="searchBooks"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor" class="h-4 w-4 shrink-0 text-stone-400">
              <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-4.35-4.35m2.1-5.4a7.5 7.5 0 1 1-15 0 7.5 7.5 0 0 1 15 0Z" />
            </svg>
            <input
              ref="searchInput"
              v-model="searchText"
              type="text"
              placeholder="Search books..."
              class="w-full border-0 bg-transparent p-0 text-xs text-stone-900 placeholder:text-stone-400 focus:border-none focus:outline-none focus:ring-0"
              style="outline: none !important; box-shadow: none !important; border: none !important;"
              @keydown="handleSearchKeydown"
            />
            <button
              type="button"
              class="px-0.5 text-sm font-bold leading-none text-stone-400 transition hover:text-stone-600"
              @click="closeSearch"
            >
              &#215;
            </button>
          </form>
        </div>

        <!-- Cart Badge Icon -->
        <button
          type="button"
          aria-label="Shopping Cart"
          class="relative flex h-9 w-9 items-center justify-center rounded-full text-stone-600 transition hover:bg-stone-200/50 hover:text-emerald-800"
          @click="goToCart"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor" class="h-5 w-5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M2.75 3.75h2.1l1.55 11.1a2 2 0 0 0 1.98 1.72h8.9a2 2 0 0 0 1.96-1.6L20.5 7H5.2" />
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 20.25h.01M17 20.25h.01" />
          </svg>
          <span
            v-if="cartCount > 0"
            class="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-800 text-[10px] font-bold text-white"
          >
            {{ cartCount }}
          </span>
        </button>

        <!-- Wishlist Badge Icon -->
        <NuxtLink
          to="/wishlist"
          aria-label="Wishlist"
          class="relative flex h-9 w-9 items-center justify-center rounded-full text-stone-600 transition hover:bg-stone-200/50 hover:text-emerald-800"
        >
          <UiIcon name="heart" class="h-5 w-5" />
          <span
            v-if="wishlistCount > 0"
            class="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-800 text-[10px] font-bold text-white"
          >
            {{ wishlistCount }}
          </span>
        </NuxtLink>

        <!-- Dynamic User/Auth Chip -->
        <div class="ml-1 border-l border-stone-300 pl-2">
          <template v-if="!user">
            <div class="flex items-center gap-1.5">
              <NuxtLink
                to="/auth/login"
                class="rounded-full px-3 py-1.5 text-xs font-semibold text-stone-600 transition hover:text-emerald-800"
              >
                Sign In
              </NuxtLink>
              <NuxtLink
                to="/auth/register"
                class="rounded-full bg-emerald-800 px-3.5 py-1.5 text-xs font-semibold text-white transition hover:bg-emerald-900"
              >
                Join
              </NuxtLink>
            </div>
          </template>

          <template v-else>
            <div class="flex items-center gap-2 rounded-full border border-stone-300 bg-white p-1 pr-3 shadow-sm">
              <NuxtLink to="/profile" class="flex items-center gap-2">
                <span class="flex h-7 w-7 items-center justify-center overflow-hidden rounded-full bg-emerald-800 text-xs font-bold text-white">
                  <img
                    v-if="user.profileImage"
                    :src="user.profileImage"
                    :alt="user.name"
                    class="h-full w-full object-cover"
                  />
                  <span v-else>{{ user.name?.charAt(0)?.toUpperCase() || "U" }}</span>
                </span>
                <span class="max-w-[90px] truncate text-xs font-medium text-stone-800">
                  {{ user.name }}
                </span>
              </NuxtLink>
              <button
                type="button"
                title="Logout"
                class="ml-1 text-stone-400 transition hover:text-rose-600"
                @click="logout"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor" class="h-4 w-4">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l3 3m0 0l-3 3m3-3H8.25" />
                </svg>
              </button>
            </div>
          </template>
        </div>

      </div>

      <!-- Mobile Right Group (Cart + Hamburger Toggle) -->
      <div class="flex items-center gap-2 md:hidden">
        <button
          type="button"
          aria-label="Shopping Cart"
          class="relative flex h-9 w-9 items-center justify-center rounded-full text-stone-600 transition hover:bg-stone-200/50 hover:text-emerald-800"
          @click="goToCart"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor" class="h-5 w-5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M2.75 3.75h2.1l1.55 11.1a2 2 0 0 0 1.98 1.72h8.9a2 2 0 0 0 1.96-1.6L20.5 7H5.2" />
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 20.25h.01M17 20.25h.01" />
          </svg>
          <span
            v-if="cartCount > 0"
            class="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-800 text-[10px] font-bold text-white"
          >
            {{ cartCount }}
          </span>
        </button>

        <!-- Toggle Button -->
        <button
          type="button"
          aria-label="Toggle navigation menu"
          class="flex h-9 w-9 items-center justify-center rounded-lg text-stone-700 hover:bg-stone-200/50"
          @click="toggleMobileMenu"
        >
          <svg v-if="!isMobileMenuOpen" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor" class="h-6 w-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor" class="h-6 w-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

    </div>

    <!-- Mobile Drawer Overlay -->
    <div
      v-if="isMobileMenuOpen"
      class="fixed inset-0 z-40 bg-stone-900/40 backdrop-blur-sm md:hidden"
      @click="closeMobileMenu"
    />

    <!-- Mobile Drawer Menu -->
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="-translate-y-4 opacity-0"
      enter-to-class="translate-y-0 opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="translate-y-0 opacity-100"
      leave-to-class="-translate-y-4 opacity-0"
    >
      <div
        v-if="isMobileMenuOpen"
        class="absolute inset-x-0 top-full z-50 border-b border-stone-200 bg-[#f7f7f2] p-4 shadow-xl md:hidden"
      >
        <!-- Mobile Search Input -->
        <form class="mb-4 flex items-center gap-2 rounded-full border border-stone-300 bg-white px-3 py-2" @submit.prevent="searchBooks">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor" class="h-4 w-4 shrink-0 text-stone-400">
            <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-4.35-4.35m2.1-5.4a7.5 7.5 0 1 1-15 0 7.5 7.5 0 0 1 15 0Z" />
          </svg>
          <input
            v-model="searchText"
            type="text"
            placeholder="Search books..."
            class="w-full border-0 bg-transparent p-0 text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-0"
          />
          <button type="submit" class="text-xs font-semibold text-emerald-800">
            Search
          </button>
        </form>

        <!-- Navigation Links -->
        <nav class="flex flex-col gap-1">
          <NuxtLink
            v-for="item in navItems"
            :key="item.path"
            :to="item.path"
            class="rounded-lg px-3 py-2 text-sm font-medium transition-colors"
            :class="isActive(item.path) ? 'bg-emerald-800/10 font-semibold text-emerald-800' : 'text-stone-700 hover:bg-stone-200/50'"
            @click="closeMobileMenu"
          >
            {{ item.label }}
          </NuxtLink>

          <NuxtLink
            to="/wishlist"
            class="flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium text-stone-700 hover:bg-stone-200/50"
            @click="closeMobileMenu"
          >
            <span class="flex items-center gap-2">
              <UiIcon name="heart" class="h-4 w-4 text-stone-500" />
              Wishlist
            </span>
            <span v-if="wishlistCount > 0" class="rounded-full bg-emerald-800 px-2 py-0.5 text-[10px] font-bold text-white">
              {{ wishlistCount }}
            </span>
          </NuxtLink>
        </nav>

        <hr class="my-3 border-stone-200" />

        <!-- User Options Mobile -->
        <div v-if="!user" class="flex flex-col gap-2">
          <NuxtLink
            to="/auth/login"
            class="w-full rounded-full border border-stone-300 py-2 text-center text-xs font-semibold text-stone-700 transition hover:bg-stone-100"
            @click="closeMobileMenu"
          >
            Sign In
          </NuxtLink>
          <NuxtLink
            to="/auth/register"
            class="w-full rounded-full bg-emerald-800 py-2 text-center text-xs font-semibold text-white transition hover:bg-emerald-900"
            @click="closeMobileMenu"
          >
            Join ReadPlus
          </NuxtLink>
        </div>

<<<<<<< HEAD
        <!-- ================================= -->
        <!-- LOGGED IN -->
        <!-- ================================= -->

        <template v-else>
          <NuxtLink
            v-if="user.role !== 'admin'"
            to="/profile"
            class="flex items-center gap-2 text-gray-700 transition hover:text-black"
          >
            <!-- User Icon -->

            <span
              class="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-primary text-sm font-bold text-white"
            >
=======
        <div v-else class="flex items-center justify-between rounded-xl border border-stone-200 bg-white p-2.5 shadow-sm">
          <NuxtLink to="/profile" class="flex items-center gap-3" @click="closeMobileMenu">
            <span class="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-emerald-800 text-xs font-bold text-white">
>>>>>>> c7a6db1caddb0885b5a27066299d9d1e6fa3ffbf
              <img
                v-if="user.profileImage"
                :src="user.profileImage"
                :alt="user.name"
                class="h-full w-full object-cover"
              />
              <span v-else>{{ user.name?.charAt(0)?.toUpperCase() || "U" }}</span>
            </span>
            <div>
              <p class="text-xs font-semibold text-stone-900">{{ user.name }}</p>
              <p class="text-[10px] text-stone-500">View profile</p>
            </div>
          </NuxtLink>
          <button
            type="button"
            class="rounded-lg p-1.5 text-stone-400 hover:bg-rose-50 hover:text-rose-600"
            title="Logout"
            @click="logout"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor" class="h-5 w-5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l3 3m0 0l-3 3m3-3H8.25" />
            </svg>
          </button>
        </div>
      </div>
    </Transition>
  </header>
</template>