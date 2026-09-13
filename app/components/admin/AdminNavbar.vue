<script setup lang="ts">
const open = defineModel<boolean>("open", { default: false });
const user = ref<{
  name?: string;
  email?: string;
  profileImage?: string;
} | null>(null);

const loadUser = () => {
  const saved = localStorage.getItem("user");
  if (saved) user.value = JSON.parse(saved);
  else user.value = null;
};

onMounted(() => {
  loadUser();
  window.addEventListener("auth-changed", loadUser);
});

onBeforeUnmount(() => window.removeEventListener("auth-changed", loadUser));
</script>

<template>
  <header
    class="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-[#d9e7e2] bg-white/85 px-5 shadow-sm backdrop-blur sm:px-8"
  >
    <button
      class="rounded-xl border border-[#d9e7e2] p-2.5 text-gray-600 hover:text-primary lg:hidden"
      aria-label="Open menu"
      @click="open = true"
    >
      &#9776;
    </button>
    <div class="hidden lg:block">
      <p class="text-[10px] font-bold uppercase tracking-[0.24em] text-primary">
        ReadPlus Management
      </p>
      <p class="text-sm text-gray-500">A clear view of your bookstore.</p>
    </div>
    <div class="flex items-center gap-3">
      <div class="hidden text-right sm:block">
        <p class="text-sm font-semibold text-ink">
          {{ user?.name || "Administrator" }}
        </p>
        <p class="text-xs text-gray-500">
          {{ user?.email || "Admin account" }}
        </p>
      </div>
      <div
        class="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-primary font-bold text-white"
      >
        <img
          v-if="user?.profileImage"
          :src="user.profileImage"
          :alt="user.name"
          class="h-full w-full object-cover"
        /><span v-else>{{
          (user?.name || "A").slice(0, 1).toUpperCase()
        }}</span>
      </div>
    </div>
  </header>
</template>
