<template>
  <div>
    <h2 class="text-2xl font-bold text-gray-900 text-center mb-6">
      Forgot Password
    </h2>
    <ForgotPasswordForm />
  </div>
</template>

<script setup lang="ts">
import ForgotPasswordForm from '~/components/auth/ForgotPasswordForm.vue'

definePageMeta({
  layout: 'auth',
  middleware: 'guest'
})
</script>