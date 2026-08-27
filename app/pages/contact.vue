<template>
  <div class="min-h-screen bg-gray-50">

    <!-- Hero Section -->
    <section class="bg-indigo-600 text-white  max-w-7xl mx-auto mt-2 rounded-2xl">
      <div class="max-w-7xl mx-auto px-6 py-10 text-center">
        <div class="text-5xl mb-5">📚</div>

        <h1 class="text-4xl md:text-5xl font-bold mb-4">
          Get in Touch With Us
        </h1>

        <p class="max-w-2xl mx-auto text-indigo-100 text-lg">
          Have a question about our books, orders, or delivery?
          We are here to help.
        </p>
      </div>
    </section>


    <!-- Contact Section -->
    <section class="max-w-7xl mx-auto px-6 py-16">

      <div class="grid lg:grid-cols-3 gap-8">

        <!-- Contact Information -->
        <div class="lg:col-span-1">

          <h2 class="text-2xl font-bold text-gray-900 mb-6">
            Contact Information
          </h2>

          <div class="space-y-5">

            <!-- Address -->
            <div class="flex gap-4 bg-white p-5 rounded-xl shadow-sm">
              <div class="text-2xl">📍</div>

              <div>
                <h3 class="font-semibold text-gray-900">
                  Address
                </h3>

                <p class="text-gray-500 mt-1">
                  Phnom Penh, Cambodia
                </p>
              </div>
            </div>


            <!-- Phone -->
            <div class="flex gap-4 bg-white p-5 rounded-xl shadow-sm">
              <div class="text-2xl">📞</div>

              <div>
                <h3 class="font-semibold text-gray-900">
                  Phone
                </h3>

                <p class="text-gray-500 mt-1">
                  +855 12 345 678
                </p>
              </div>
            </div>


            <!-- Email -->
            <div class="flex gap-4 bg-white p-5 rounded-xl shadow-sm">
              <div class="text-2xl">📧</div>

              <div>
                <h3 class="font-semibold text-gray-900">
                  Email
                </h3>

                <p class="text-gray-500 mt-1">
                  support@booknest.com
                </p>
              </div>
            </div>


            <!-- Opening Hours -->
            <div class="flex gap-4 bg-white p-5 rounded-xl shadow-sm">
              <div class="text-2xl">🕐</div>

              <div>
                <h3 class="font-semibold text-gray-900">
                  Opening Hours
                </h3>

                <p class="text-gray-500 mt-1">
                  Mon - Fri: 8:00 AM - 8:00 PM
                </p>

                <p class="text-gray-500">
                  Sat - Sun: 9:00 AM - 6:00 PM
                </p>
              </div>
            </div>

          </div>
        </div>


        <!-- Contact Form -->
        <div class="lg:col-span-2 bg-white rounded-2xl shadow-sm p-8">

          <h2 class="text-2xl font-bold text-gray-900 mb-2">
            Send Us a Message
          </h2>

          <p class="text-gray-500 mb-8">
            Fill out the form below and our team will get back to you.
          </p>


          <form @submit.prevent="submitForm">

            <!-- Name + Email -->
            <div class="grid md:grid-cols-2 gap-6">

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>

                <input
                  v-model="form.name"
                  type="text"
                  placeholder="Enter your name"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg
                         focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>


              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>

                <input
                  v-model="form.email"
                  type="email"
                  placeholder="Enter your email"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg
                         focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

            </div>


            <!-- Phone + Subject -->
            <div class="grid md:grid-cols-2 gap-6 mt-6">

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Phone
                </label>

                <input
                  v-model="form.phone"
                  type="tel"
                  placeholder="+855 12 345 678"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg
                         focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>


              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Subject
                </label>

                <select
                  v-model="form.subject"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg
                         focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Select a subject</option>
                  <option value="order">Order Question</option>
                  <option value="book">Book Availability</option>
                  <option value="delivery">Delivery</option>
                  <option value="payment">Payment</option>
                  <option value="other">Other</option>
                </select>
              </div>

            </div>


            <!-- Message -->
            <div class="mt-6">

              <label class="block text-sm font-medium text-gray-700 mb-2">
                Message
              </label>

              <textarea
                v-model="form.message"
                rows="6"
                placeholder="Write your message..."
                class="w-full px-4 py-3 border border-gray-300 rounded-lg
                       focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              ></textarea>

            </div>


            <!-- Submit Button -->
            <button
              type="submit"
              class="mt-6 bg-indigo-600 text-white px-7 py-3 rounded-lg
                     font-semibold hover:bg-indigo-700 transition"
            >
              Send Message →
            </button>

          </form>

        </div>

      </div>

    </section>


    <!-- FAQ Section -->
    <section class="bg-white py-16">

      <div class="max-w-4xl mx-auto px-6">

        <div class="text-center mb-10">

          <p class="text-indigo-600 font-semibold">
            FAQ
          </p>

          <h2 class="text-3xl font-bold text-gray-900 mt-2">
            Frequently Asked Questions
          </h2>

        </div>


        <div class="space-y-4">

          <details class="border border-gray-200 rounded-xl p-5">
            <summary class="font-semibold cursor-pointer">
              How can I order a book?
            </summary>

            <p class="text-gray-500 mt-3">
              Browse our books, select the book you want, add it to your
              cart, and complete the checkout process.
            </p>
          </details>


          <details class="border border-gray-200 rounded-xl p-5">
            <summary class="font-semibold cursor-pointer">
              How long does delivery take?
            </summary>

            <p class="text-gray-500 mt-3">
              Delivery usually takes between 1-3 business days depending
              on your location.
            </p>
          </details>


          <details class="border border-gray-200 rounded-xl p-5">
            <summary class="font-semibold cursor-pointer">
              Can I return a book?
            </summary>

            <p class="text-gray-500 mt-3">
              Yes. Please contact our support team if you receive a damaged
              or incorrect book.
            </p>
          </details>


          <details class="border border-gray-200 rounded-xl p-5">
            <summary class="font-semibold cursor-pointer">
              What payment methods do you accept?
            </summary>

            <p class="text-gray-500 mt-3">
              We support several convenient payment methods including
              online payments and cash on delivery.
            </p>
          </details>

        </div>

      </div>

    </section>


    <!-- CTA -->
    <section class="bg-indigo-600 text-white">

      <div class="max-w-4xl mx-auto px-6 py-16 text-center">

        <div class="text-4xl mb-4">
          📖
        </div>

        <h2 class="text-3xl font-bold mb-4">
          Looking for Your Next Book?
        </h2>

        <p class="text-indigo-100 mb-7">
          Explore our collection and discover your next favorite book.
        </p>

        <NuxtLink
          to="/books"
          class="inline-block bg-white text-indigo-600 px-7 py-3
                 rounded-lg font-semibold hover:bg-gray-100 transition"
        >
          Browse Books →
        </NuxtLink>

      </div>

    </section>

  </div>
</template>


<script setup>

import { reactive } from 'vue'

const form = reactive({
  name: '',
  email: '',
  phone: '',
  subject: '',
  message: ''
})

const submitForm = () => {
  console.log('Contact Form:', form)

  alert('Thank you! Your message has been sent.')

  // Reset form
  form.name = ''
  form.email = ''
  form.phone = ''
  form.subject = ''
  form.message = ''
}

</script>