<script setup lang="ts">
const categories = [
  { name: 'Fiction', icon: '📖' },
  { name: 'Technology', icon: '💻' },
  { name: 'Business', icon: '💼' },
  { name: 'Science', icon: '🔬' },
  { name: 'History', icon: '🏛️' },
  { name: 'Self Development', icon: '🌱' }
]

const books = [
  {
    id: 1,
    title: 'The Psychology of Money',
    author: 'Morgan Housel',
    price: 18.99,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 2,
    title: 'Atomic Habits',
    author: 'James Clear',
    price: 21.50,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 3,
    title: 'Clean Code',
    author: 'Robert C. Martin',
    price: 25.99,
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 4,
    title: 'The Alchemist',
    author: 'Paulo Coelho',
    price: 16.99,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=500&q=80'
  }
]

const search = ref('')
const cartCount = ref(0)

const addToCart = () => {
  cartCount.value++
}
</script>
    <template>
  <div class="min-h-screen bg-gray-50 text-gray-900">

    <!-- ================= NAVBAR ================= -->
    

    <!-- ================= HERO ================= -->
    <section
      class="bg-blue-700 from-indigo-600 via-indigo-700 to-purple-700 text-white"
    >
      <div
        class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8
               py-16 lg:py-24 grid lg:grid-cols-2 gap-12 items-center"
      >

        <!-- Hero Text -->
        <div>

          <span
            class="inline-block bg-white/10 border border-white/20
                   px-4 py-2 rounded-full text-sm mb-6"
          >
            📚 Discover your next favorite book
          </span>

          <h2
            class="text-4xl sm:text-5xl lg:text-6xl
                   font-bold leading-tight"
          >
            Stories that
            <span class="text-yellow-300">
              inspire
            </span>
            you.
          </h2>

          <p class="mt-6 text-indigo-100 text-lg max-w-xl">
            Explore thousands of books from your favorite authors.
            Find knowledge, inspiration, and stories waiting for you.
          </p>

          <div class="mt-8 flex flex-wrap gap-4">

            <a
              href="#books"
              class="bg-white text-indigo-700 px-6 py-3
                     rounded-xl font-semibold
                     hover:bg-gray-100 transition"
            >
              Explore Books →
            </a>

            <a
              href="#categories"
              class="border border-white/40 px-6 py-3
                     rounded-xl font-semibold
                     hover:bg-white/10 transition"
            >
              Browse Categories
            </a>

          </div>

          <!-- Statistics -->
          <div class="mt-10 flex gap-8">

            <div>
              <p class="text-2xl font-bold">10K+</p>
              <p class="text-indigo-200 text-sm">Books</p>
            </div>

            <div>
              <p class="text-2xl font-bold">5K+</p>
              <p class="text-indigo-200 text-sm">Authors</p>
            </div>

            <div>
              <p class="text-2xl font-bold">20K+</p>
              <p class="text-indigo-200 text-sm">Readers</p>
            </div>

          </div>

        </div>


        <!-- Hero Books -->
        <div class=" hidden lg:flex justify-center relative">

          <div
            class="absolute w-72 h-72 bg-purple-400/30
                   rounded-full blur-3xl"
          ></div>

          <div
            class="relative bg-white p-3 rounded-2xl shadow-2xl
                   rotate-[-8deg] w-52"
          >
            <img
              src="https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=500&q=80"
              class="rounded-xl h-72 w-full object-cover"
            />
          </div>

          <div
            class="relative bg-white p-3 rounded-2xl shadow-2xl
                   rotate-[8deg] w-52 -ml-10 mt-16"
          >
            <img
              src="https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=500&q=80"
              class="rounded-xl h-72 w-full object-cover"
            />
          </div>

        </div>

      </div>
    </section>


    <!-- ================= CATEGORIES ================= -->
    <section id="categories" class="py-16">

      <div class=" max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div class="flex justify-between items-end mb-8">

          <div>
            <p class="text-indigo-600 font-semibold text-sm">
              EXPLORE
            </p>

            <h2 class="text-3xl font-bold mt-2">
              Browse Categories
            </h2>
          </div>

          <a
            href="#"
            class="text-indigo-600 font-medium hover:underline"
          >
            View all →
          </a>

        </div>


        <div
          class="grid grid-cols-2 sm:grid-cols-3
                 lg:grid-cols-6 gap-4"
        >

          <div
            v-for="category in categories"
            :key="category.name"
            class="bg-white border rounded-2xl p-6
                   text-center hover:-translate-y-1
                   hover:shadow-lg hover:border-indigo-200
                   transition cursor-pointer"
          >

            <div class="text-4xl">
              {{ category.icon }}
            </div>

            <h3 class="font-semibold mt-4 text-sm">
              {{ category.name }}
            </h3>

          </div>

        </div>

      </div>

    </section>


    <!-- ================= BOOKS ================= -->
    <section id="books" class="py-16 bg-white">

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <!-- Section Header -->
        <div class="flex justify-between items-end mb-8">

          <div>
            <p class="text-indigo-600 font-semibold text-sm">
              OUR COLLECTION
            </p>

            <h2 class="text-3xl font-bold mt-2">
              Featured Books
            </h2>
          </div>

          <a
            href="#"
            class="text-indigo-600 font-medium hover:underline"
          >
            View all →
          </a>

        </div>


        <!-- Book Grid -->
        <div
          class="grid grid-cols-1 sm:grid-cols-2
                 lg:grid-cols-4 gap-6"
        >

          <div
            v-for="book in books"
            :key="book.id"
            class="group bg-gray-50 rounded-2xl
                   overflow-hidden border
                   hover:shadow-xl transition"
          >

            <!-- Book Image -->
            <div class="relative overflow-hidden">

              <img
                :src="book.image"
                :alt="book.title"
                class="w-full h-72 object-cover
                       group-hover:scale-105 transition duration-500"
              />

              <!-- Wishlist -->
              <button
                class="absolute top-4 right-4
                       bg-white/90 w-10 h-10
                       rounded-full shadow
                       hover:text-red-500"
              >
                ♡
              </button>

            </div>


            <!-- Book Info -->
            <div class="p-5">

              <p class="text-xs text-gray-500">
                {{ book.author }}
              </p>

              <h3
                class="font-bold text-lg mt-1
                       line-clamp-1"
              >
                {{ book.title }}
              </h3>


              <!-- Rating -->
              <div class="flex items-center gap-2 mt-3">

                <div class="text-yellow-400">
                  ★★★★★
                </div>

                <span class="text-sm text-gray-500">
                  {{ book.rating }}
                </span>

              </div>


              <!-- Price -->
              <div
                class="flex items-center justify-between
                       mt-5"
              >

                <span class="text-xl font-bold text-indigo-600">
                  ${{ book.price }}
                </span>

                <button
                  @click="addToCart"
                  class="bg-indigo-600 text-white
                         px-4 py-2 rounded-lg
                         text-sm font-medium
                         hover:bg-indigo-700 transition"
                >
                  + Cart
                </button>

              </div>

            </div>

          </div>

        </div>

      </div>

    </section>


    <!-- ================= BENEFITS ================= -->
    <section class="py-16">

      <div
        class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8
               grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
      >

        <div class="bg-white p-6 rounded-2xl border">
          <div class="text-3xl">🚚</div>
          <h3 class="font-bold mt-4">Fast Delivery</h3>
          <p class="text-gray-500 text-sm mt-2">
            Get your books delivered quickly to your door.
          </p>
        </div>

        <div class="bg-white p-6 rounded-2xl border">
          <div class="text-3xl">🔒</div>
          <h3 class="font-bold mt-4">Secure Payment</h3>
          <p class="text-gray-500 text-sm mt-2">
            Your payments are safe and protected.
          </p>
        </div>

        <div class="bg-white p-6 rounded-2xl border">
          <div class="text-3xl">↩️</div>
          <h3 class="font-bold mt-4">Easy Returns</h3>
          <p class="text-gray-500 text-sm mt-2">
            Simple and flexible return policy.
          </p>
        </div>

        <div class="bg-white p-6 rounded-2xl border">
          <div class="text-3xl">💬</div>
          <h3 class="font-bold mt-4">24/7 Support</h3>
          <p class="text-gray-500 text-sm mt-2">
            Our support team is always ready to help.
          </p>
        </div>

      </div>

    </section>


    <!-- ================= NEWSLETTER ================= -->
    <section class="py-16">

      <div
        class="mx-60 max-w-5xl  bg-indigo-600
               rounded-3xl px-6 py-12
               text-center text-white"
      >

        <p class="text-indigo-200 font-medium">
          STAY UPDATED
        </p>

        <h2 class="text-3xl font-bold mt-2">
          Get book recommendations
        </h2>

        <p class="text-indigo-100 mt-3">
          Subscribe and discover new books every week.
        </p>

        <div
          class="max-w-md mx-auto mt-6 flex
                 bg-white rounded-xl p-1"
        >

          <input
            type="email"
            placeholder="Enter your email"
            class="flex-1 px-4 py-3 text-gray-900
                   outline-none rounded-lg"
          />

          <button
            class="bg-indigo-600 text-white
                   px-5 py-3 rounded-lg
                   font-semibold"
          >
            Subscribe
          </button>

        </div>

      </div>

    </section>


    <!-- ================= FOOTER ================= -->
    <footer class="bg-gray-950 text-gray-400">

      <div
        class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8
               py-12 grid sm:grid-cols-2
               lg:grid-cols-4 gap-10"
      >

        <div>

          <h2 class="text-white text-xl font-bold">
            Book<span class="text-indigo-500">Nest</span>
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
            <a href="#" class="block hover:text-white">All Books</a>
            <a href="#" class="block hover:text-white">Best Sellers</a>
            <a href="#" class="block hover:text-white">New Releases</a>
            <a href="#" class="block hover:text-white">Discounts</a>
          </div>

        </div>


        <div>

          <h3 class="text-white font-semibold">
            Support
          </h3>

          <div class="mt-4 space-y-3 text-sm">
            <a href="#" class="block hover:text-white">Contact Us</a>
            <a href="#" class="block hover:text-white">FAQ</a>
            <a href="#" class="block hover:text-white">Shipping</a>
            <a href="#" class="block hover:text-white">Returns</a>
          </div>

        </div>


        <div>

          <h3 class="text-white font-semibold">
            Follow Us
          </h3>

          <div class="flex gap-3 mt-4">

            <button
              class="w-10 h-10 bg-gray-800
                     rounded-lg hover:bg-indigo-600"
            >
              f
            </button>

            <button
              class="w-10 h-10 bg-gray-800
                     rounded-lg hover:bg-indigo-600"
            >
              ◎
            </button>

            <button
              class="w-10 h-10 bg-gray-800
                     rounded-lg hover:bg-indigo-600"
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
          © 2026 BookNest. All rights reserved.
        </div>

      </div>

    </footer>

  </div>
>>>>>>> origin/dev
</template>
>>>>>>> fa2143573278a782bc38cb18585cb1463f0555b2
