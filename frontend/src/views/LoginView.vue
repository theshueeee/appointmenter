<script setup>
import { ref } from 'vue';
import { useAuthStore } from '@/stores/authStore';
import { storeToRefs } from 'pinia';
import { RouterLink } from 'vue-router';

const authStore = useAuthStore();
const { loading, error } = storeToRefs(authStore);

const email = ref('');
const password = ref('');

const handleSubmit = async () => {
  if (!email.value || !password.value) return;
  await authStore.login(email.value, password.value);
};
</script>

<template>
  <div class="min-h-screen bg-stone-50 flex items-center justify-center py-12 px-4">
    <div class="w-full max-w-sm">
      <div class="text-center mb-8">
        <h1 class="text-2xl font-bold text-stone-800 uppercase tracking-wider">Sign in</h1>
        <div class="w-8 h-0.5 bg-stone-800 mx-auto mt-2"></div>
      </div>

      <div class="border-2 border-stone-800 bg-white p-8">
        <div v-if="error" class="flex items-center gap-2 bg-red-100 border border-red-600 text-red-700 px-3 py-2 mb-6 text-xs uppercase tracking-wider">
          <span>{{ error }}</span>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-5">
          <div class="text-right">
            <RouterLink to="/forgot-password" class="text-xs text-stone-600 underline hover:text-stone-800 transition-colors uppercase tracking-wider">
              Forgot password?
            </RouterLink>
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
              placeholder="Enter your password"
              class="w-full px-3 py-2 border-2 border-stone-300 text-sm focus:outline-none focus:border-stone-800 transition-colors placeholder:text-stone-400"
            />
          </div>
          <button
            type="submit"
            :disabled="loading"
            class="w-full py-2 bg-stone-800 text-amber-100 text-xs font-bold uppercase tracking-wider hover:bg-stone-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ loading ? 'Signing in...' : 'Sign in' }}
          </button>
        </form>

        <p class="text-center text-xs text-stone-500 mt-6 uppercase tracking-wider">
          No account?
          <RouterLink to="/register" class="text-stone-800 font-bold underline hover:text-stone-600 transition-colors">Register</RouterLink>
        </p>
      </div>
    </div>
  </div>
</template>