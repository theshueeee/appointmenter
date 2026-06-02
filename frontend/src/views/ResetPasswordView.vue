<script setup>
import { ref } from 'vue';
import { useRoute, useRouter, RouterLink } from 'vue-router';

const route = useRoute();
const router = useRouter();
const API_URL = 'http://localhost:5000';

const token = route.params.token;
const password = ref('');
const confirmPassword = ref('');
const loading = ref(false);
const error = ref('');
const success = ref(false);

const handleSubmit = async () => {
  error.value = '';

  if (!password.value || !confirmPassword.value) {
    error.value = 'All fields are required';
    return;
  }

  if (password.value !== confirmPassword.value) {
    error.value = 'Passwords do not match';
    return;
  }

  if (password.value.length < 6) {
    error.value = 'Password must be at least 6 characters';
    return;
  }

  loading.value = true;
  try {
    const res = await fetch(`${API_URL}/auth/reset-password/${token}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: password.value }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to reset password');
    }
    success.value = true;
    setTimeout(() => {
      router.push('/login');
    }, 2000);
  } catch (err) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="min-h-screen bg-stone-50 flex items-center justify-center py-12 px-4">
    <div class="w-full max-w-sm">
      <div class="text-center mb-8">
        <h1 class="text-2xl font-bold text-stone-800 uppercase tracking-wider">New Password</h1>
        <div class="w-8 h-0.5 bg-stone-800 mx-auto mt-2"></div>
      </div>

      <div class="border-2 border-stone-800 bg-white p-8">
        <div v-if="error" class="bg-red-100 border-2 border-red-600 text-red-700 px-3 py-2 mb-6 text-xs uppercase tracking-wider">
          {{ error }}
        </div>

        <div v-if="success" class="bg-green-100 border-2 border-green-600 text-green-700 px-3 py-2 mb-4 text-xs uppercase tracking-wider">
          Password updated! Redirecting to sign in...
        </div>

        <form v-else @submit.prevent="handleSubmit" class="space-y-5">
          <div>
            <label class="block text-xs font-medium text-stone-700 uppercase tracking-wider mb-1.5" for="password">New Password</label>
            <input
              id="password"
              v-model="password"
              type="password"
              required
              placeholder="At least 6 characters"
              class="w-full px-3 py-2 border-2 border-stone-300 text-sm focus:outline-none focus:border-stone-800 transition-colors placeholder:text-stone-400"
            />
          </div>
          <div>
            <label class="block text-xs font-medium text-stone-700 uppercase tracking-wider mb-1.5" for="confirmPassword">Confirm Password</label>
            <input
              id="confirmPassword"
              v-model="confirmPassword"
              type="password"
              required
              placeholder="Repeat your password"
              class="w-full px-3 py-2 border-2 border-stone-300 text-sm focus:outline-none focus:border-stone-800 transition-colors placeholder:text-stone-400"
            />
          </div>
          <button
            type="submit"
            :disabled="loading"
            class="w-full py-2 bg-stone-800 text-amber-100 text-xs font-bold uppercase tracking-wider hover:bg-stone-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ loading ? 'Resetting...' : 'Reset password' }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>