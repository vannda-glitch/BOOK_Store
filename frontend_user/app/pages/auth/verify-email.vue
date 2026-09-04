<template>
  <div>
    <h2 class="text-2xl font-bold text-gray-900 text-center mb-6">
      Verify Your Email
    </h2>
    <EmailVerification />
  </div>
</template>

<script setup lang="ts">
import EmailVerification from '~/components/auth/EmailVerification.vue'

definePageMeta({
  layout: 'auth'
})
</script>