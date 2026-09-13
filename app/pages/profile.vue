<script setup lang="ts">
definePageMeta({ middleware: "auth" });

const API_URL = "http://localhost:8000";
const user = ref<any | null>(null);
const loading = ref(true);
const saving = ref(false);
const editing = ref(false);
const error = ref("");
const success = ref("");
const form = reactive({
  name: "",
  email: "",
  phone: "",
  address: "",
  profileImage: "",
});

const getLoggedInUser = () => {
  if (!import.meta.client) return null;
  const savedUser = localStorage.getItem("user");
  if (!savedUser) return null;
  try {
    return JSON.parse(savedUser);
  } catch {
    return null;
  }
};

const resetForm = () => {
  if (!user.value) return;
  Object.assign(form, {
    name: user.value.name || "",
    email: user.value.email || "",
    phone: user.value.phone || "",
    address: user.value.address || "",
    profileImage: user.value.profileImage || "",
  });
};

const loadProfile = async () => {
  const loggedUser = getLoggedInUser();
  if (!loggedUser?.id) {
    error.value = "Please log in to view your profile.";
    loading.value = false;
    return;
  }
  try {
    user.value = await $fetch(
      `${API_URL}/users/${encodeURIComponent(String(loggedUser.id))}`,
    );
    resetForm();
  } catch (loadError) {
    console.error("Failed to load profile:", loadError);
    error.value = "Unable to load your profile. Please try again.";
  } finally {
    loading.value = false;
  }
};

const startEditing = () => {
  error.value = "";
  success.value = "";
  resetForm();
  editing.value = true;
};
const cancelEditing = () => {
  resetForm();
  editing.value = false;
  error.value = "";
};

const handleImageChange = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (!file) return;
  if (!file.type.startsWith("image/")) {
    error.value = "Please select an image file.";
    return;
  }
  if (file.size > 2 * 1024 * 1024) {
    error.value = "Please choose an image smaller than 2 MB.";
    return;
  }
  const reader = new FileReader();
  reader.onload = () => {
    form.profileImage = String(reader.result || "");
  };
  reader.readAsDataURL(file);
};

const saveProfile = async () => {
  error.value = "";
  success.value = "";
  if (!form.name.trim() || !form.email.trim()) {
    error.value = "Name and email are required.";
    return;
  }
  const loggedUser = getLoggedInUser();
  if (!loggedUser?.id || !user.value) {
    error.value = "Your session has expired. Please log in again.";
    return;
  }
  saving.value = true;
  try {
    const updated = await $fetch<any>(
      `${API_URL}/users/${encodeURIComponent(String(loggedUser.id))}`,
      {
        method: "PATCH",
        body: {
          name: form.name.trim(),
          email: form.email.trim().toLowerCase(),
          phone: form.phone.trim(),
          address: form.address.trim(),
          profileImage: form.profileImage,
        },
      },
    );
    user.value = updated;
    localStorage.setItem(
      "user",
      JSON.stringify({
        ...loggedUser,
        id: updated.id,
        name: updated.name,
        email: updated.email,
        role: updated.role,
        profileImage: updated.profileImage || "",
      }),
    );
    window.dispatchEvent(new CustomEvent("auth-changed"));
    editing.value = false;
    success.value = "Profile updated successfully.";
  } catch (saveError) {
    console.error("Failed to save profile:", saveError);
    error.value = "Unable to save your profile. Please try again.";
  } finally {
    saving.value = false;
  }
};

const formatMemberSince = (value: unknown) => {
  if (!value) return "Not available";
  const date = new Date(String(value));
  return Number.isNaN(date.getTime())
    ? String(value)
    : date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
};

const avatarText = computed(
  () => user.value?.name?.charAt(0)?.toUpperCase() || "U",
);
const avatarSource = computed(() =>
  editing.value ? form.profileImage : user.value?.profileImage,
);

onMounted(loadProfile);
</script>

