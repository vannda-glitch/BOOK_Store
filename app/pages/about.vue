<template>
  <div class="min-h-screen bg-white text-black">
    <section class="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
      <div class="overflow-hidden border border-black bg-black text-white shadow-[0_20px_60px_rgba(0,0,0,0.15)]">
        <div class="grid items-center gap-8 px-6 py-8 md:px-10 md:py-12 lg:grid-cols-2 lg:px-14">
          <div>
            <p class="mb-4 text-xs font-semibold uppercase tracking-[0.32em] text-gray-300">
              About Book
            </p>
            <h1 class="text-4xl font-black leading-none md:text-5xl lg:text-6xl">
              Book lovers deserve more than a shelf.
            </h1>
            <p class="mt-5 max-w-xl text-base leading-7 text-gray-300 md:text-lg">
              We created Book to make reading feel personal, simple, and inspiring — a place where every story is easy to discover and every order feels thoughtful.
            </p>

            <div class="mt-8 flex flex-wrap gap-4">
              <NuxtLink
                to="/browse"
                class="inline-flex items-center justify-center border border-white bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-gray-200"
              >
                Explore Books
              </NuxtLink>
              <NuxtLink
                to="/contact"
                class="inline-flex items-center justify-center border border-white/30 bg-transparent px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/5"
              >
                Contact Us
              </NuxtLink>
            </div>
          </div>

          <div class="relative">
            <img
              src="https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=1200&q=80"
              alt="Books on a table"
              class="h-[420px] w-full object-cover "
            />
            <div class="absolute -bottom-5 left-4 border border-black bg-white px-4 py-3 shadow-lg md:left-8">
              <p class="text-[10px] font-bold uppercase tracking-[0.25em] text-gray-500">Since 2023</p>
              <p class="mt-2 text-2xl font-black text-black">20+ Genres</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div class="grid items-center gap-10 lg:grid-cols-2">
        <div class="overflow-hidden border border-black bg-gray-100">
          <img
            src="https://i.pinimg.com/736x/5f/71/99/5f7199de1783ba8ed92d69b36cf354c3.jpg"
            alt="BookNest story"
            class="h-[500px] w-full object-cover"
          />
        </div>

        <div>
          <p class="text-xs font-bold uppercase tracking-[0.3em] text-gray-600">Our Story</p>
          <h2 class="mt-3 text-3xl font-black leading-tight md:text-4xl">
            A bookstore built around curiosity, trust, and reading joy.
          </h2>

          <div class="mt-6 space-y-5 text-base leading-7 text-gray-700">
            <p>
              BookNest began with a simple idea: readers should feel connected to what they buy.
              We wanted to create a bookstore that feels more personal, thoughtful, and easy to enjoy every day.
            </p>
            <p>
              Whether it is fiction, education, personal growth, or children’s books, we carefully curate a collection that supports every interest and every stage of life.
            </p>
          </div>

          <ul class="mt-8 space-y-4">
            <li v-for="feature in storyFeatures" :key="feature.title" class="flex items-start gap-3">
              <span class="mt-1 flex h-7 w-7 items-center justify-center rounded-full bg-black text-sm font-bold text-white">✓</span>
              <div>
                <p class="font-bold text-black">{{ feature.title }}</p>
                <p class="text-sm text-gray-600">{{ feature.text }}</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </section>
    <section class="bg-black py-16 text-white">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="mb-10 text-center">
          <p class="text-xs font-bold uppercase tracking-[0.3em] text-gray-300">What We Believe</p>
          <h2 class="mt-3 text-3xl font-black md:text-4xl">Our mission, vision, and promise</h2>
        </div>

        <div class="grid gap-6 md:grid-cols-3">
          <div v-for="item in missionValues" :key="item.number" class="border border-white/20 bg-white/5 p-7">
            <p class="text-xs font-bold uppercase tracking-[0.25em] text-gray-400">{{ item.number }}</p>
            <h3 class="mt-5 text-2xl font-black">{{ item.title }}</h3>
            <p class="mt-4 text-base leading-7 text-gray-300">{{ item.text }}</p>
          </div>
        </div>
      </div>
    </section>

    <section class="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div class="mb-10 text-center">
        <p class="text-xs font-bold uppercase tracking-[0.3em] text-gray-600">Why BookNest</p>
        <h2 class="mt-3 text-3xl font-black md:text-4xl">Why readers choose us</h2>
      </div>

      <div class="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        <div v-for="value in values" :key="value.title" class="border border-black bg-white p-6 transition hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(0,0,0,0.08)]">
          <div class="mb-5 flex h-12 w-12 items-center justify-center border border-black text-2xl">
            {{ value.icon }}
          </div>
          <p class="text-[10px] font-bold uppercase tracking-[0.25em] text-gray-500">{{ value.number }}</p>
          <h3 class="mt-4 text-xl font-black text-black">{{ value.title }}</h3>
          <p class="mt-3 text-sm leading-6 text-gray-600">{{ value.text }}</p>
        </div>
      </div>
    </section>

    <section class="bg-gray-100 py-16">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="grid gap-8 text-center md:grid-cols-4">
          <div v-for="stat in stats" :key="stat.label">
            <h3 class="text-4xl font-black md:text-5xl">{{ stat.value }}</h3>
            <p class="mt-3 text-[10px] font-bold uppercase tracking-[0.25em] text-gray-600">{{ stat.label }}</p>
          </div>
        </div>
      </div>
    </section>

    <section class="mx-auto max-w-5xl px-4 py-16 text-center sm:px-6 lg:px-8">
      <div class="border border-black bg-[#f5f5f5] p-10">
        <p class="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-600">Ready to start reading?</p>
        <h2 class="mt-4 text-3xl font-black text-black md:text-4xl">Discover books that fit your next chapter.</h2>
        <NuxtLink
          to="/collection"
          class="mt-7 inline-flex items-center justify-center border border-black bg-black px-7 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
        >
          Browse Collection
        </NuxtLink>
      </div>
    </section>
  </div>
