<script setup lang="ts">
import { ref } from "vue";

definePageMeta({
  layout: "admin",
  middleware: "admin",
});

// --- State ---
const notifications = ref(true);
const isSaved = ref(false);
let timeoutId: number | null = null;

// --- Methods ---
const saveSettings = () => {
  isSaved.value = true;
  
  // Clear any existing timeout to prevent state flickering on rapid clicks
  if (timeoutId) window.clearTimeout(timeoutId);
  
  timeoutId = window.setTimeout(() => {
    isSaved.value = false;
  }, 2500);
};
</script>

<template>
  <section class="mx-auto max-w-6xl p-4 sm:p-6 lg:p-8">
    <!-- Header -->
    <header class="mb-8">
      <p class="text-xs font-bold uppercase tracking-widest text-primary">
        Workspace
      </p>
      <h1 class="mt-2 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
        Settings
      </h1>
      <p class="mt-1 text-sm text-gray-500">
        Manage your admin workspace preferences and notifications.
      </p>
    </header>

    <!-- Settings Card -->
    <div class="max-w-xl rounded-xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
      
      <!-- Notifications Toggle -->
      <div class="flex items-start justify-between gap-6">
        <div class="flex flex-col">
          <label id="notifications-label" class="text-sm font-semibold text-gray-900">
            Order Notifications
          </label>
          <p class="mt-1 text-sm text-gray-500">
            Receive updates and alerts when new orders are placed.
          </p>
        </div>

        <!-- Custom Tailwind Toggle Switch -->
        <button
          type="button"
          role="switch"
          :aria-checked="notifications"
          aria-labelledby="notifications-label"
          class="relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2"
          :class="notifications ? 'bg-primary' : 'bg-gray-200'"
          @click="notifications = !notifications"
        >
          <span
            aria-hidden="true"
            class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
            :class="notifications ? 'translate-x-5' : 'translate-x-0'"
          />
        </button>
      </div>

      <hr class="my-6 border-gray-100" />

      <!-- Action Footer -->
      <div class="flex justify-end">
        <button
          type="button"
          class="flex min-w-[140px] items-center justify-center rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2"
          :class="isSaved ? 'bg-emerald-600 hover:bg-emerald-600' : 'hover:bg-primary/90'"
          :disabled="isSaved"
          @click="saveSettings"
        >
          <transition mode="out-in" name="fade">
            <span v-if="isSaved" class="flex items-center gap-2">
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              Saved
            </span>
            <span v-else>
              Save Settings
            </span>
          </transition>
        </button>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* Optional smooth transition for the button text */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>