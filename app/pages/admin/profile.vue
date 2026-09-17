<script setup lang="ts">
import { ref, reactive, computed, onMounted } from "vue";

definePageMeta({
  layout: "admin",
  middleware: "admin",
});

// --- Types ---
interface AdminUser {
  name?: string;
  email?: string;
  role?: string;
  phone?: string;
  profileImage?: string;
}

// --- State ---
const user = ref<AdminUser>({});
const fileInput = ref<HTMLInputElement | null>(null);
let messageTimeout: number | null = null;

const imageState = reactive({
  preview: "",
  error: "",
});

const feedback = reactive({
  message: "",
  type: "success" as "success" | "error",
});

const form = reactive({
  name: "",
  email: "",
  phone: "",
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
});

// --- Computed ---
const initials = computed(() => {
  return (form.name || "Administrator")
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
});

// --- Methods: User Data ---
const loadUser = () => {
  const savedUser = localStorage.getItem("user");

  if (savedUser) {
    try {
      user.value = JSON.parse(savedUser);
    } catch {
      user.value = {};
    }
  }

  form.name = user.value.name || "Administrator";
  form.email = user.value.email || "";
  form.phone = user.value.phone || "";
  imageState.preview = user.value.profileImage || "";
};

// --- Methods: Image Handling ---
const openFilePicker = () => {
  fileInput.value?.click();
};

const handleImageUpload = (event: Event) => {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];

  if (!file) return;

  imageState.error = "";

  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
  if (!allowedTypes.includes(file.type)) {
    imageState.error = "Please choose a JPG, PNG, or WebP file.";
    input.value = "";
    return;
  }

  const maxSizeInBytes = 2 * 1024 * 1024; // 2MB
  if (file.size > maxSizeInBytes) {
    imageState.error = "Image size must be less than 2MB.";
    input.value = "";
    return;
  }

  const reader = new FileReader();
  reader.onload = () => (imageState.preview = reader.result as string);
  reader.onerror = () => (imageState.error = "Unable to read this image.");
  reader.readAsDataURL(file);
};

const removePhoto = () => {
  imageState.preview = "";
  imageState.error = "";
  if (fileInput.value) fileInput.value.value = "";
};

// --- Methods: Form Submission ---
const showMessage = (text: string, type: "success" | "error" = "success") => {
  feedback.message = text;
  feedback.type = type;

  if (messageTimeout) window.clearTimeout(messageTimeout);
  
  messageTimeout = window.setTimeout(() => {
    feedback.message = "";
  }, 3500);
};

const validatePasswordChange = (): boolean => {
  if (!form.newPassword && !form.confirmPassword) return true;

  if (!form.currentPassword) {
    showMessage("Please enter your current password.", "error");
    return false;
  }
  if (form.newPassword.length < 6) {
    showMessage("New password must contain at least 6 characters.", "error");
    return false;
  }
  if (form.newPassword !== form.confirmPassword) {
    showMessage("New passwords do not match.", "error");
    return false;
  }
  return true;
};

const saveChanges = () => {
  if (!form.name.trim()) {
    return showMessage("Please enter your display name.", "error");
  }

  if (!form.email.trim()) {
    return showMessage("Please enter your email address.", "error");
  }

  if (!validatePasswordChange()) return;

  const updatedUser: AdminUser = {
    ...user.value,
    name: form.name.trim(),
    email: form.email.trim(),
    phone: form.phone.trim(),
    profileImage: imageState.preview || undefined,
  };

  user.value = updatedUser;
  localStorage.setItem("user", JSON.stringify(updatedUser));
  window.dispatchEvent(new CustomEvent("auth-changed"));

  // Reset password fields
  form.currentPassword = "";
  form.newPassword = "";
  form.confirmPassword = "";

  showMessage("Profile updated successfully.", "success");
};

const discardChanges = () => {
  loadUser();
  form.currentPassword = "";
  form.newPassword = "";
  form.confirmPassword = "";
  imageState.error = "";
  feedback.message = "";
};

// --- Lifecycle ---
onMounted(loadUser);
</script>

