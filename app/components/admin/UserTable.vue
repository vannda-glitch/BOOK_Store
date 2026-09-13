<script setup lang="ts">
defineProps<{
  users: any[];
}>();

const emit = defineEmits<{
  delete: [id: string];
}>();
</script>

<template>
  <div class="rounded-xl border border-gray-200 bg-white">
    <div class="overflow-x-auto">
      <table class="w-full">
        <thead class="bg-gray-50">
          <tr>
            <th
              class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
            >
              Name
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
            >
              Email
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
            >
              Role
            </th>
            <th
              class="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500"
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr v-for="user in users" :key="user.id" class="hover:bg-gray-50">
            <td class="whitespace-nowrap px-6 py-4">
              <div class="flex items-center gap-3">
                <div
                  class="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 font-semibold text-gray-600"
                >
                  {{ user.name?.charAt(0)?.toUpperCase() || "U" }}
                </div>
                <p class="font-medium text-gray-900">{{ user.name }}</p>
              </div>
            </td>
            <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
              {{ user.email }}
            </td>
            <td class="whitespace-nowrap px-6 py-4">
              <span
                :class="
                  user.role === 'admin'
                    ? 'bg-purple-100 text-purple-800'
                    : 'bg-gray-100 text-gray-800'
                "
                class="rounded-full px-2 py-1 text-xs font-medium"
              >
                {{ user.role }}
              </span>
            </td>
            <td
              class="whitespace-nowrap px-6 py-4 text-right text-sm font-medium"
            >
              <div class="flex justify-end gap-3">
                <NuxtLink
                  :to="`/admin/users/${user.id}`"
                  class="text-primary hover:text-black"
                  >View</NuxtLink
                >
                <button
                  type="button"
                  class="text-primary hover:text-black"
                  @click="emit('delete', user.id)"
                >
                  Edit
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-if="users.length === 0" class="px-6 py-12 text-center text-gray-500">
      No users found.
    </div>
  </div>
</template>
