<script setup lang="ts">
definePageMeta({ layout: "admin", middleware: "admin" });

// Types
interface User {
  id: string | number;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  role: "user" | "admin";
  profileImage?: string;
}

// State
const API_URL = "http://localhost:8000"; // Recommendation: Move to useRuntimeConfig().public.apiUrl
const users = ref<User[]>([]);
const loading = ref(true);
const saving = ref(false);
const search = ref("");
const error = ref("");
const editingUser = ref<User | null>(null);

const form = reactive({
  name: "",
  email: "",
  phone: "",
  address: "",
  role: "user",
  profileImage: "",
});

// Computed
const filteredUsers = computed(() => {
  const query = search.value.toLowerCase();
  return users.value.filter((user) =>
    `${user.name} ${user.email}`.toLowerCase().includes(query)
  );
});

// Methods
const loadUsers = async () => {
  loading.value = true;
  error.value = "";
  
  try {
    users.value = await $fetch<User[]>(`${API_URL}/users`);
  } catch (loadError) {
    console.error("Failed to load users:", loadError);
    error.value = "Unable to load users. Please check that your server is running.";
  } finally {
    loading.value = false;
  }
};

const startEdit = (userId: string | number) => {
  const user = users.value.find((item) => String(item.id) === String(userId));
  if (!user) return;
  
  editingUser.value = user;
  Object.assign(form, {
    name: user.name || "",
    email: user.email || "",
    phone: user.phone || "",
    address: user.address || "",
    role: user.role || "user",
    profileImage: user.profileImage || "",
  });
};

const cancelEdit = () => {
  editingUser.value = null;
  error.value = "";
};

const handleImageChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  
  if (!file) return;
  
  if (!file.type.startsWith("image/")) {
    error.value = "Please select a valid image file.";
    return;
  }
  
  if (file.size > 2 * 1024 * 1024) {
    error.value = "Image size must be smaller than 2 MB.";
    return;
  }
  
  const reader = new FileReader();
  reader.onload = () => {
    form.profileImage = String(reader.result || "");
  };
  reader.readAsDataURL(file);
};

const syncLocalAuth = (updatedUser: User) => {
  const savedUser = localStorage.getItem("user");
  if (!savedUser) return;

  try {
    const currentUser = JSON.parse(savedUser);
    if (String(currentUser.id) === String(updatedUser.id)) {
      localStorage.setItem(
        "user",
        JSON.stringify({
          ...currentUser,
          id: updatedUser.id,
          name: updatedUser.name,
          email: updatedUser.email,
          role: updatedUser.role,
          profileImage: updatedUser.profileImage || "",
        })
      );
      window.dispatchEvent(new CustomEvent("auth-changed"));
    }
  } catch (e) {
    console.error("Failed to sync local auth state", e);
    localStorage.removeItem("user");
  }
};

const saveChanges = async () => {
  if (!editingUser.value) return;
  
  saving.value = true;
  error.value = "";
  
  try {
    const updated = await $fetch<User>(`${API_URL}/users/${editingUser.value.id}`, {
      method: "PATCH",
      body: { ...form },
    });
    
    // Update local state
    const index = users.value.findIndex((user) => user.id === updated.id);
    if (index !== -1) {
      users.value[index] = updated;
    }

    syncLocalAuth(updated);
    editingUser.value = null;
  } catch (saveError) {
    console.error("Failed to update user:", saveError);
    error.value = "Unable to save user changes. Please try again.";
  } finally {
    saving.value = false;
  }
};

// Lifecycle
onMounted(loadUsers);
</script>

