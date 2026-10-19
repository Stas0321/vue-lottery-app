<script setup lang="ts">
import type { Participant, SortField, SortDirection } from '@/types/participant';
import BaseButton from './BaseButton.vue';

const props = defineProps<{
  participants: Participant[];
  sortField: SortField;
  sortDirection: SortDirection;
}>();

const emit = defineEmits<{
  (e: 'change-sort', field: SortField): void;
  (e: 'edit', participant: Participant): void;
  (e: 'delete', participant: Participant): void;
}>();

const toggleSort = (field: SortField) => {
  emit('change-sort', field);
};
</script>

<template>
  <div class="card shadow-sm">
    <div class="card-header bg-white py-3">
      <h4 class="mb-0">Список учасників ({{ participants.length }})</h4>
    </div>
    <div class="card-body p-0">
      <div class="table-responsive">
        <table class="table table-hover align-middle mb-0">
          <thead class="table-light">
            <tr>
              <th scope="col">#</th>
              <th scope="col" style="cursor: pointer" @click="toggleSort('name')">
                Ім'я
                <i
                  v-if="sortField === 'name'"
                  :class="[
                    'bi',
                    sortDirection === 'asc' ? 'bi-sort-alpha-down' : 'bi-sort-alpha-down-alt'
                  ]"
                ></i>
                <i v-else class="bi bi-arrow-down-up text-muted"></i>
              </th>
              <th scope="col">E-mail</th>
              <th scope="col">Телефон</th>
              <th scope="col" style="cursor: pointer" @click="toggleSort('birthDate')">
                Дата народження
                <i
                  v-if="sortField === 'birthDate'"
                  :class="[
                    'bi',
                    sortDirection === 'asc' ? 'bi-sort-down' : 'bi-sort-down-alt'
                  ]"
                ></i>
                <i v-else class="bi bi-arrow-down-up text-muted"></i>
              </th>
              <th scope="col" class="text-center">Редагування</th>
              <th scope="col" class="text-center">Видалення</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="participants.length === 0">
              <td colspan="7" class="text-center py-4 text-muted">
                Немає зареєстрованих учасників або нікого не знайдено за запитом.
              </td>
            </tr>
            <tr v-for="(item, index) in participants" :key="item.id">
              <th scope="row">{{ index + 1 }}</th>
              <td>{{ item.name }}</td>
              <td>{{ item.email }}</td>
              <td>{{ item.phone }}</td>
              <td>{{ item.birthDate }}</td>
              <td class="text-center">
                <BaseButton variant="warning" @click="$emit('edit', item)">
                  <i class="bi bi-pencil-square"></i> Редагувати
                </BaseButton>
              </td>
              <td class="text-center">
                <BaseButton variant="danger" @click="$emit('delete', item)">
                  <i class="bi bi-trash"></i> Видалити
                </BaseButton>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>