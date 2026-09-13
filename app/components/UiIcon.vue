<script setup lang="ts">
defineProps<{
  name:
    | "heart"
    | "grid"
    | "book"
    | "tag"
    | "bag"
    | "users"
    | "user"
    | "x"
    | "cart"
    | "star"
    | "check"
    | "alert";
}>();
</script>

<template>
  <svg
    v-if="name === 'heart'"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    stroke-width="1.8"
    aria-hidden="true"
  >
    <path
      stroke-linecap="round"
      stroke-linejoin="round"
      d="m12 20.25-.83-.75C5.4 14.5 2.25 11.64 2.25 8.2A4.45 4.45 0 0 1 6.75 3.75c1.7 0 3.33.8 4.38 2.06a5.73 5.73 0 0 1 4.37-2.06 4.45 4.45 0 0 1 4.5 4.45c0 3.44-3.15 6.3-8.92 11.3l-.83.75Z"
    />
  </svg>
  <svg
    v-else-if="name === 'grid'"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    stroke-width="1.8"
    aria-hidden="true"
  >
    <path
      stroke-linecap="round"
      stroke-linejoin="round"
      d="M4 4h6v6H4V4Zm10 0h6v6h-6V4ZM4 14h6v6H4v-6Zm10 0h6v6h-6v-6Z"
    />
  </svg>
  <svg
    v-else-if="name === 'book'"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    stroke-width="1.8"
    aria-hidden="true"
  >
    <path
      stroke-linecap="round"
      stroke-linejoin="round"
      d="M5 4.75A2.75 2.75 0 0 1 7.75 2H20v17H7.75A2.75 2.75 0 0 0 5 21.75v-17ZM5 19.5A2.75 2.75 0 0 1 7.75 17H20"
    />
  </svg>
  <svg
    v-else-if="name === 'tag'"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    stroke-width="1.8"
    aria-hidden="true"
  >
    <path
      stroke-linecap="round"
      stroke-linejoin="round"
      d="m4 4 7.5-.5L20.5 12 12 20.5 3.5 12 4 4Z"
    />
    <path stroke-linecap="round" stroke-linejoin="round" d="M8 8h.01" />
  </svg>
  <svg
    v-else-if="name === 'bag'"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    stroke-width="1.8"
    aria-hidden="true"
  >
    <path
      stroke-linecap="round"
      stroke-linejoin="round"
      d="M5 8.5h14l1 12H4l1-12Z"
    />
    <path
      stroke-linecap="round"
      stroke-linejoin="round"
      d="M8.5 8.5V6a3.5 3.5 0 0 1 7 0v2.5"
    />
  </svg>
  <svg
    v-else-if="name === 'users'"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    stroke-width="1.8"
    aria-hidden="true"
  >
    <path
      stroke-linecap="round"
      stroke-linejoin="round"
      d="M16 20v-1.5a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4V20M9.5 10.5A3.5 3.5 0 1 0 9.5 3a3.5 3.5 0 0 0 0 7.5ZM17 11a3 3 0 1 0 0-6M21 20v-1.5a4 4 0 0 0-3-3.87"
    />
  </svg>
  <svg
    v-else-if="name === 'user'"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    stroke-width="1.8"
    aria-hidden="true"
  >
    <path
      stroke-linecap="round"
      stroke-linejoin="round"
      d="M15.75 7.5a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.8 20.25a7.2 7.2 0 0 1 14.4 0"
    />
  </svg>
  <svg
    v-else-if="name === 'cart'"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    stroke-width="1.8"
    aria-hidden="true"
  >
    <path
      stroke-linecap="round"
      stroke-linejoin="round"
      d="M2.75 3.75h2.1l1.55 11.1a2 2 0 0 0 1.98 1.72h8.9a2 2 0 0 0 1.96-1.6L20.5 7H5.2M9 20.25h.01M17 20.25h.01"
    />
  </svg>
  <svg
    v-else-if="name === 'star'"
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <path
      d="m12 3 2.78 5.63 6.22.9-4.5 4.39 1.06 6.2L12 17.2l-5.56 2.92 1.06-6.2L3 9.53l6.22-.9L12 3Z"
    />
  </svg>
  <svg
    v-else-if="name === 'check'"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    stroke-width="2"
    aria-hidden="true"
  >
    <path
      stroke-linecap="round"
      stroke-linejoin="round"
      d="m5 12.5 4.5 4.5L19 7.5"
    />
  </svg>
  <svg
    v-else-if="name === 'alert'"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    stroke-width="1.8"
    aria-hidden="true"
  >
    <path
      stroke-linecap="round"
      stroke-linejoin="round"
      d="M12 8v4m0 4h.01M10.3 3.9 2.8 17a1.5 1.5 0 0 0 1.3 2.25h15.8A1.5 1.5 0 0 0 21.2 17L13.7 3.9a2 2 0 0 0-3.4 0Z"
    />
  </svg>
  <svg
    v-else
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    stroke-width="1.8"
    aria-hidden="true"
  >
    <path
      stroke-linecap="round"
      stroke-linejoin="round"
      d="M6 6 18 18M18 6 6 18"
    />
  </svg>
</template>
