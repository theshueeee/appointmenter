<script setup>
import { ref } from 'vue';
import { useAuthStore } from '@/stores/authStore';
import { storeToRefs } from 'pinia';
import { RouterLink } from 'vue-router';

const authStore = useAuthStore();
const { loading } = storeToRefs(authStore);

const email = ref('');
const submitted = ref(false);
const localError = ref('');

const handleSubmit = async () => {
  localError.value = '';
  if (!email.value) {
    localError.value = 'Email is required';
    return;
  }

  const result = await authStore.forgotPassword(email.value);
  if (result.error) {
    localError.value = result.error;
    return;
  }

  submitted.value = true;
};
</script>

<template>
  <div class="min-h-screen bg-stone-50 flex items-center justify-center py-12 px-4">
    <div class="w-full max-w-sm">
      <div class="text-center mb-8">
        <h1 class="text-2xl font-bold text-stone-800 uppercase tracking-wider">Reset Password</h1>
        <div class="w-8 h-0.5 bg-stone-800 mx-auto mt-2"></div>
      </div>

      <div class="border-2 border-stone-800 bg-white p-8">
        <div v-if="localError" class="bg-red-100 border-2 border-red-600 text-red-700 px-3 py-2 mb-6 text-xs uppercase tracking-wider">
          {{ localError }}
        </div>

        <div v-if="submitted" class="space-y-5">
          <div class="bg-green-100 border-2 border-green-600 text-green-700 px-3 py-2 mb-4 text-xs uppercase tracking-wider">
            If that email exists, a reset link has been sent.
          </div>
          <p class="text-xs text-stone-600 text-center">Check your email inbox for the reset link.</p>
          <RouterLink to="/login" class="block text-center text-xs text-stone-700 font-bold underline hover:text-stone-600 transition-colors uppercase tracking-wider">
            Back to sign in
          </RouterLink>
        </div>

        <form v-else @submit.prevent="handleSubmit" class="space-y-5">
          <div>
            <label class="block text-xs font-medium text-stone-700 uppercase tracking-wider mb-1.5" for="email">Email</label>
            <input
              id="email"
              v-model="email"
              type="email"
              required
              placeholder="you@example.com"
              class="w-full px-3 py-2 border-2 border-stone-300 text-sm focus:outline-none focus:border-stone-800 transition-colors placeholder:text-stone-400"
            />
          </div>
          <button
            type="submit"
            :disabled="loading"
            class="w-full py-2 bg-stone-800 text-amber-100 text-xs font-bold uppercase tracking-wider hover:bg-stone-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ loading ? 'Sending...' : 'Send reset link' }}
          </button>
          <RouterLink to="/login" class="block text-center text-xs text-stone-600 underline hover:text-stone-800 transition-colors uppercase tracking-wider">
            Back to sign in
          </RouterLink>
        </form>
      </div>
    </div>
  </div>
</template>