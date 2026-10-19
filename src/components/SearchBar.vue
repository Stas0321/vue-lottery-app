<script setup lang="ts">
import { ref, watch } from 'vue';

const emit = defineEmits<{
  (e: 'filter-by-name', value: string): void;
}>();

const query = ref('');
let timer: ReturnType<typeof setTimeout> | null = null;

watch(query, (newValue) => {
  if (timer) clearTimeout(timer);
  timer = setTimeout(() => {
    emit('filter-by-name', newValue.trim());
  }, 300);
});
</script>

<template>
  <div class="mb-3">
    <div class="input-group">
      <span class="input-group-text"><i class="bi bi-search"></i></span>
      <input
        v-model="query"
        type="text"
        class="form-control"
        placeholder="Пошук за іменем..."
      />
    </div>
  </div>
</template>