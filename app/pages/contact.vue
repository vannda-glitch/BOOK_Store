<template>
  <div class="min-h-screen bg-amber-50">
    <!-- Header -->
    <section class="bg-blue-700 py-20 px-5 text-center text-white">
      <div class="max-w-2xl mx-auto">
        <h1 class="text-5xl font-bold mb-4 tracking-wide">Get In Touch</h1>
        <p class="text-lg font-light opacity-95">Have questions about our books? We're here to help!</p>
      </div>
    </section>

    <!-- Main Content -->
    <div class="max-w-6xl mx-auto px-5 py-16">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        <!-- Contact Methods -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="bg-white p-9 rounded-lg shadow-md hover:shadow-lg hover:-translate-y-1 transition-all">
            <div class="text-5xl mb-4">📞</div>
            <h3 class="text-lg font-bold text-gray-800 mb-3">Call Us</h3>
            <p class="text-sm text-gray-600 leading-relaxed"> (+855) 8143-5923</p>
            <p class="mt-2 text-xs text-gray-600 leading-relaxed">Mon-Fri: 9AM - 6PM EST<br>Sat: 10AM - 4PM EST<br>Sun: Closed</p>
          </div>

          <div class="bg-white p-9 rounded-lg shadow-md hover:shadow-lg hover:-translate-y-1 transition-all">
            <div class="text-5xl mb-4">📧</div>
            <h3 class="text-lg font-bold text-gray-800 mb-3">Email Us</h3>
            <p class="text-sm text-gray-600 leading-relaxed"><a href="mailto:support@bookstore.com" class="text-blue-800 font-semibold hover:text-blue-700 hover:underline">support@bookstore.com</a></p>
            <p class="mt-2 text-xs text-gray-600 leading-relaxed">Orders: orders@bookstore.com<br>Returns: returns@bookstore.com</p>
          </div>

          <div class="bg-white p-9 rounded-lg shadow-md hover:shadow-lg hover:-translate-y-1 transition-all">
            <div class="text-5xl mb-4">📍</div>
            <h3 class="text-lg font-bold text-gray-800 mb-3">Visit Us</h3>
            <p class="text-sm text-gray-600 leading-relaxed">123 Book Lane<br>Reading City, RC 12345</p>
            <p class="mt-2 text-xs text-gray-600 leading-relaxed">Store Hours:<br>Mon-Sat: 9AM - 9PM<br>Sun: 11AM - 6PM</p>
          </div>

          <div class="bg-white p-9 rounded-lg shadow-md hover:shadow-lg hover:-translate-y-1 transition-all">
            <div class="text-5xl mb-4">💬</div>
            <h3 class="text-lg font-bold text-gray-800 mb-3">Live Chat</h3>
            <p class="text-sm text-gray-600 leading-relaxed">Chat with our team instantly</p>
            <button class="mt-3 px-6 py-2 bg-blue-800 text-white rounded hover:bg-blue-700 hover:-translate-y-0.5 transition-all font-semibold text-sm">Start Chat</button>
          </div>
        </div>

        <!-- Contact Form -->
        <div class="bg-white p-10 rounded-lg shadow-md">
          <h2 class="text-2xl font-bold text-gray-800 mb-8 pb-4 border-b-4 border-blue-800">Send us a Message</h2>
          <form @submit.prevent="submitForm" class="flex flex-col gap-5">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div class="flex flex-col gap-2">
                <label for="name" class="text-sm font-semibold text-gray-800">Full Name</label>
                <input 
                  id="name"
                  v-model="form.name" 
                  type="text" 
                  placeholder="John Doe"
                  class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-800 focus:bg-amber-50 transition-all"
                  required
                />
              </div>
              <div class="flex flex-col gap-2">
                <label for="email" class="text-sm font-semibold text-gray-800">Email</label>
                <input 
                  id="email"
                  v-model="form.email" 
                  type="email" 
                  placeholder="you@example.com"
                  class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-800 focus:bg-amber-50 transition-all"
                  required
                />
              </div>
            </div>

            <div class="flex flex-col gap-2">
              <label for="message" class="text-sm font-semibold text-gray-800">Message</label>
              <textarea 
                id="message"
                v-model="form.message" 
                placeholder="Tell us how we can help..."
                class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-800 focus:bg-amber-50 transition-all resize-vertical min-h-40"
                required
              ></textarea>
            </div>

            <button type="submit" class="px-10 py-3 bg-blue-800 text-white rounded-lg font-bold mt-2 tracking-wide hover:bg-blue-700 hover:-translate-y-0.5 transition-all active:translate-y-0 self-center">Send Message</button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const form = ref({
  name: '',
  email: '',
  message: ''
})

const submitForm = () => {
  console.log('Form submitted:', form.value)
  alert('Thank you for contacting us! We will respond within 24 hours.')
  form.value = {
    name: '',
    email: '',
    message: ''
  }
}
</script>

