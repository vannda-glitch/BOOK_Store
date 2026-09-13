<script setup lang="ts">
definePageMeta({ layout: "admin", middleware: "admin" });

const API_URL = "http://localhost:8000";
const users = ref<any[]>([]);
const loading = ref(true);
const saving = ref(false);
const search = ref("");
const error = ref("");
const editingUser = ref<any | null>(null);
const form = reactive({
  name: "",
  email: "",
  phone: "",
  address: "",
  role: "user",
  profileImage: "",
});

const loadUsers = async () => {
  loading.value = true;
  error.value = "";
  try {
    users.value = await $fetch<any[]>(`${API_URL}/users`);
  } catch (loadError) {
    console.error("Failed to load users:", loadError);
    error.value =
      "Unable to load users. Please check that JSON Server is running.";
  } finally {
    loading.value = false;
  }
};

const filtered = computed(() =>
  users.value.filter((user) =>
    `${user.name} ${user.email}`
      .toLowerCase()
      .includes(search.value.toLowerCase()),
  ),
);

const startEdit = (id: string) => {
  const user = users.value.find((item) => String(item.id) === String(id));
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

const cancelEdit = () => {
  editingUser.value = null;
};

const saveChanges = async () => {
  if (!editingUser.value) return;
  saving.value = true;
  error.value = "";
  try {
    const updated = await $fetch<any>(
      `${API_URL}/users/${editingUser.value.id}`,
      {
        method: "PATCH",
        body: { ...form },
      },
    );
    const index = users.value.findIndex((user) => user.id === updated.id);
    if (index !== -1) users.value[index] = updated;

    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        const currentUser = JSON.parse(savedUser);
        if (String(currentUser.id) === String(updated.id)) {
          localStorage.setItem(
            "user",
            JSON.stringify({
              ...currentUser,
              id: updated.id,
              name: updated.name,
              email: updated.email,
              role: updated.role,
              profileImage: updated.profileImage || "",
            }),
          );
          window.dispatchEvent(new CustomEvent("auth-changed"));
        }
      } catch {
        localStorage.removeItem("user");
      }
    }

    editingUser.value = null;
  } catch (saveError) {
    console.error("Failed to update user:", saveError);
    error.value = "Unable to save user changes. Please try again.";
  } finally {
    saving.value = false;
  }
};

onMounted(loadUsers);
</script>

<template>
  <section>
    <AdminHeader
      title="Users"
      description="View and manage registered customers and administrators."
    />
    <div class="mb-5">
      <input
        v-model="search"
        placeholder="Search users"
        class="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-primary sm:max-w-sm"
      />
    </div>
    <p v-if="error" class="mb-5 rounded-xl bg-red-50 p-4 text-sm text-red-700">
      {{ error }}
    </p>
    <div v-if="loading" class="py-20 text-center text-sm text-gray-500">
      Loading users...
    </div>
    <div
      v-else
      class="overflow-hidden rounded-xl border border-gray-200 bg-white"
    >
      <div class="overflow-x-auto">
        <table class="w-full min-w-180">
          <thead class="bg-gray-50">
            <tr>
              <th
                class="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500"
              >
                Name
              </th>
              <th
                class="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500"
              >
                Email
              </th>
              <th
                class="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500"
              >
                Role
              </th>
              <th
                class="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-gray-500"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr
              v-for="user in filtered"
              :key="user.id"
              class="hover:bg-gray-50"
            >
              <td class="px-6 py-5">
                <div class="flex items-center gap-3">
                  <div
                    class="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary font-semibold text-white"
                  >
                    <img
                      v-if="user.profileImage"
                      :src="user.profileImage"
                      :alt="user.name"
                      class="h-full w-full object-cover"
                    />
                    <span v-else>{{
                      user.name?.charAt(0)?.toUpperCase() || "U"
                    }}</span>
                  </div>
                  <span class="font-semibold text-gray-900">{{
                    user.name || "Unnamed user"
                  }}</span>
                </div>
              </td>
              <td class="px-6 py-5 text-sm text-gray-600">
                {{ user.email || "No email" }}
              </td>
              <td class="px-6 py-5">
                <span
                  class="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold capitalize text-gray-700"
                  >{{ user.role || "user" }}</span
                >
              </td>
              <td class="px-6 py-5 text-right text-sm font-semibold">
                <NuxtLink
                  :to="`/admin/users/${user.id}`"
                  class="mr-4 text-primary hover:text-black"
                  >View</NuxtLink
                ><button
                  type="button"
                  class="text-primary hover:text-black"
                  @click="startEdit(user.id)"
                >
                  Edit
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div
        v-if="filtered.length === 0"
        class="px-6 py-12 text-center text-sm text-gray-500"
      >
        No users found.
      </div>
    </div>

    <div
      v-if="editingUser"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      @click.self="cancelEdit"
    >
      <form
        class="w-full max-w-xl rounded-2xl bg-white p-6 shadow-2xl sm:p-8"
        @submit.prevent="saveChanges"
      >
        <div class="flex items-start justify-between gap-4">
          <div>
            <h2 class="font-serif text-2xl font-bold text-ink">Edit User</h2>
            <p class="mt-1 text-sm text-gray-500">
              Update account information and role.
            </p>
          </div>
          <button
            type="button"
            class="text-2xl text-gray-400"
            aria-label="Close"
            @click="cancelEdit"
          >
            &times;
          </button>
        </div>
        <div class="mt-6 grid gap-4 sm:grid-cols-2">
          <div
            class="sm:col-span-2 rounded-xl border border-dashed border-primary/40 bg-[#f7fbfa] p-4"
          >
            <div class="flex items-center gap-4">
              <div
                class="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary text-xl font-bold text-white"
              >
                <img
                  v-if="form.profileImage"
                  :src="form.profileImage"
                  alt="Profile preview"
                  class="h-full w-full object-cover"
                /><span v-else>{{
                  form.name?.charAt(0)?.toUpperCase() || "U"
                }}</span>
              </div>
              <label
                class="cursor-pointer rounded-lg border border-primary px-4 py-2 text-xs font-semibold text-primary hover:bg-[#eaf6f3]"
                >Upload Image<input
                  type="file"
                  accept="image/*"
                  class="hidden"
                  @change="handleImageChange"
              /></label>
            </div>
          </div>
          <label class="text-sm font-medium text-gray-700"
            >Name<input
              v-model="form.name"
              required
              class="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2.5 outline-none focus:border-primary"
          /></label>
          <label class="text-sm font-medium text-gray-700"
            >Email<input
              v-model="form.email"
              type="email"
              required
              class="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2.5 outline-none focus:border-primary"
          /></label>
          <label class="text-sm font-medium text-gray-700"
            >Phone<input
              v-model="form.phone"
              class="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2.5 outline-none focus:border-primary"
          /></label>
          <label class="text-sm font-medium text-gray-700"
            >Address<input
              v-model="form.address"
              class="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2.5 outline-none focus:border-primary"
          /></label>
          <label class="text-sm font-medium text-gray-700 sm:col-span-2"
            >Role<select
              v-model="form.role"
              class="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2.5 outline-none focus:border-primary"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select></label
          >
        </div>
        <div class="mt-7 flex justify-end gap-3">
          <button
            type="button"
            class="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-700"
            @click="cancelEdit"
          >
            Cancel</button
          ><button
            type="submit"
            :disabled="saving"
            class="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
          >
            {{ saving ? "Saving..." : "Save Changes" }}
          </button>
        </div>
      </form>
    </div>
  </section>
</template>
