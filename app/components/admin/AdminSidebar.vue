<script setup lang="ts">
const route = useRoute()
const open = defineModel<boolean>('open', { default: false })

const items = [
  { label: 'Dashboard', to: '/admin', icon: 'grid' },
  { label: 'Books', to: '/admin/books', icon: 'book' },
  { label: 'Categories', to: '/admin/categories', icon: 'tag' },
  { label: 'Orders', to: '/admin/orders', icon: 'bag' },
  { label: 'Users', to: '/admin/users', icon: 'users' }
]

const isActive = (to: string) => to === '/admin' ? route.path === to : route.path.startsWith(to)

const logout = async () => {
  localStorage.removeItem('user')
  await navigateTo('/auth/login')
}
</script>

<template>
  <aside class="fixed inset-y-0 left-0 z-50 flex w-72 -translate-x-full flex-col border-r border-[#d9e7e2] bg-[#fbfdfc] shadow-2xl transition-transform lg:translate-x-0" :class="open ? 'translate-x-0' : ''">
    <div class="flex h-20 items-center justify-between border-b border-[#e2ece8] px-6">
      <NuxtLink to="/admin" class="flex items-center gap-3" @click="open = false">
        <span class="flex h-10 w-10 items-center justify-center rounded-xl bg-primary font-bold text-white shadow-lg shadow-primary/20">R+</span>
        <span><strong class="block font-serif text-lg text-ink">ReadPlus</strong><small class="text-xs text-gray-500">Admin workspace</small></span>
      </NuxtLink>
      <button class="rounded-lg p-2 text-gray-500 hover:bg-[#eaf6f3] lg:hidden" aria-label="Close menu" @click="open = false">&#10005;</button>
    </div>

    <nav class="flex-1 space-y-1 overflow-y-auto px-4 py-6">
      <p class="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Workspace</p>
      <NuxtLink v-for="item in items" :key="item.to" :to="item.to" class="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition" :class="isActive(item.to) ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-gray-600 hover:bg-[#eaf6f3] hover:text-primary'" @click="open = false">
        <span class="flex h-6 w-6 items-center justify-center rounded-lg border border-current text-[10px] font-bold">{{ item.icon.slice(0, 1).toUpperCase() }}</span>
        {{ item.label }}
      </NuxtLink>
      <p class="mb-3 mt-8 px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Account</p>
      <NuxtLink to="/admin/profile" class="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-gray-600 hover:bg-[#eaf6f3] hover:text-primary" @click="open = false">Profile</NuxtLink>
      <NuxtLink to="/admin/settings" class="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-gray-600 hover:bg-[#eaf6f3] hover:text-primary" @click="open = false">Settings</NuxtLink>
    </nav>

    <div class="border-t border-[#e2ece8] p-4">
      <NuxtLink to="/" class="mb-3 block rounded-xl border border-[#d9e7e2] px-4 py-3 text-sm font-semibold text-gray-600 hover:border-primary hover:text-primary">View storefront</NuxtLink>
      <button class="w-full rounded-xl px-4 py-3 text-left text-sm font-semibold text-red-600 hover:bg-red-50" @click="logout">Sign out</button>
    </div>
  </aside>
  <button v-if="open" class="fixed inset-0 z-40 bg-ink/35 lg:hidden" aria-label="Close menu" @click="open = false" />
</template>
