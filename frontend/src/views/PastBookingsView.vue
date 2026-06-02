<script setup>
import { onMounted } from 'vue';
import { useBookingStore } from '@/stores/bookingStore';
import { useAuthStore } from '@/stores/authStore';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';

const router = useRouter();
const authStore = useAuthStore();
const bookingStore = useBookingStore();
const { pastBookings, loading, error } = storeToRefs(bookingStore);

onMounted(async () => {
  if (!authStore.isAuthenticated) {
    router.push('/login');
    return;
  }
  await bookingStore.fetchPastBookings();
});

const formatDate = (dateStr) => {
  return new Date(dateStr).toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const formatTime = (dateStr) => {
  return new Date(dateStr).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

const statusClasses = {
  COMPLETED: 'bg-stone-400 text-white',
  CANCELLED: 'bg-red-200 text-red-800',
  ACTIVE: 'bg-stone-800 text-amber-100',
};

const getStatusClass = (status) => statusClasses[status] || 'bg-stone-200 text-stone-700';
</script>

<template>
  <div class="min-h-screen bg-stone-50 py-8 sm:py-12">
    <div class="max-w-4xl mx-auto px-4">
      <div class="mb-8">
        <h1 class="text-2xl font-bold text-stone-800 uppercase tracking-wider">Past Bookings</h1>
        <p class="text-xs text-stone-500 uppercase tracking-wider mt-1">Completed and cancelled bookings</p>
      </div>

      <div v-if="loading" class="flex flex-col items-center justify-center py-20">
        <p class="text-xs text-stone-500 uppercase tracking-wider">Loading...</p>
      </div>

      <div v-else-if="error" class="bg-red-100 border-2 border-red-600 text-red-700 px-3 py-2 mb-6 text-xs uppercase tracking-wider">
        {{ error }}
      </div>

      <div v-else-if="pastBookings.length === 0" class="border-2 border-stone-800 bg-white p-12 text-center">
        <h3 class="text-sm font-bold text-stone-800 uppercase tracking-wider mb-2">No past bookings</h3>
        <p class="text-xs text-stone-500">Your history will appear here once you complete or cancel bookings.</p>
      </div>

      <div v-else class="space-y-4">
        <div
          v-for="booking in pastBookings"
          :key="booking.id"
          class="border-2 border-stone-800 bg-white p-6"
        >
          <div class="flex items-center gap-3 mb-3">
            <h3 class="text-sm font-bold text-stone-800 uppercase tracking-wider truncate">{{ booking.meetingroom?.name || 'Meeting Room' }}</h3>
            <span :class="['px-2 py-0.5 text-xs font-bold uppercase tracking-wider', getStatusClass(booking.status)]">
              {{ booking.status }}
            </span>
          </div>
          <p class="text-xs text-stone-500 mb-3">{{ booking.meetingroom?.location || '' }}</p>
          <div class="flex flex-wrap items-center gap-4 text-xs text-stone-600">
            <span>{{ formatDate(booking.start_time) }}</span>
            <span>{{ formatTime(booking.start_time) }} - {{ formatTime(booking.end_time) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>