<template>
  <main
    class="min-h-screen bg-[#fafafa] px-5 py-10 text-gray-900 md:px-8 lg:px-10 lg:py-16"
  >
    <div class="mx-auto max-w-4xl">
      <div
        class="flex flex-col justify-between gap-4 border-b border-gray-200 pb-8 sm:flex-row sm:items-end"
      >
        <div>
          <p
            class="text-[10px] font-semibold uppercase tracking-[0.2em] text-primary"
          >
            Account
          </p>
          <h1 class="mt-2 font-serif text-4xl font-bold text-gray-950">
            My Profile
          </h1>
        </div>
        <button
          v-if="user && !editing"
          type="button"
          class="rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#0b5f59]"
          @click="startEditing"
        >
          Edit Profile
        </button>
      </div>
      <div v-if="loading" class="py-24 text-center text-sm text-gray-500">
        Loading your profile...
      </div>
      <div
        v-else-if="error && !editing"
        class="py-24 text-center text-sm text-red-600"
      >
        {{ error }}
      </div>
      <section
        v-else-if="user"
        class="mt-10 rounded-2xl border border-[#dce9e4] bg-white p-6 shadow-sm sm:p-10"
      >
        <div
          class="flex flex-col items-start gap-5 border-b border-gray-100 pb-8 sm:flex-row sm:items-center"
        >
          <div
            class="relative flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary text-3xl font-bold text-white ring-4 ring-[#eaf6f3]"
          >
            <img
              v-if="avatarSource"
              :src="avatarSource"
              :alt="user.name"
              class="h-full w-full object-cover"
            /><span v-else>{{ avatarText }}</span>
          </div>
          <div>
            <h2 class="font-serif text-3xl font-bold text-gray-950">
              {{ user.name }}
            </h2>
            <p class="mt-1 text-sm text-gray-500">{{ user.email }}</p>
            <span
              class="mt-3 inline-flex rounded-full bg-[#eaf6f3] px-3 py-1 text-xs font-semibold capitalize text-primary"
              >{{ user.role }}</span
            >
          </div>
        </div>
        <p
          v-if="success"
          class="mt-6 rounded-xl bg-emerald-50 p-4 text-sm text-emerald-700"
        >
          {{ success }}
        </p>
        <p
          v-if="error"
          class="mt-6 rounded-xl bg-red-50 p-4 text-sm text-red-700"
        >
          {{ error }}
        </p>
        <form
          v-if="editing"
          class="mt-8 space-y-5"
          @submit.prevent="saveProfile"
        >
          <div
            class="rounded-xl border border-dashed border-primary/40 bg-[#f7fbfa] p-5"
          >
            <div
              class="flex flex-col items-start gap-4 sm:flex-row sm:items-center"
            >
              <div
                class="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-primary text-2xl font-bold text-white"
              >
                <img
                  v-if="form.profileImage"
                  :src="form.profileImage"
                  alt="Profile preview"
                  class="h-full w-full object-cover"
                /><span v-else>{{ avatarText }}</span>
              </div>
              <div>
                <p class="text-sm font-semibold text-gray-900">Profile image</p>
                <p class="mt-1 text-xs text-gray-500">
                  PNG, JPG, or GIF up to 2 MB.
                </p>
                <label
                  class="mt-3 inline-flex cursor-pointer rounded-lg border border-primary px-4 py-2 text-xs font-semibold text-primary hover:bg-[#eaf6f3]"
                  >Upload Image<input
                    type="file"
                    accept="image/*"
                    class="hidden"
                    @change="handleImageChange"
                /></label>
              </div>
            </div>
          </div>
          <div class="grid gap-5 sm:grid-cols-2">
            <label class="text-sm font-semibold text-gray-700"
              >Name<input
                v-model="form.name"
                required
                class="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 font-normal outline-none focus:border-primary" /></label
            ><label class="text-sm font-semibold text-gray-700"
              >Email<input
                v-model="form.email"
                required
                type="email"
                class="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 font-normal outline-none focus:border-primary" /></label
            ><label class="text-sm font-semibold text-gray-700"
              >Phone<input
                v-model="form.phone"
                class="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 font-normal outline-none focus:border-primary" /></label
            ><label class="text-sm font-semibold text-gray-700"
              >Address<input
                v-model="form.address"
                class="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 font-normal outline-none focus:border-primary"
            /></label>
          </div>
          <div class="flex justify-end gap-3 border-t border-gray-100 pt-6">
            <button
              type="button"
              class="rounded-xl border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-700"
              @click="cancelEditing"
            >
              Cancel</button
            ><button
              type="submit"
              :disabled="saving"
              class="rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white disabled:opacity-60"
            >
              {{ saving ? "Saving..." : "Save Changes" }}
            </button>
          </div>
        </form>
        <dl v-else class="mt-8 grid gap-6 sm:grid-cols-2">
          <div>
            <dt
              class="text-xs font-semibold uppercase tracking-wider text-gray-400"
            >
              Name
            </dt>
            <dd class="mt-2 text-sm font-medium text-gray-900">
              {{ user.name || "Not provided" }}
            </dd>
          </div>
          <div>
            <dt
              class="text-xs font-semibold uppercase tracking-wider text-gray-400"
            >
              Email
            </dt>
            <dd class="mt-2 text-sm font-medium text-gray-900">
              {{ user.email || "Not provided" }}
            </dd>
          </div>
          <div>
            <dt
              class="text-xs font-semibold uppercase tracking-wider text-gray-400"
            >
              Phone
            </dt>
            <dd class="mt-2 text-sm font-medium text-gray-900">
              {{ user.phone || "Not provided" }}
            </dd>
          </div>
          <div>
            <dt
              class="text-xs font-semibold uppercase tracking-wider text-gray-400"
            >
              Address
            </dt>
            <dd class="mt-2 text-sm font-medium text-gray-900">
              {{ user.address || "Not provided" }}
            </dd>
          </div>
          <div>
            <dt
              class="text-xs font-semibold uppercase tracking-wider text-gray-400"
            >
              Role
            </dt>
            <dd class="mt-2 text-sm font-medium capitalize text-primary">
              {{ user.role || "user" }}
            </dd>
          </div>
          <div>
            <dt
              class="text-xs font-semibold uppercase tracking-wider text-gray-400"
            >
              Member Since
            </dt>
            <dd class="mt-2 text-sm font-medium text-gray-900">
              {{ formatMemberSince(user.memberSince || user.createdAt) }}
            </dd>
          </div>
        </dl>
        <div v-if="!editing" class="mt-10 border-t border-gray-100 pt-8">
          <h3 class="font-serif text-xl font-bold text-gray-950">
            Quick Actions
          </h3>
          <div class="mt-4 flex flex-wrap gap-3">
            <NuxtLink
              to="/order"
              class="rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 transition hover:border-primary hover:text-primary"
              >My Orders</NuxtLink
            ><NuxtLink
              to="/wishlist"
              class="rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 transition hover:border-primary hover:text-primary"
              >My Wishlist</NuxtLink
            ><NuxtLink
              to="/cart"
              class="rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 transition hover:border-primary hover:text-primary"
              >My Cart</NuxtLink
            >
          </div>
        </div>
        +
      </section>
      +
    </div>
    +
  </main>
  +
</template>
