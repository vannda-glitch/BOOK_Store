<template>
  <div>
    <!-- Hero -->
    <section class="bg-[#e9edf5]">
      <div class="mx-auto max-w-[1600px] px-6 pb-14 pt-12 lg:px-12 lg:pt-16">
        <div class="text-center">
          <p class="mb-5 text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
            Get in Touch
          </p>
          <h1 class="font-serif text-5xl font-bold leading-[1.05] tracking-tight text-gray-950 sm:text-6xl">
            Contact Us
          </h1>
          <p class="mx-auto mt-6 max-w-2xl text-base leading-7 text-gray-600 sm:text-lg">
            Have a question about our books, orders, or delivery? We are here to help.
          </p>
        </div>
      </div>
    </section>

    <!-- Contact Content -->
    <section class="mx-auto max-w-[1600px] px-6 py-20 lg:px-12">
      <div class="grid lg:grid-cols-3 gap-8">
        <!-- Contact Info Cards -->
        <div class="space-y-5">
          <div class="border border-gray-200 bg-white p-6 rounded-2xl shadow-sm">
            <h3 class="font-semibold text-gray-900 mb-1">Address</h3>
            <p class="text-sm text-gray-500">123 Book Street, Reading, NY 10001</p>
          </div>
          <div class="border border-gray-200 bg-white p-6 rounded-2xl shadow-sm">
            <h3 class="font-semibold text-gray-900 mb-1">Phone</h3>
            <p class="text-sm text-gray-500">+1 (555) 123-4567</p>
          </div>
          <div class="border border-gray-200 bg-white p-6 rounded-2xl shadow-sm">
            <h3 class="font-semibold text-gray-900 mb-1">Email</h3>
            <p class="text-sm text-gray-500">support@bookstore.com</p>
          </div>
          <div class="border border-gray-200 bg-white p-6 rounded-2xl shadow-sm">
            <h3 class="font-semibold text-gray-900 mb-1">Business Hours</h3>
            <p class="text-sm text-gray-500">Mon - Fri: 9:00 AM - 6:00 PM</p>
            <p class="text-sm text-gray-500">Sat: 10:00 AM - 4:00 PM / Sun: Closed</p>
          </div>
        </div>

        <!-- Contact Form -->
        <div class="lg:col-span-2 border border-gray-200 bg-white rounded-2xl p-8 md:p-10 shadow-sm">
          <h2 class="font-serif text-2xl font-bold text-gray-900 mb-2">
            Send Us a Message
          </h2>
          <p class="text-sm text-gray-500 mb-8">
            Fill out the form below and our support team will get back to you shortly.
          </p>

          <form @submit.prevent="handleSubmit" class="space-y-6">
            <div class="grid md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  v-model="form.name"
                  type="text"
                  placeholder="Enter your name"
                  class="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-gray-950 focus:ring-1 focus:ring-gray-950"
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
                  class="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-gray-950 focus:ring-1 focus:ring-gray-950"
                  required
                />
              </div>
            </div>

            <div class="grid md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Phone
                </label>
                <input
                  v-model="form.phone"
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  class="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-gray-950 focus:ring-1 focus:ring-gray-950"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Subject
                </label>
                <select
                  v-model="form.subject"
                  class="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-gray-950 focus:ring-1 focus:ring-gray-950"
                  required
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

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Message
              </label>
              <textarea
                v-model="form.message"
                rows="6"
                placeholder="Write your message..."
                class="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-gray-950 focus:ring-1 focus:ring-gray-950"
                required
              ></textarea>
            </div>

            <button
              type="submit"
              class="inline-flex items-center gap-2 bg-black px-7 py-3 rounded-xl text-sm font-semibold text-white transition hover:bg-gray-800 disabled:opacity-50"
              :disabled="loading"
            >
              <LoadingSpinner v-if="loading" size="sm" />
              <span v-else>Send Message</span>
              <span v-if="!loading">→</span>
            </button>
          </form>
        </div>
      </div>
    </section>

    <!-- FAQ Section -->
    <section class="border-t border-gray-200 bg-white">
      <div class="mx-auto max-w-3xl px-6 py-20 lg:px-12">
        <div class="text-center mb-10">
          <p class="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500 mb-4">
            FAQ
          </p>
          <h2 class="font-serif text-4xl font-bold tracking-tight text-gray-950">
            Frequently Asked Questions
          </h2>
        </div>

        <div class="space-y-4">
          <details
            v-for="(faq, index) in faqs"
            :key="index"
            class="border border-gray-200 rounded-2xl p-5 transition hover:border-gray-300"
          >
            <summary class="flex items-center justify-between font-semibold text-gray-900 cursor-pointer list-none">
              <span>{{ faq.question }}</span>
              <span class="text-xl text-gray-400 font-light">+</span>
            </summary>
            <p class="mt-3 text-sm text-gray-600 leading-6">
              {{ faq.answer }}
            </p>
          </details>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="mx-auto max-w-[1600px] px-6 py-20 lg:px-12 text-center bg-[#e9edf5]">
      <div class="max-w-xl mx-auto">
        <h2 class="font-serif text-4xl font-bold tracking-tight text-gray-950 mb-4">
          Looking for Your Next Book?
        </h2>
        <p class="text-base text-gray-600 mb-8">
          Explore our extensive collection and discover your next favorite read today.
        </p>
        <NuxtLink
          to="/books"
          class="inline-flex items-center gap-3 bg-black px-7 py-3 rounded-xl text-sm font-semibold text-white transition hover:bg-gray-800"
        >
          Browse Books
          <span>→</span>
        </NuxtLink>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const loading = ref(false)

const form = reactive({
  name: '',
  email: '',
  phone: '',
  subject: '',
  message: ''
})

const faqs = [
  {
    question: 'How can I order a book?',
    answer: 'Browse our books, select the title you want, add it to your shopping cart, and complete the secure checkout process.'
  },
  {
    question: 'How long does delivery take?',
    answer: 'Standard delivery usually takes between 1-3 business days depending on your specific delivery location.'
  },
  {
    question: 'Can I return a book?',
    answer: 'Yes. Please contact our support team immediately if you receive a damaged, defective, or incorrect book.'
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We support several convenient payment methods including secure online card payments and cash options.'
  }
]

const handleSubmit = async () => {
  loading.value = true
  try {
    // Simulated API call request delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    alert('Message sent successfully! We will get back to you soon.')
    form.name = ''
    form.email = ''
    form.phone = ''
    form.subject = ''
    form.message = ''
  } catch (error) {
    alert('Failed to send message. Please try again.')
  } finally {
    loading.value = false
  }
}
</script>