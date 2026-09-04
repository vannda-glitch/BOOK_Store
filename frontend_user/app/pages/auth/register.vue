<template>
  <div>
    <h2 class="text-2xl font-bold text-gray-900 text-center mb-6">
      Create Account
    </h2>
    <RegisterForm />
  </div>
</template>

<script setup lang="ts">
import RegisterForm from '~/components/auth/RegisterForm.vue'

definePageMeta({
  layout: 'auth',
  middleware: 'guest'
})
</script>