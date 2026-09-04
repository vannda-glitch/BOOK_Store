<template>
  <div class="space-y-6">
    <!-- Profile Settings -->
    <div class="card p-6">
      <h3 class="text-lg font-semibold text-gray-900 mb-4">Profile Information</h3>
      
      <form @submit.prevent="handleUpdateProfile" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">Full Name</label>
          <input v-model="form.full_name" type="text" class="input" />
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700">Phone Number</label>
          <input v-model="form.phone" type="tel" class="input" />
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700">Bio</label>
          <textarea v-model="form.bio" rows="3" class="input" placeholder="Tell us about yourself"></textarea>
        </div>
        
        <button type="submit" class="btn btn-primary" :disabled="loading">
          <LoadingSpinner v-if="loading" size="sm" />
          <span v-else>Update Profile</span>
        </button>
      </form>
    </div>
    
    <!-- Change Password -->
    <div class="card p-6">
      <h3 class="text-lg font-semibold text-gray-900 mb-4">Change Password</h3>
      
      <form @submit.prevent="handleChangePassword" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">Current Password</label>
          <input v-model="passwordForm.current_password" type="password" class="input" required />
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700">New Password</label>
          <input v-model="passwordForm.new_password" type="password" class="input" required />
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700">Confirm New Password</label>
          <input v-model="passwordForm.confirm_password" type="password" class="input" required />
        </div>
        
        <button type="submit" class="btn btn-primary" :disabled="passwordLoading">
          <LoadingSpinner v-if="passwordLoading" size="sm" />
          <span v-else>Change Password</span>
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuth } from '~/composables/useAuth'

const { user, updateProfile, changePassword, loading } = useAuth()
const toast = useToast()

const form = reactive({
  full_name: user.value?.full_name || '',
  phone: user.value?.phone || '',
  bio: user.value?.bio || ''
})

const passwordForm = reactive({
  current_password: '',
  new_password: '',
  confirm_password: ''
})

const passwordLoading = ref(false)

const handleUpdateProfile = async () => {
  try {
    await updateProfile(form)
    toast.success('Profile updated successfully!')
  } catch (error) {
    toast.error('Failed to update profile')
  }
}

const handleChangePassword = async () => {
  if (passwordForm.new_password !== passwordForm.confirm_password) {
    toast.error('Passwords do not match')
    return
  }
  
  if (passwordForm.new_password.length < 8) {
    toast.error('Password must be at least 8 characters')
    return
  }
  
  passwordLoading.value = true
  try {
    await changePassword({
      current_password: passwordForm.current_password,
      new_password: passwordForm.new_password
    })
    
    passwordForm.current_password = ''
    passwordForm.new_password = ''
    passwordForm.confirm_password = ''
    
    toast.success('Password changed successfully!')
  } catch (error) {
    toast.error('Failed to change password')
  } finally {
    passwordLoading.value = false
  }
}
</script>