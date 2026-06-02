<script setup>
import { ref } from 'vue';
import { useAuthStore } from '@/stores/authStore';
import { storeToRefs } from 'pinia';
import { RouterLink } from 'vue-router';

const authStore = useAuthStore();
const { loading, error } = storeToRefs(authStore);

const name = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const localError = ref('');

const handleSubmit = async () => {
  localError.value = '';
  if (!name.value || !email.value || !password.value || !confirmPassword.value) {
    localError.value = 'All fields are required';
    return;
  }
  if (password.value !== confirmPassword.value) {
    localError.value = 'Passwords do not match';
    return;
  }
  if (password.value.length < 6) {
    localError.value = 'Password must be at least 6 characters';
    return;
  }
  await authStore.register(name.value, email.value, password.value);
};
</script>

<template>
  <div class="min-h-screen bg-stone-50 flex items-center justify-center py-12 px-4">
    <div class="w-full max-w-sm">
      <div class="text-center mb-8">
        <h1 class="text-2xl font-bold text-stone-800 uppercase tracking-wider">Register</h1>
        <div class="w-8 h-0.5 bg-stone-800 mx-auto mt-2"></div>
      </div>

      <div class="border-2 border-stone-800 bg-white p-8">
        <div v-if="localError || error" class="flex items-center gap-2 bg-red-100 border border-red-600 text-red-700 px-3 py-2 mb-6 text-xs uppercase tracking-wider">
          <span>{{ localError || error }}</span>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-5">
          <div>
            <label class="block text-xs font-medium text-stone-700 uppercase tracking-wider mb-1.5" for="name">Name</label>
            <input
              id="name"
              v-model="name"
              type="text"
              required
              placeholder="John Doe"
              class="w-full px-3 py-2 border-2 border-stone-300 text-sm focus:outline-none focus:border-stone-800 transition-colors placeholder:text-stone-400"
            />
          </div>
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
          <div>
            <label class="block text-xs font-medium text-stone-700 uppercase tracking-wider mb-1.5" for="password">Password</label>
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
            {{ loading ? 'Creating account...' : 'Create account' }}
          </button>
        </form>

        <p class="text-center text-xs text-stone-500 mt-6 uppercase tracking-wider">
          Have an account?
          <RouterLink to="/login" class="text-stone-800 font-bold underline hover:text-stone-600 transition-colors">Sign in</RouterLink>
        </p>
      </div>
    </div>
  </div>
</template>