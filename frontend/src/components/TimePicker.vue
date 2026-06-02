<script setup>
import { computed } from 'vue';

const props = defineProps({
  modelValue: { type: String, default: '' },
  label: { type: String, default: '' },
  id: { type: String, default: '' },
  required: { type: Boolean, default: false },
});

const emit = defineEmits(['update:modelValue']);

const hours = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'));
const minutes = ['00', '05', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55'];

const selectedHour = computed({
  get: () => props.modelValue ? props.modelValue.split(':')[0] : '09',
  set: (val) => emit('update:modelValue', `${val}:${selectedMinute.value}`),
});

const selectedMinute = computed({
  get: () => props.modelValue ? props.modelValue.split(':')[1] || '00' : '00',
  set: (val) => emit('update:modelValue', `${selectedHour.value}:${val}`),
});
</script>

<template>
  <div>
    <label v-if="label" :for="id" class="block text-xs font-medium text-stone-700 uppercase tracking-wider mb-1.5">{{ label }}</label>
    <div class="grid grid-cols-2 gap-1">
      <select
        :id="id + '-hour'"
        v-model="selectedHour"
        class="px-2 py-2 border-2 border-stone-300 text-sm focus:outline-none focus:border-stone-800 transition-colors bg-white"
      >
        <option v-for="h in hours" :key="h" :value="h">{{ h }}</option>
      </select>
      <select
        :id="id + '-min'"
        v-model="selectedMinute"
        class="px-2 py-2 border-2 border-stone-300 text-sm focus:outline-none focus:border-stone-800 transition-colors bg-white"
      >
        <option v-for="m in minutes" :key="m" :value="m">{{ m }}</option>
      </select>
    </div>
  </div>
</template>