<template>
  <section class="mx-auto max-w-6xl p-4 sm:p-6 lg:p-8">
    <!-- Header -->
    <header class="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 class="text-2xl font-bold tracking-tight text-gray-900">Profile</h1>
        <p class="mt-1 text-sm text-gray-500">Manage your administrator account information.</p>
      </div>

      <div class="flex items-center gap-3">
        <button
          type="button"
          class="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/20"
          @click="discardChanges"
        >
          Cancel
        </button>
        <button
          type="button"
          class="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2"
          @click="saveChanges"
        >
          Save Changes
        </button>
      </div>
    </header>

    <!-- Feedback Message -->
    <transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="transform -translate-y-2 opacity-0"
      enter-to-class="transform translate-y-0 opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="transform translate-y-0 opacity-100"
      leave-to-class="transform -translate-y-2 opacity-0"
    >
      <div
        v-if="feedback.message"
        class="mb-6 flex items-center gap-3 rounded-lg border p-4 text-sm font-medium shadow-sm"
        :class="[
          feedback.type === 'success'
            ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
            : 'border-red-200 bg-red-50 text-red-800'
        ]"
        role="alert"
      >
        <span v-if="feedback.type === 'success'" class="text-xl">✓</span>
        <span v-else class="text-xl">⚠</span>
        {{ feedback.message }}
      </div>
    </transition>

    <div class="grid gap-6 lg:grid-cols-[300px_minmax(0,1fr)]">
      <!-- Left Column: Profile Card -->
      <aside class="flex flex-col gap-6">
        <div class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <!-- Avatar -->
          <div class="flex justify-center">
            <div class="relative group">
              <div class="flex h-32 w-32 items-center justify-center overflow-hidden rounded-full bg-primary/10 text-4xl font-bold text-primary ring-4 ring-gray-50">
                <img
                  v-if="imageState.preview"
                  :src="imageState.preview"
                  :alt="`${form.name}'s profile photo`"
                  class="h-full w-full object-cover transition duration-300 group-hover:brightness-90"
                />
                <span v-else>{{ initials }}</span>
              </div>

              <button
                type="button"
                class="absolute bottom-1 right-1 flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-white text-gray-700 shadow-sm transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/50"
                aria-label="Change profile photo"
                title="Change profile photo"
                @click="openFilePicker"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
              </button>
            </div>
          </div>

          <input
            ref="fileInput"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            class="hidden"
            aria-hidden="true"
            @change="handleImageUpload"
          />

          <!-- User Details -->
          <div class="mt-5 text-center">
            <h2 class="text-lg font-bold text-gray-900">{{ form.name || "Administrator" }}</h2>
            <p class="mt-1 break-all text-sm text-gray-500">{{ form.email || "No email provided" }}</p>
            <span class="mt-3 inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
              Administrator
            </span>
          </div>

          <!-- Photo Actions -->
          <div class="mt-6 flex flex-col gap-2">
            <button
              type="button"
              class="w-full rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/20"
              @click="openFilePicker"
            >
              Upload New Photo
            </button>
            <button
              v-if="imageState.preview"
              type="button"
              class="w-full rounded-lg border border-transparent px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500/20"
              @click="removePhoto"
            >
              Remove Photo
            </button>
          </div>

          <p v-if="imageState.error" class="mt-3 text-center text-sm text-red-600" role="alert">
            {{ imageState.error }}
          </p>
          <p class="mt-3 text-center text-xs text-gray-500">
            JPG, PNG or WebP · Max 2MB
          </p>
        </div>

        <div class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h3 class="text-xs font-bold uppercase tracking-wider text-gray-500">Account Status</h3>
          <div class="mt-4 space-y-4">
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-600">Role</span>
              <span class="text-sm font-semibold capitalize text-gray-900">{{ user.role || "Admin" }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-600">Status</span>
              <span class="flex items-center gap-1.5 text-sm font-semibold text-emerald-600">
                <span class="h-2 w-2 rounded-full bg-emerald-500"></span> Active
              </span>
            </div>
          </div>
        </div>
      </aside>

      <!-- Right Column: Forms -->
      <div class="space-y-6">
        <!-- Personal Information -->
        <section class="rounded-xl border border-gray-200 bg-white shadow-sm">
          <div class="border-b border-gray-200 px-6 py-5">
            <h2 class="text-lg font-semibold text-gray-900">Personal Information</h2>
            <p class="mt-1 text-sm text-gray-500">Update your basic account information and contact details.</p>
          </div>

          <div class="p-6">
            <div class="grid gap-6 sm:grid-cols-2">
              <div class="space-y-2">
                <label for="displayName" class="block text-sm font-medium text-gray-700">Display Name</label>
                <input
                  id="displayName"
                  v-model="form.name"
                  type="text"
                  placeholder="Jane Doe"
                  class="block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 sm:text-sm"
                />
              </div>

              <div class="space-y-2">
                <label for="emailAddress" class="block text-sm font-medium text-gray-700">Email Address</label>
                <input
                  id="emailAddress"
                  v-model="form.email"
                  type="email"
                  placeholder="admin@example.com"
                  class="block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 sm:text-sm"
                />
              </div>

              <div class="space-y-2 sm:col-span-2">
                <label for="phoneNumber" class="block text-sm font-medium text-gray-700">Phone Number</label>
                <input
                  id="phoneNumber"
                  v-model="form.phone"
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  class="block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 sm:text-sm"
                />
              </div>
            </div>
          </div>
        </section>

        <!-- Security / Password -->
        <section class="rounded-xl border border-gray-200 bg-white shadow-sm">
          <div class="border-b border-gray-200 px-6 py-5">
            <h2 class="text-lg font-semibold text-gray-900">Change Password</h2>
            <p class="mt-1 text-sm text-gray-500">Ensure your account is using a long, random password to stay secure.</p>
          </div>

          <div class="p-6">
            <div class="grid gap-6 sm:grid-cols-3">
              <div class="space-y-2">
                <label for="currentPassword" class="block text-sm font-medium text-gray-700">Current Password</label>
                <input
                  id="currentPassword"
                  v-model="form.currentPassword"
                  type="password"
                  autocomplete="current-password"
                  class="block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 sm:text-sm"
                />
              </div>

              <div class="space-y-2">
                <label for="newPassword" class="block text-sm font-medium text-gray-700">New Password</label>
                <input
                  id="newPassword"
                  v-model="form.newPassword"
                  type="password"
                  autocomplete="new-password"
                  class="block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 sm:text-sm"
                />
              </div>

              <div class="space-y-2">
                <label for="confirmPassword" class="block text-sm font-medium text-gray-700">Confirm Password</label>
                <input
                  id="confirmPassword"
                  v-model="form.confirmPassword"
                  type="password"
                  autocomplete="new-password"
                  class="block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 sm:text-sm"
                />
              </div>
            </div>
            <p class="mt-4 text-sm text-gray-500">
              Leave these fields empty if you don't want to change your password.
            </p>
          </div>
        </section>

        <!-- Permissions -->
        <section class="rounded-xl border border-gray-200 bg-white shadow-sm">
          <div class="border-b border-gray-200 px-6 py-5">
            <h2 class="text-lg font-semibold text-gray-900">Administrator Access</h2>
            <p class="mt-1 text-sm text-gray-500">Your current permissions and roles within the system.</p>
          </div>

          <div class="p-6">
            <div class="grid gap-4 sm:grid-cols-2">
              <div class="flex gap-4 rounded-lg border border-gray-200 bg-gray-50/50 p-4">
                <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white shadow-sm ring-1 ring-gray-200">
                  📚
                </div>
                <div>
                  <h3 class="text-sm font-semibold text-gray-900">Catalog Management</h3>
                  <p class="mt-1 text-xs text-gray-500">Manage books, authors, publishers, and categories.</p>
                </div>
              </div>

              <div class="flex gap-4 rounded-lg border border-gray-200 bg-gray-50/50 p-4">
                <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white shadow-sm ring-1 ring-gray-200">
                  📦
                </div>
                <div>
                  <h3 class="text-sm font-semibold text-gray-900">Order Management</h3>
                  <p class="mt-1 text-xs text-gray-500">View and manage customer orders and fulfillment.</p>
                </div>
              </div>

              <div class="flex gap-4 rounded-lg border border-gray-200 bg-gray-50/50 p-4">
                <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white shadow-sm ring-1 ring-gray-200">
                  👥
                </div>
                <div>
                  <h3 class="text-sm font-semibold text-gray-900">User Management</h3>
                  <p class="mt-1 text-xs text-gray-500">View and manage system users and roles.</p>
                </div>
              </div>

              <div class="flex gap-4 rounded-lg border border-gray-200 bg-gray-50/50 p-4">
                <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white shadow-sm ring-1 ring-gray-200">
                  📊
                </div>
                <div>
                  <h3 class="text-sm font-semibold text-gray-900">Analytics Dashboard</h3>
                  <p class="mt-1 text-xs text-gray-500">Access comprehensive statistics and system reports.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  </section>
</template>