<template>
  <div>
    <h2 class="text-2xl font-bold text-gray-900 text-center mb-6">
      Reset Password
    </h2>
    <ResetPasswordForm />
  </div>
</template>

<script setup lang="ts">
import ResetPasswordForm from '~/components/auth/ResetPasswordForm.vue'

definePageMeta({
  layout: 'auth',
  middleware: 'guest'
})
</script>