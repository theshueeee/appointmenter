<script setup>
import { onMounted, ref } from 'vue';
import { useBookingStore } from '@/stores/bookingStore';
import { useAuthStore } from '@/stores/authStore';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';

const router = useRouter();
const authStore = useAuthStore();
const bookingStore = useBookingStore();
const { futureBookings, loading, error } = storeToRefs(bookingStore);
const cancelId = ref(null);

onMounted(async () => {
  if (!authStore.isAuthenticated) {
    router.push('/login');
    return;
  }
  await bookingStore.fetchFutureBookings();
});

const confirmCancel = (id) => {
  cancelId.value = id;
};

const cancelBooking = async () => {
  if (!cancelId.value) return;
  await bookingStore.deleteBooking(cancelId.value);
  cancelId.value = null;
};

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
  ACTIVE: 'bg-stone-800 text-amber-100',
  COMPLETED: 'bg-stone-400 text-white',
  CANCELLED: 'bg-red-200 text-red-800',
};

const getStatusClass = (status) => statusClasses[status] || 'bg-stone-200 text-stone-700';
</script>

<template>
  <div class="min-h-screen bg-stone-50 py-8 sm:py-12">
    <div class="max-w-4xl mx-auto px-4">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 class="text-2xl font-bold text-stone-800 uppercase tracking-wider">Upcoming Bookings</h1>
          <p class="text-xs text-stone-500 uppercase tracking-wider mt-1">Manage your scheduled rooms</p>
        </div>
        <router-link
          to="/bookings/new"
          class="px-5 py-2 bg-stone-800 text-amber-100 text-xs font-bold uppercase tracking-wider hover:bg-stone-700 transition-colors inline-block text-center"
        >
          + New Booking
        </router-link>
      </div>

      <div v-if="loading && futureBookings.length === 0" class="flex flex-col items-center justify-center py-20">
        <p class="text-xs text-stone-500 uppercase tracking-wider">Loading...</p>
      </div>

      <div v-else-if="error" class="bg-red-100 border-2 border-red-600 text-red-700 px-3 py-2 mb-6 text-xs uppercase tracking-wider">
        {{ error }}
      </div>

      <div v-else-if="futureBookings.length === 0" class="border-2 border-stone-800 bg-white p-12 text-center">
        <h3 class="text-sm font-bold text-stone-800 uppercase tracking-wider mb-2">No upcoming bookings</h3>
        <p class="text-xs text-stone-500 mb-6">You haven't booked any rooms yet.</p>
        <router-link to="/bookings/new" class="px-5 py-2 bg-stone-800 text-amber-100 text-xs font-bold uppercase tracking-wider hover:bg-stone-700 transition-colors inline-block">
          Book a room
        </router-link>
      </div>

      <div v-else class="space-y-4">
        <div
          v-for="booking in futureBookings"
          :key="booking.id"
          class="border-2 border-stone-800 bg-white"
        >
          <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 p-6">
            <div class="flex-1 min-w-0">
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
            <div class="flex items-center gap-2 shrink-0">
              <router-link
                :to="`/bookings/edit/${booking.id}`"
                class="px-3 py-1.5 text-xs font-bold uppercase tracking-wider border-2 border-stone-400 text-stone-700 hover:border-stone-800 hover:text-stone-900 transition-colors"
              >
                Edit
              </router-link>
              <button
                @click="confirmCancel(booking.id)"
                class="px-3 py-1.5 text-xs font-bold uppercase tracking-wider border-2 border-red-400 text-red-700 hover:border-red-600 hover:text-red-800 transition-colors cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
          <div v-if="cancelId === booking.id" class="border-t-2 border-stone-800 p-4 bg-red-50">
            <p class="text-xs text-red-700 mb-3">Are you sure you want to cancel this booking?</p>
            <div class="flex gap-2">
              <button
                @click="cancelBooking"
                class="px-3 py-1.5 text-xs font-bold uppercase tracking-wider bg-red-600 text-white hover:bg-red-500 transition-colors cursor-pointer"
              >
                Yes, cancel
              </button>
              <button
                @click="cancelId = null"
                class="px-3 py-1.5 text-xs font-bold uppercase tracking-wider bg-stone-200 text-stone-700 hover:bg-stone-300 transition-colors cursor-pointer"
              >
                Keep
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>