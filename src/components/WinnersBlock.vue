<script setup lang="ts">
import type { Participant } from '@/types/participant';
import BaseButton from './BaseButton.vue';
import WinnerCard from './WinnerCard.vue';

defineProps<{
  winners: Participant[];
  canPickWinner: boolean;
}>();

defineEmits<{
  (e: 'pick-winner'): void;
  (e: 'remove-winner', id: string): void;
}>();
</script>

<template>
  <div class="card mb-4 shadow-sm">
    <div class="card-header d-flex justify-content-between align-items-center bg-white py-3">
      <h4 class="mb-0">Переможці ({{ winners.length }}/3)</h4>
      <BaseButton
        variant="success"
        :disabled="!canPickWinner"
        @click="$emit('pick-winner')"
      >
        <i class="bi bi-dice-5-fill me-1"></i> New winner
      </BaseButton>
    </div>
    <div class="card-body">
      <div v-if="winners.length === 0" class="text-muted text-center py-3">
        Переможців ще не обрано. Натисніть «New winner»!
      </div>
      <div v-else class="row g-3">
        <div v-for="winner in winners" :key="winner.id" class="col-md-4">
          <WinnerCard :winner="winner" @remove="$emit('remove-winner', $event)" />
        </div>
      </div>
    </div>
  </div>
</template>