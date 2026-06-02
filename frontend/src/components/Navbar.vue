<script setup>
import logo from '@/assets/img/logo.png';
import { RouterLink, useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';
import { storeToRefs } from 'pinia';
import { ref } from 'vue';

const route = useRoute();
const authStore = useAuthStore();
const { user, isAuthenticated } = storeToRefs(authStore);
const mobileMenuOpen = ref(false);

const isActiveLink = (routePath) => route.path === routePath;

const handleLogout = () => {
  authStore.logout();
  mobileMenuOpen.value = false;
};
</script>

<template>
  <nav class="bg-amber-100 border-b-2 border-stone-800 sticky top-0 z-50">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex h-14 items-center justify-between">
        <div class="flex items-center gap-6">
          <RouterLink to="/" class="flex items-center gap-2 shrink-0">
            <div class="w-8 h-8 bg-stone-800 flex items-center justify-center">
              <span class="text-amber-100 text-xs font-bold">A</span>
            </div>
            <span class="text-sm font-bold text-stone-800 uppercase tracking-widest">Appointmenter</span>
          </RouterLink>
          <div class="hidden md:flex items-center gap-1">
            <RouterLink
              to="/"
              :class="[
                'px-3 py-1 text-xs font-medium uppercase tracking-wider border-b-2 transition-colors',
                isActiveLink('/') && !route.path.startsWith('/bookings')
                  ? 'border-stone-800 text-stone-800'
                  : 'border-transparent text-stone-600 hover:text-stone-800 hover:border-stone-400'
              ]"
            >Home</RouterLink>
            <RouterLink
              v-if="isAuthenticated"
              to="/bookings"
              :class="[
                'px-3 py-1 text-xs font-medium uppercase tracking-wider border-b-2 transition-colors',
                isActiveLink('/bookings')
                  ? 'border-stone-800 text-stone-800'
                  : 'border-transparent text-stone-600 hover:text-stone-800 hover:border-stone-400'
              ]"
            >My Bookings</RouterLink>
            <RouterLink
              v-if="isAuthenticated"
              to="/bookings/new"
              :class="[
                'px-3 py-1 text-xs font-medium uppercase tracking-wider border-b-2 transition-colors',
                isActiveLink('/bookings/new')
                  ? 'border-stone-800 text-stone-800'
                  : 'border-transparent text-stone-600 hover:text-stone-800 hover:border-stone-400'
              ]"
            >New Booking</RouterLink>
            <RouterLink
              v-if="isAuthenticated"
              to="/bookings/past"
              :class="[
                'px-3 py-1 text-xs font-medium uppercase tracking-wider border-b-2 transition-colors',
                isActiveLink('/bookings/past')
                  ? 'border-stone-800 text-stone-800'
                  : 'border-transparent text-stone-600 hover:text-stone-800 hover:border-stone-400'
              ]"
            >Past</RouterLink>
          </div>
        </div>
        <div class="hidden md:flex items-center gap-2">
          <template v-if="isAuthenticated">
            <div class="w-7 h-7 bg-stone-800 flex items-center justify-center">
              <span class="text-amber-100 text-xs font-bold">{{ user?.name?.charAt(0).toUpperCase() || 'U' }}</span>
            </div>
            <span class="text-xs text-stone-600 font-medium">{{ user?.name }}</span>
            <button
              @click="handleLogout"
              class="ml-2 px-3 py-1 text-xs font-medium uppercase tracking-wider text-stone-700 hover:text-stone-900 border border-stone-400 hover:border-stone-800 transition-colors cursor-pointer"
            >Logout</button>
          </template>
          <template v-else>
            <RouterLink
              to="/login"
              class="px-4 py-1 text-xs font-medium uppercase tracking-wider text-stone-700 hover:text-stone-900 transition-colors"
            >Login</RouterLink>
            <RouterLink
              to="/register"
              class="px-4 py-1 text-xs font-medium uppercase tracking-wider text-white bg-stone-800 hover:bg-stone-700 transition-colors"
            >Register</RouterLink>
          </template>
        </div>
        <button
          class="md:hidden p-2 border border-stone-400 text-stone-600 hover:border-stone-800 transition-colors cursor-pointer"
          @click="mobileMenuOpen = !mobileMenuOpen"
          aria-label="Toggle menu"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path v-if="!mobileMenuOpen" stroke-linecap="square" stroke-linejoin="miter" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            <path v-else stroke-linecap="square" stroke-linejoin="miter" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <div v-if="mobileMenuOpen" class="md:hidden border-t-2 border-stone-800 py-3 space-y-1">
        <RouterLink @click="mobileMenuOpen = false" to="/" class="block px-3 py-1 text-xs font-medium uppercase tracking-wider text-stone-700 hover:text-stone-900">Home</RouterLink>
        <RouterLink v-if="isAuthenticated" @click="mobileMenuOpen = false" to="/bookings" class="block px-3 py-1 text-xs font-medium uppercase tracking-wider text-stone-700 hover:text-stone-900">My Bookings</RouterLink>
        <RouterLink v-if="isAuthenticated" @click="mobileMenuOpen = false" to="/bookings/new" class="block px-3 py-1 text-xs font-medium uppercase tracking-wider text-stone-700 hover:text-stone-900">New Booking</RouterLink>
        <RouterLink v-if="isAuthenticated" @click="mobileMenuOpen = false" to="/bookings/past" class="block px-3 py-1 text-xs font-medium uppercase tracking-wider text-stone-700 hover:text-stone-900">Past</RouterLink>
        <hr class="my-2 border-stone-300" />
        <template v-if="isAuthenticated">
          <div class="px-3 py-1 text-xs text-stone-500">{{ user?.name }}</div>
          <button @click="handleLogout" class="w-full text-left px-3 py-1 text-xs font-medium uppercase tracking-wider text-stone-700 hover:text-stone-900 cursor-pointer">Logout</button>
        </template>
        <template v-else>
          <RouterLink @click="mobileMenuOpen = false" to="/login" class="block px-3 py-1 text-xs font-medium uppercase tracking-wider text-stone-700 hover:text-stone-900">Login</RouterLink>
          <RouterLink @click="mobileMenuOpen = false" to="/register" class="block px-3 py-1 text-xs font-medium uppercase tracking-wider text-white bg-stone-800 px-3 py-1 inline-block">Register</RouterLink>
        </template>
      </div>
    </div>
  </nav>
</template>