import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useAuthStore } from './authStore';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const useBookingStore = defineStore('booking', () => {
  const authStore = useAuthStore();
  const futureBookings = ref([]);
  const pastBookings = ref([]);
  const meetingRooms = ref([]);
  const loading = ref(false);
  const error = ref(null);

  const getAuthHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${authStore.token}`,
  });

  async function fetchMeetingRooms() {
    loading.value = true;
    error.value = null;
    try {
      const res = await fetch(`${API_URL}/meetingrooms`, {
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to fetch meeting rooms');
      }
      meetingRooms.value = data.data.MeetingRooms;
    } catch (err) {
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  }

  async function fetchFutureBookings() {
    loading.value = true;
    error.value = null;
    try {
      const res = await fetch(`${API_URL}/bookings/get-future-booking`, {
        headers: getAuthHeaders(),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to fetch future bookings');
      }
      futureBookings.value = data.data.bookings;
    } catch (err) {
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  }

  async function fetchPastBookings() {
    loading.value = true;
    error.value = null;
    try {
      const res = await fetch(`${API_URL}/bookings/get-past-booking`, {
        headers: getAuthHeaders(),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to fetch past bookings');
      }
      pastBookings.value = data.data.bookings;
    } catch (err) {
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  }

  async function createBooking(meetingroom_id, start_time, end_time) {
    loading.value = true;
    error.value = null;
    try {
      const res = await fetch(`${API_URL}/bookings/create-booking`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ meetingroom_id, start_time, end_time }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to create booking');
      }
      // Refresh future bookings
      await fetchFutureBookings();
      return data.data.booking;
    } catch (err) {
      error.value = err.message;
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function updateBooking(bookingId, updates) {
    loading.value = true;
    error.value = null;
    try {
      const res = await fetch(`${API_URL}/bookings/update-booking?id=${bookingId}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(updates),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to update booking');
      }
      await fetchFutureBookings();
      await fetchPastBookings();
      return data.data.booking;
    } catch (err) {
      error.value = err.message;
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function deleteBooking(bookingId) {
    loading.value = true;
    error.value = null;
    try {
      const res = await fetch(`${API_URL}/bookings/delete-booking?id=${bookingId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to delete booking');
      }
      await fetchFutureBookings();
      await fetchPastBookings();
      return data;
    } catch (err) {
      error.value = err.message;
      throw err;
    } finally {
      loading.value = false;
    }
  }

  return {
    futureBookings, pastBookings, meetingRooms, loading, error,
    fetchMeetingRooms, fetchFutureBookings, fetchPastBookings,
    createBooking, updateBooking, deleteBooking,
  };
});