</template>

<script setup>
// definePageMeta({
//     middleware: 'auth'
// })

const storyFeatures = [
  {
    title: 'Curated selection',
    text: 'We handpick books that inspire, inform, and entertain readers at every stage of life.'
  },
  {
    title: 'Easy shopping',
    text: 'A clean and simple experience helps readers discover titles without stress.'
  },
  {
    title: 'Reader-focused service',
    text: 'Great service, honest value, and thoughtful support are always part of the experience.'
  }
]

const missionValues = [
  {
    number: '01',
    title: 'Our Mission',
    text: 'To make quality books affordable and accessible while creating a welcoming bookstore for curious readers.'
  },
  {
    number: '02',
    title: 'Our Vision',
    text: 'To become a trusted digital bookstore where every person can discover stories, ideas, and knowledge that matter.'
  },
  {
    number: '03',
    title: 'Our Promise',
    text: 'To deliver a thoughtful, reliable, and enjoyable shopping experience built around reader satisfaction.'
  }
]
const values = [
  { number: '01', title: 'Large Collection', icon: '📚', text: 'Discover books across fiction, education, lifestyle, and more.' },
  { number: '02', title: 'Affordable Prices', icon: '💵', text: 'Enjoy meaningful reading without spending more than necessary.' },
  { number: '03', title: 'Fast Delivery', icon: '🚚', text: 'Get your books quickly and without unnecessary hassle.' },
  { number: '04', title: 'Secure Shopping', icon: '🔒', text: 'Shop with confidence through a smooth and trustworthy experience.' }
]

const stats = [
  { value: '10K+', label: 'Happy Readers' },
  { value: '5K+', label: 'Books Listed' },
  { value: '20+', label: 'Categories' },
  { value: '4.8/5', label: 'Customer Rating' }
]
</script>