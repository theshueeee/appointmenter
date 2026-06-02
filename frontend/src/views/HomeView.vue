<script setup>
import { useAuthStore } from '@/stores/authStore';
import { storeToRefs } from 'pinia';
import { RouterLink } from 'vue-router';

const authStore = useAuthStore();
const { isAuthenticated } = storeToRefs(authStore);
</script>

<template>
  <div>
    <section class="bg-amber-100 border-b-2 border-stone-800">
      <div class="max-w-6xl mx-auto px-4 py-20 sm:py-28 text-center">
        <h1 class="text-5xl sm:text-6xl font-bold text-stone-800 uppercase tracking-tight mb-4">
          Appointmenter
        </h1>
        <div class="w-16 h-1 bg-stone-800 mx-auto mb-6"></div>
        <p class="text-stone-600 max-w-xl mx-auto mb-10 text-sm uppercase tracking-wider leading-relaxed">
          Book, manage, and reschedule your meeting room appointments. Streamline your team's collaboration.
        </p>
        <div class="flex flex-col sm:flex-row justify-center gap-4">
          <RouterLink
            v-if="!isAuthenticated"
            to="/register"
            class="px-8 py-3 bg-stone-800 text-amber-100 text-sm font-bold uppercase tracking-wider hover:bg-stone-700 transition-colors"
          >
            Get Started
          </RouterLink>
          <RouterLink
            v-if="isAuthenticated"
            to="/bookings/new"
            class="px-8 py-3 bg-stone-800 text-amber-100 text-sm font-bold uppercase tracking-wider hover:bg-stone-700 transition-colors"
          >
            Book a Room
          </RouterLink>
          <RouterLink
            v-if="isAuthenticated"
            to="/bookings"
            class="px-8 py-3 border-2 border-stone-800 text-stone-800 text-sm font-bold uppercase tracking-wider hover:bg-stone-800 hover:text-amber-100 transition-colors"
          >
            My Bookings
          </RouterLink>
        </div>
      </div>
    </section>

    <section class="border-b-2 border-stone-200 bg-white">
      <div class="max-w-6xl mx-auto px-4 py-6">
        <div class="grid grid-cols-3 gap-8 text-center">
          <div class="border-r-2 border-stone-200 last:border-r-0">
            <p class="text-3xl font-bold text-stone-800">15+</p>
            <p class="text-xs text-stone-500 uppercase tracking-wider mt-1">Meeting Rooms</p>
          </div>
          <div class="border-r-2 border-stone-200 last:border-r-0">
            <p class="text-3xl font-bold text-stone-800">99%</p>
            <p class="text-xs text-stone-500 uppercase tracking-wider mt-1">Uptime</p>
          </div>
          <div>
            <p class="text-3xl font-bold text-stone-800">24/7</p>
            <p class="text-xs text-stone-500 uppercase tracking-wider mt-1">Rescheduling</p>
          </div>
        </div>
      </div>
    </section>

    <section class="max-w-6xl mx-auto px-4 py-20">
      <div class="text-center mb-16">
        <h2 class="text-3xl font-bold text-stone-800 uppercase tracking-tight mb-2">Features</h2>
        <div class="w-12 h-1 bg-stone-800 mx-auto"></div>
      </div>
      <div class="grid md:grid-cols-3 gap-0 border-2 border-stone-800">
        <div class="p-8 border-r-2 border-stone-800 last:border-r-0">
          <h3 class="text-lg font-bold text-stone-800 uppercase tracking-wider mb-3">Easy Booking</h3>
          <p class="text-stone-600 text-sm leading-relaxed">Book meeting rooms with a few clicks. Choose your preferred time slot from available rooms instantly.</p>
        </div>
        <div class="p-8 border-r-2 border-stone-800 last:border-r-0">
          <h3 class="text-lg font-bold text-stone-800 uppercase tracking-wider mb-3">Reschedule</h3>
          <p class="text-stone-600 text-sm leading-relaxed">Need to change your booking? Reschedule easily with up to 5 reschedules per month.</p>
        </div>
        <div class="p-8">
          <h3 class="text-lg font-bold text-stone-800 uppercase tracking-wider mb-3">History</h3>
          <p class="text-stone-600 text-sm leading-relaxed">View your past and upcoming bookings all in one place. Stay organized and plan ahead.</p>
        </div>
      </div>
    </section>
  </div>
</template>