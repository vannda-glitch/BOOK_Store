<template>
  <div class="min-h-screen bg-paper">

    <!-- Hero Section -->
    <section class="mx-auto mt-5 max-w-7xl rounded-[1.75rem] border border-[#dce9e4] bg-[#17201f] text-white shadow-[0_24px_70px_rgba(23,32,31,0.12)]">
      <div class="max-w-7xl mx-auto px-6 py-10 text-center">
        <div class="mb-5 text-4xl px-145"><img src="https://img.icons8.com/?size=100&id=9HuXC128p4_T&format=png&color=000000" alt=""></div>

        <h1 class="font-serif text-4xl font-bold md:text-5xl">
          Get in Touch With Us
        </h1>

        <p class="mx-auto max-w-2xl text-base text-gray-300 sm:text-lg">
          Have a question about our books, orders, or delivery?
          We are here to help.
        </p>
      </div>
    </section>


    <!-- Contact Section -->
    <section class="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-16">

      <div class="grid lg:grid-cols-3 gap-8">

        <!-- Contact Information -->
        <div class="lg:col-span-1">

          <h2 class="mb-6 font-serif text-2xl font-bold text-ink">
            Contact Information
          </h2>

          <div class="space-y-5">

            <!-- Address -->
            <div class="flex gap-4 rounded-2xl border border-[#dce9e4] bg-white/80 p-5 shadow-sm">
              <div class="text-2xl w-[40px] h-[40px]"><img src="https://img.icons8.com/?size=100&id=FQFxqQSmZBIv&format=png&color=000000" alt=""></div>

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
            <div class="flex gap-4 rounded-2xl border border-[#dce9e4] bg-white/80 p-5 shadow-sm">
              <div class="text-2xl w-[40px] h-[40px]"><img src="https://img.icons8.com/?size=100&id=9659&format=png&color=000000" alt=""></div>

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
            <div class="flex gap-4 rounded-2xl border border-[#dce9e4] bg-white/80 p-5 shadow-sm">
              <div class="text-2xl w-[40px] h-[40px]"> <img src="https://img.icons8.com/?size=100&id=eBEo6FOQZ3v4&format=png&color=000000" alt=""> </div>

              <div>
                <h3 class="font-semibold text-gray-900">
                  Email
                </h3>

                <p class="text-gray-500 mt-1">
                  support@readplus.com
                </p>
              </div>
            </div>


            <!-- Opening Hours -->
            <div class="flex gap-4 rounded-2xl border border-[#dce9e4] bg-white/80 p-5 shadow-sm">
              <div class="text-2xl w-[40px] h-[40px] py-4"><img src="https://img.icons8.com/?size=100&id=bDrb5MdYaEje&format=png&color=000000" alt=""></div>

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
        <div class="lg:col-span-2 rounded-2xl border border-[#dce9e4] bg-white/80 p-6 shadow-sm backdrop-blur sm:p-8">

          <h2 class="mb-2 font-serif text-2xl font-bold text-ink">
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
              class="mt-6 rounded-xl bg-primary px-7 py-3 font-semibold text-white shadow-lg shadow-primary/20 transition hover:bg-[#0b5f59]"
            >
              Send Message →
            </button>

          </form>

        </div>

      </div>

    </section>


    <!-- FAQ Section -->
    <section class="border-y border-[#dce9e4] bg-white/70 py-16">

      <div class="max-w-4xl mx-auto px-6">

        <div class="text-center mb-10">

          <p class="font-semibold text-primary">
            FAQ
          </p>

          <h2 class="mt-2 font-serif text-3xl font-bold text-ink">
            Frequently Asked Questions
          </h2>

        </div>


        <div class="space-y-4">

          <details class="rounded-2xl border border-[#dce9e4] bg-white/80 p-5 shadow-sm">
            <summary class="font-semibold cursor-pointer">
              How can I order a book?
            </summary>

            <p class="text-gray-500 mt-3">
              Browse our books, select the book you want, add it to your
              cart, and complete the checkout process.
            </p>
          </details>


          <details class="rounded-2xl border border-[#dce9e4] bg-white/80 p-5 shadow-sm">
            <summary class="font-semibold cursor-pointer">
              How long does delivery take?
            </summary>

            <p class="text-gray-500 mt-3">
              Delivery usually takes between 1-3 business days depending
              on your location.
            </p>
          </details>


          <details class="rounded-2xl border border-[#dce9e4] bg-white/80 p-5 shadow-sm">
            <summary class="font-semibold cursor-pointer">
              Can I return a book?
            </summary>

            <p class="text-gray-500 mt-3">
              Yes. Please contact our support team if you receive a damaged
              or incorrect book.
            </p>
          </details>


          <details class="rounded-2xl border border-[#dce9e4] bg-white/80 p-5 shadow-sm">
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
    <section class="bg-[#17201f] text-white">

      <div class="max-w-4xl mx-auto px-6 py-16 text-center">

        <div class="text-4xl mb-4 px-93">
          <img src="https://img.icons8.com/?size=100&id=43131&format=png&color=000000" alt="">
        </div>

        <h2 class="text-3xl font-bold mb-4">
          Looking for Your Next Book?
        </h2>

        <p class="text-indigo-100 mb-7">
          Explore our collection and discover your next favorite book.
        </p>

        <NuxtLink
          to="/books"
             class="inline-block rounded-xl bg-white px-7 py-3 font-semibold text-primary transition hover:bg-[#eaf6f3]"
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