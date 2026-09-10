<script setup lang="ts">
        
</script>
<template>
    <!-- ================= FOOTER ================= -->
    <footer class="border-t border-[#dce9e4] bg-[#17201f] text-gray-400">

      <div
        class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8
               py-14 grid sm:grid-cols-2
               lg:grid-cols-4 gap-10"
      >

        <div>

          <h2 class="font-serif text-2xl font-bold tracking-tight text-white">
            Read<span class="text-[#67c5bb]">Plus</span>
          </h2>

          <p class="mt-4 text-sm leading-6">
            Your online destination for discovering
            amazing books and stories.
          </p>

        </div>


        <div>

          <h3 class="text-white font-semibold">
            Shop
          </h3>

          <div class="mt-4 space-y-3 text-sm">
            <NuxtLink to="/browse" class="block hover:text-white">All Books</NuxtLink>
            <NuxtLink to="/browse" class="block hover:text-white">Best Sellers</NuxtLink>
            <NuxtLink to="/browse" class="block hover:text-white">New Releases</NuxtLink>
            <NuxtLink to="/browse" class="block hover:text-white">Discounts</NuxtLink>
          </div>

        </div>


        <div>

          <h3 class="text-white font-semibold">
            Support
          </h3>

          <div class="mt-4 space-y-3 text-sm">
            <NuxtLink to="/contact" class="block hover:text-white">Contact Us</NuxtLink>
            <NuxtLink to="/about" class="block hover:text-white">About ReadPlus</NuxtLink>
            <NuxtLink to="/contact" class="block hover:text-white">Shipping Support</NuxtLink>
            <NuxtLink to="/contact" class="block hover:text-white">Returns Support</NuxtLink>
          </div>

        </div>


        <div>

          <h3 class="text-white font-semibold">
            Follow Us
          </h3>

          <div class="flex gap-3 mt-4">
            <button aria-label="ReadPlus on Facebook" type="button"
              class="h-10 w-10 rounded-xl border border-white/10 bg-white/10 font-semibold text-white transition hover:border-[#67c5bb] hover:bg-[#0f766e]"
            >
              f
            </button>
            <button aria-label="ReadPlus on Instagram" type="button"
              class="h-10 w-10 rounded-xl border border-white/10 bg-white/10 font-semibold text-white transition hover:border-[#67c5bb] hover:bg-[#0f766e]"
            >
              ◎
            </button>
            <button aria-label="ReadPlus on X" type="button"
              class="h-10 w-10 rounded-xl border border-white/10 bg-white/10 font-semibold text-white transition hover:border-[#67c5bb] hover:bg-[#0f766e]"
            >
              X
            </button>
          </div>

        </div>

      </div>


      <div class="border-t border-gray-800">
        <div
          class="max-w-7xl mx-auto px-4
                 py-6 text-sm text-center"
        >
          © 2026 ReadPlus. All rights reserved.
        </div>
      </div>

    </footer>
</template>