<template>
  <div>
    <h3 class="text-xl font-semibold text-gray-900 mb-4">Reviews</h3>
    
    <!-- Write Review -->
    <div v-if="isAuthenticated" class="card p-6 mb-6">
      <h4 class="font-medium text-gray-900 mb-3">Write a Review</h4>
      
      <form @submit.prevent="handleSubmitReview" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Rating</label>
          <div class="flex gap-2">
            <button
              v-for="i in 5"
              :key="i"
              type="button"
              @click="reviewForm.rating = i"
              class="text-2xl transition-colors"
              :class="i <= reviewForm.rating ? 'text-yellow-400' : 'text-gray-300 hover:text-yellow-200'"
            >
              <Icon name="mdi:star" />
            </button>
          </div>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Comment</label>
          <textarea
            v-model="reviewForm.comment"
            rows="3"
            class="input"
            placeholder="Share your thoughts about this book..."
          ></textarea>
        </div>
        
        <button type="submit" class="btn btn-primary" :disabled="reviewLoading">
          <LoadingSpinner v-if="reviewLoading" size="sm" />
          <span v-else>Submit Review</span>
        </button>
      </form>
    </div>
    
    <!-- Reviews List -->
    <div v-if="reviews.length > 0" class="space-y-4">
      <div v-for="review in reviews" :key="review.id" class="card p-4">
        <div class="flex items-start justify-between">
          <div>
            <div class="flex items-center gap-2">
              <span class="font-semibold text-gray-900">
                {{ review.user?.full_name || review.user?.username || 'Anonymous' }}
              </span>
              <span class="text-sm text-gray-500">· {{ formatDate(review.created_at) }}</span>
            </div>
            <div class="flex text-yellow-400 mt-1">
              <Icon v-for="i in 5" :key="i" :name="i <= review.rating ? 'mdi:star' : 'mdi:star-outline'" size="16" />
            </div>
          </div>
        </div>
        <p class="text-gray-700 mt-2">{{ review.comment }}</p>
      </div>
    </div>
    
    <p v-else class="text-gray-500 text-center py-8">No reviews yet. Be the first to review!</p>
  </div>
</template>

<script setup lang="ts">
import { useAuth } from '~/composables/useAuth'
import { formatters } from '~/utils/formatters'

const props = defineProps<{
  bookId?: number
  reviews: any[]
}>()

const { isAuthenticated } = useAuth()
const toast = useToast()

const reviewForm = reactive({
  rating: 0,
  comment: ''
})

const reviewLoading = ref(false)
const formatDate = formatters.date

const handleSubmitReview = async () => {
  if (!props.bookId) return
  
  if (reviewForm.rating === 0) {
    toast.error('Please select a rating')
    return
  }
  
  reviewLoading.value = true
  try {
    await $fetch('/reviews', {
      method: 'POST',
      body: {
        book_id: props.bookId,
        rating: reviewForm.rating,
        comment: reviewForm.comment
      },
      baseURL: useRuntimeConfig().public.apiBase,
      headers: {
        Authorization: `Bearer ${useAuthStore().token}`
      }
    })
    
    toast.success('Review submitted successfully!')
    reviewForm.rating = 0
    reviewForm.comment = ''
    
    // Refresh reviews
    await useBooks().fetchBook(useRoute().params.slug as string)
  } catch (error: any) {
    toast.error(error.response?.data?.detail || 'Failed to submit review')
  } finally {
    reviewLoading.value = false
  }
}
</script>