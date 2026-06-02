<script setup>
import { ref, onMounted, computed } from 'vue';
import { useBookingStore } from '@/stores/bookingStore';
import { useAuthStore } from '@/stores/authStore';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';

const router = useRouter();
const authStore = useAuthStore();
const bookingStore = useBookingStore();
const { meetingRooms, loading, error } = storeToRefs(bookingStore);

const selectedRoomId = ref('');
const date = ref('');
const startTime = ref('');
const endTime = ref('');
const successMessage = ref('');
const localError = ref('');

onMounted(async () => {
  if (!authStore.isAuthenticated) {
    router.push('/login');
    return;
  }
  await bookingStore.fetchMeetingRooms();
});

const handleSubmit = async () => {
  localError.value = '';
  successMessage.value = '';

  if (!selectedRoomId.value || !date.value || !startTime.value || !endTime.value) {
    localError.value = 'All fields are required';
    return;
  }

  const startDateTime = `${date.value}T${startTime.value}:00`;
  const endDateTime = `${date.value}T${endTime.value}:00`;

  const start = new Date(startDateTime);
  const end = new Date(endDateTime);

  if (end <= start) {
    localError.value = 'End time must be after start time';
    return;
  }

  const durationMs = end.getTime() - start.getTime();
  const durationMins = durationMs / (1000 * 60);
  if (durationMins < 15) {
    localError.value = 'Booking must be at least 15 minutes';
    return;
  }
  if (durationMins > 240) {
    localError.value = 'Booking cannot exceed 4 hours';
    return;
  }

  try {
    await bookingStore.createBooking(selectedRoomId.value, startDateTime, endDateTime);
    successMessage.value = 'Booking created successfully!';
    selectedRoomId.value = '';
    date.value = '';
    startTime.value = '';
    endTime.value = '';
  } catch (err) {
    localError.value = err.message || 'Failed to create booking';
  }
};

const today = computed(() => {
  const now = new Date();
  return now.toISOString().split('T')[0];
});
</script>

<template>
  <div class="min-h-screen bg-stone-50 py-8 sm:py-12">
    <div class="max-w-lg mx-auto px-4">
      <div class="mb-8">
        <h1 class="text-2xl font-bold text-stone-800 uppercase tracking-wider">Book a Room</h1>
        <p class="text-xs text-stone-500 uppercase tracking-wider mt-1">Fill in the details to reserve</p>
      </div>

      <div v-if="successMessage" class="bg-green-100 border-2 border-green-600 text-green-700 px-3 py-2 mb-6 text-xs uppercase tracking-wider">
        {{ successMessage }}
      </div>

      <div v-if="localError || error" class="bg-red-100 border-2 border-red-600 text-red-700 px-3 py-2 mb-6 text-xs uppercase tracking-wider">
        {{ localError || error }}
      </div>

      <div v-if="loading && meetingRooms.length === 0" class="flex flex-col items-center justify-center py-20">
        <p class="text-xs text-stone-500 uppercase tracking-wider">Loading...</p>
      </div>

      <form v-else @submit.prevent="handleSubmit" class="border-2 border-stone-800 bg-white p-8 space-y-5">
        <div>
          <label class="block text-xs font-medium text-stone-700 uppercase tracking-wider mb-1.5" for="room">Meeting Room</label>
          <select
            id="room"
            v-model="selectedRoomId"
            required
            class="w-full px-3 py-2 border-2 border-stone-300 text-sm focus:outline-none focus:border-stone-800 transition-colors bg-white"
          >
            <option value="" disabled>Select a room</option>
            <option v-for="room in meetingRooms" :key="room.id" :value="room.id">
              {{ room.name }} - {{ room.location }}
            </option>
          </select>
        </div>

        <div>
          <label class="block text-xs font-medium text-stone-700 uppercase tracking-wider mb-1.5" for="date">Date</label>
          <input
            id="date"
            v-model="date"
            type="date"
            :min="today"
            required
            class="w-full px-3 py-2 border-2 border-stone-300 text-sm focus:outline-none focus:border-stone-800 transition-colors"
          />
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-medium text-stone-700 uppercase tracking-wider mb-1.5" for="startTime">Start</label>
            <input
              id="startTime"
              v-model="startTime"
              type="time"
              required
              class="w-full px-3 py-2 border-2 border-stone-300 text-sm focus:outline-none focus:border-stone-800 transition-colors"
            />
          </div>
          <div>
            <label class="block text-xs font-medium text-stone-700 uppercase tracking-wider mb-1.5" for="endTime">End</label>
            <input
              id="endTime"
              v-model="endTime"
              type="time"
              required
              class="w-full px-3 py-2 border-2 border-stone-300 text-sm focus:outline-none focus:border-stone-800 transition-colors"
            />
          </div>
        </div>

        <div class="border-2 border-amber-400 bg-amber-50 p-4">
          <p class="text-xs font-bold text-amber-800 uppercase tracking-wider mb-2">Rules</p>
          <ul class="text-xs text-amber-700 space-y-1">
            <li>Duration: 15 min - 4 hours</li>
            <li>Max 5 reschedules per month</li>
          </ul>
        </div>

        <button
          type="submit"
          :disabled="loading"
          class="w-full py-2 bg-stone-800 text-amber-100 text-xs font-bold uppercase tracking-wider hover:bg-stone-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ loading ? 'Creating...' : 'Create Booking' }}
        </button>
      </form>
    </div>
  </div>
</template>