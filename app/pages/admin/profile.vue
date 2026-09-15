<script setup lang="ts">
definePageMeta({ layout: "admin", middleware: "admin" });

type AdminUser = {
  name?: string;
  email?: string;
  role?: string;
  phone?: string;
  profileImage?: string;
};
const user = ref<AdminUser>({});
const savedMessage = ref("");
const form = reactive({
  name: "",
  email: "",
  phone: "+855 12 345 678",
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
});

const loadUser = () => {
  const saved = localStorage.getItem("user");
  if (saved) user.value = JSON.parse(saved);
  form.name = user.value.name || "Administrator";
  form.email = user.value.email || "";
  form.phone = user.value.phone || "+855 12 345 678";
};

const initials = computed(() =>
  (form.name || "A")
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase(),
);

const saveChanges = () => {
  const updatedUser = {
    ...user.value,
    name: form.name.trim() || "Administrator",
    email: form.email.trim(),
    phone: form.phone.trim(),
  };
  user.value = updatedUser;
  localStorage.setItem("user", JSON.stringify(updatedUser));
  window.dispatchEvent(new CustomEvent("auth-changed"));
  savedMessage.value = "Changes saved";
  window.setTimeout(() => (savedMessage.value = ""), 2500);
};

const discardChanges = () => loadUser();

onMounted(loadUser);
</script>

<template>
  <section class="max-w-6xl">
    <AdminHeader
      title="Profile"
      description="Manage your administrator credentials, personal details, and bookstore permissions."
    />
    <div class="mb-6 flex justify-end gap-3 lg:-mt-20">
      <button
        type="button"
        class="rounded-xl border border-[#d9e7e2] bg-white px-4 py-2.5 text-xs font-semibold text-gray-600 transition hover:border-primary hover:text-primary"
        @click="discardChanges"
      >
        Discard
      </button>
      <button
        type="button"
        class="rounded-xl bg-primary px-4 py-2.5 text-xs font-semibold text-white shadow-lg shadow-primary/20 transition hover:bg-[#0b5f59]"
        @click="saveChanges"
      >
        <span aria-hidden="true">✓</span> Save Changes
      </button>
    </div>
    <p
      v-if="savedMessage"
      class="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700"
      role="status"
    >
      {{ savedMessage }}
    </p>

    <div class="grid gap-5 lg:grid-cols-[155px_minmax(0,1fr)]">
      <div class="space-y-5">
        <div class="rounded-2xl border border-[#d9e7e2] bg-white p-4 shadow-sm">
          <div
            class="mx-auto flex h-24 w-24 items-center justify-center overflow-hidden rounded-xl bg-[#075b55] text-2xl font-bold text-white"
          >
            <img
              v-if="user.profileImage"
              :src="user.profileImage"
              :alt="form.name"
              class="h-full w-full object-cover"
            /><span v-else>{{ initials }}</span>
          </div>
          <div class="mt-4 text-center">
            <p class="text-sm font-bold text-ink">{{ form.name }}</p>
            <p class="mt-1 break-all text-[9px] text-gray-500">
              {{ form.email }}
            </p>
            <div class="mt-2 flex flex-wrap justify-center gap-1">
              <span
                class="rounded-full bg-emerald-50 px-2 py-1 text-[9px] font-semibold text-emerald-700"
                >● admin</span
              ><span
                class="rounded-full bg-blue-50 px-2 py-1 text-[9px] font-semibold text-blue-700"
                >Store Owner</span
              >
            </div>
          </div>
          <div class="mt-5 space-y-2 border-t border-[#edf1ef] pt-4 text-[9px]">
            <div class="flex justify-between gap-2">
              <span class="text-gray-400">Account status:</span
              ><span class="font-semibold text-emerald-600"
                >● Active &amp; Verified</span
              >
            </div>
            <div class="flex justify-between gap-2">
              <span class="text-gray-400">Last sign in:</span
              ><span class="text-gray-600">Just now</span>
            </div>
          </div>
          <div class="mt-4 flex gap-2">
            <button
              type="button"
              class="flex-1 rounded-lg bg-[#f1f7f5] px-2 py-2 text-[9px] font-semibold text-primary"
            >
              Upload Photo</button
            ><button type="button" class="px-1 text-[9px] text-gray-400">
              Remove
            </button>
          </div>
        </div>
        <div class="rounded-2xl border border-[#d9e7e2] bg-white p-4 shadow-sm">
          <p
            class="text-[9px] font-bold uppercase tracking-[0.16em] text-gray-400"
          >
            Admin privileges
          </p>
          <ul class="mt-3 space-y-2 text-[10px] text-gray-600">
            <li>✓ Full inventory &amp; catalog control</li>
            <li>✓ Orders, refunds &amp; transactions</li>
            <li>✓ User role creation &amp; promotion</li>
            <li>✓ System and API key management</li>
          </ul>
        </div>
      </div>

      <div class="space-y-5">
        <div
          class="rounded-2xl border border-[#d9e7e2] bg-white p-5 shadow-sm sm:p-6"
        >
          <div class="border-b border-[#edf1ef] pb-4">
            <h2 class="text-sm font-bold text-ink">
              Personal &amp; Account Information
            </h2>
            <p class="mt-1 text-[10px] text-gray-500">
              Update how your administrator identity is presented across the
              bookstore system.
            </p>
          </div>
          <div class="mt-5 grid gap-4 sm:grid-cols-2">
            <label class="text-[10px] font-semibold text-gray-600"
              >Display Name<input
                v-model="form.name"
                type="text"
                class="mt-2 w-full px-3 py-2 text-xs" /></label
            ><label class="text-[10px] font-semibold text-gray-600"
              >Full Legal Name<input
                type="text"
                value="Koa Vanda"
                class="mt-2 w-full px-3 py-2 text-xs" /></label
            ><label class="text-[10px] font-semibold text-gray-600"
              >Administrator Email
              <div class="mt-2 flex items-center gap-2">
                <input
                  v-model="form.email"
                  type="email"
                  class="min-w-0 flex-1 px-3 py-2 text-xs"
                /><span class="text-[9px] font-semibold text-primary"
                  >Change</span
                >
              </div></label
            ><label class="text-[10px] font-semibold text-gray-600"
              >Contact Phone<input
                v-model="form.phone"
                type="tel"
                class="mt-2 w-full px-3 py-2 text-xs"
            /></label>
          </div>
          <div class="mt-4">
            <p class="text-[10px] font-semibold text-gray-600">Assigned Role</p>
            <div class="mt-2 flex items-center gap-3">
              <span
                class="rounded-full bg-emerald-50 px-3 py-1 text-[10px] font-semibold text-emerald-700"
                >admin</span
              ><span class="text-[10px] text-gray-500"
                >Primary administrative privileges. Role modifications require
                Root access.</span
              >
            </div>
          </div>
          <label class="mt-4 block text-[10px] font-semibold text-gray-600"
            >Staff Bio &amp; Store Notes<textarea
              rows="2"
              class="mt-2 w-full px-3 py-2 text-xs"
            >