<template>
  <section class="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
    <!-- Header -->
    <header class="mb-8">
      <p class="text-[10px] font-bold uppercase tracking-[0.24em] text-primary">
        Manage
      </p>
      <h1 class="mt-2 font-serif text-3xl font-bold tracking-tight text-ink sm:text-4xl">
        Users
      </h1>
      <p class="mt-2 text-sm text-gray-500">
        View and manage registered customers and administrators.
      </p>
    </header>

    <!-- Controls -->
    <div class="mb-6">
      <input
        v-model="search"
        type="search"
        placeholder="Search users by name or email"
        class="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary sm:max-w-sm"
      />
    </div>

    <!-- Alerts -->
    <div v-if="error && !editingUser" class="mb-6 rounded-xl bg-red-50 p-4 text-sm font-medium text-red-700">
      {{ error }}
    </div>

    <!-- Data Table -->
    <div v-if="loading" class="flex min-h-[200px] items-center justify-center rounded-xl border border-gray-200 bg-white text-sm text-gray-500">
      Loading users...
    </div>

    <div v-else class="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <div class="overflow-x-auto">
        <table class="w-full min-w-[45rem] text-left text-sm">
          <thead class="bg-gray-50 text-xs font-semibold uppercase tracking-wider text-gray-500">
            <tr>
              <th scope="col" class="px-6 py-4">Name</th>
              <th scope="col" class="px-6 py-4">Email</th>
              <th scope="col" class="px-6 py-4">Role</th>
              <th scope="col" class="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          
          <tbody class="divide-y divide-gray-100">
            <tr v-for="user in filteredUsers" :key="user.id" class="transition-colors hover:bg-gray-50">
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <div class="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary font-semibold text-white">
                    <img
                      v-if="user.profileImage"
                      :src="user.profileImage"
                      :alt="user.name"
                      class="h-full w-full object-cover"
                    />
                    <span v-else>{{ user.name?.charAt(0)?.toUpperCase() || "U" }}</span>
                  </div>
                  <span class="font-semibold text-gray-900">{{ user.name || "Unnamed User" }}</span>
                </div>
              </td>
              <td class="px-6 py-4 text-gray-600">
                {{ user.email || "—" }}
              </td>
              <td class="px-6 py-4">
                <span class="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-semibold capitalize text-gray-700">
                  {{ user.role || "user" }}
                </span>
              </td>
              <td class="px-6 py-4 text-right font-medium">
                <NuxtLink :to="`/admin/users/${user.id}`" class="mr-4 text-primary hover:text-primary/80 transition-colors">
                  View
                </NuxtLink>
                <button
                  type="button"
                  class="text-gray-400 transition-colors hover:text-primary"
                  aria-label="Edit user"
                  @click="startEdit(user.id)"
                >
                  <UiIcon name="edit" class="h-4 w-4 inline-block" />
                </button>
              </td>
            </tr>
            
            <tr v-if="filteredUsers.length === 0">
              <td colspan="4" class="px-6 py-12 text-center text-gray-500">
                No users found matching your search.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Edit Modal -->
    <Teleport to="body">
      <div v-if="editingUser" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm" @click.self="cancelEdit">
        <form class="w-full max-w-xl rounded-2xl bg-white p-6 shadow-2xl sm:p-8" @submit.prevent="saveChanges">
          
          <div class="flex items-start justify-between gap-4">
            <div>
              <h2 class="font-serif text-2xl font-bold text-ink">Edit User</h2>
              <p class="mt-1 text-sm text-gray-500">Update account information and role.</p>
            </div>
            <button type="button" class="rounded-full p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700" aria-label="Close" @click="cancelEdit">
              <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div v-if="error" class="mt-4 rounded-xl bg-red-50 p-3 text-sm font-medium text-red-700">
            {{ error }}
          </div>

          <div class="mt-6 grid gap-5 sm:grid-cols-2">
            <!-- Profile Image Upload -->
            <div class="sm:col-span-2 rounded-xl border border-dashed border-primary/40 bg-[#f7fbfa] p-5">
              <div class="flex items-center gap-5">
                <div class="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary text-xl font-bold text-white shadow-sm">
                  <img v-if="form.profileImage" :src="form.profileImage" alt="Profile preview" class="h-full w-full object-cover" />
                  <span v-else>{{ form.name?.charAt(0)?.toUpperCase() || "U" }}</span>
                </div>
                <div>
                  <label class="cursor-pointer inline-flex items-center rounded-lg border border-primary bg-white px-4 py-2 text-sm font-semibold text-primary transition-colors hover:bg-primary/5">
                    Upload New Image
                    <input type="file" accept="image/*" class="hidden" @change="handleImageChange" />
                  </label>
                  <p class="mt-1 text-xs text-gray-500">JPG, PNG or GIF. Max 2MB.</p>
                </div>
              </div>
            </div>

            <!-- Form Fields -->
            <div class="flex flex-col gap-1.5">
              <label for="name" class="text-sm font-medium text-gray-700">Name</label>
              <input id="name" v-model="form.name" type="text" required class="rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary" />
            </div>

            <div class="flex flex-col gap-1.5">
              <label for="email" class="text-sm font-medium text-gray-700">Email</label>
              <input id="email" v-model="form.email" type="email" required class="rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary" />
            </div>

            <div class="flex flex-col gap-1.5">
              <label for="phone" class="text-sm font-medium text-gray-700">Phone</label>
              <input id="phone" v-model="form.phone" type="tel" class="rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary" />
            </div>

            <div class="flex flex-col gap-1.5">
              <label for="address" class="text-sm font-medium text-gray-700">Address</label>
              <input id="address" v-model="form.address" type="text" class="rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary" />
            </div>

            <div class="flex flex-col gap-1.5 sm:col-span-2">
              <label for="role" class="text-sm font-medium text-gray-700">Role</label>
              <select id="role" v-model="form.role" class="rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary bg-white">
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>

          <div class="mt-8 flex justify-end gap-3">
            <button type="button" class="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50" @click="cancelEdit">
              Cancel
            </button>
            <button type="submit" :disabled="saving" class="flex min-w-[120px] items-center justify-center rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60">
              <svg v-if="saving" class="mr-2 h-4 w-4 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ saving ? "Saving..." : "Save Changes" }}
            </button>
          </div>
        </form>
      </div>
    </Teleport>
  </section>
</template>