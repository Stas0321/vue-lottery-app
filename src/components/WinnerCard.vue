<script setup lang="ts">
import type { Participant } from '@/types/participant';
import BaseButton from './BaseButton.vue';

defineProps<{
  winner: Participant;
}>();

defineEmits<{
  (e: 'remove', id: string): void;
}>();
</script>

<template>
  <div class="card shadow-sm border-warning h-100">
    <div class="card-body d-flex flex-column justify-content-between">
      <div>
        <h5 class="card-title text-warning-emphasis">
          <i class="bi bi-trophy-fill text-warning me-2"></i>{{ winner.name }}
        </h5>
        <p class="card-text mb-1 text-muted">{{ winner.email }}</p>
        <p class="card-text small">{{ winner.phone }}</p>
      </div>
      <div class="mt-2 text-end">
        <BaseButton variant="danger" @click="$emit('remove', winner.id)">
          <i class="bi bi-trash"></i> Видалити
        </BaseButton>
      </div>
    </div>
  </div>
</template>