Lead bookstore curator and system administrator for ReadPlus. Responsible for catalog taxonomy, order fulfillment pipelines, and reader experience.</textarea
            >
          </label>
        </div>

        <div
          class="rounded-2xl border border-[#d9e7e2] bg-white p-5 shadow-sm sm:p-6"
        >
          <div
            class="flex items-start justify-between gap-4 border-b border-[#edf1ef] pb-4"
          >
            <div>
              <h2 class="text-sm font-bold text-ink">
                Security &amp; Authentication
              </h2>
              <p class="mt-1 text-[10px] text-gray-500">
                Manage passwords and active workplace sessions.
              </p>
            </div>
            <span
              class="rounded-full bg-emerald-50 px-2 py-1 text-[9px] font-semibold text-emerald-700"
              >✓ 2FA Enabled</span
            >
          </div>
          <div class="mt-5 grid gap-4 sm:grid-cols-3">
            <label class="text-[10px] font-semibold text-gray-600"
              >Current Password<input
                v-model="form.currentPassword"
                type="password"
                placeholder="••••••••••"
                class="mt-2 w-full px-3 py-2 text-xs" /></label
            ><label class="text-[10px] font-semibold text-gray-600"
              >New Password<input
                v-model="form.newPassword"
                type="password"
                placeholder="Enter new password"
                class="mt-2 w-full px-3 py-2 text-xs" /></label
            ><label class="text-[10px] font-semibold text-gray-600"
              >Confirm Password<input
                v-model="form.confirmPassword"
                type="password"
                placeholder="Repeat new password"
                class="mt-2 w-full px-3 py-2 text-xs"
            /></label>
          </div>
          <div class="mt-5 border-t border-[#edf1ef] pt-4">
            <div class="flex items-center justify-between">
              <p
                class="text-[9px] font-bold uppercase tracking-[0.16em] text-gray-400"
              >
                Active work sessions
              </p>
              <button
                type="button"
                class="text-[9px] font-semibold text-red-600"
              >
                Revoke other sessions
              </button>
            </div>
            <div
              class="mt-3 flex items-center justify-between rounded-xl bg-[#f1f7f5] px-3 py-3 text-[10px]"
            >
              <span class="font-semibold text-ink"
                >▣ Chrome on macOS (Phnom Penh)</span
              ><span class="text-emerald-600">● Current session</span
              ><span class="text-gray-500">Active</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
