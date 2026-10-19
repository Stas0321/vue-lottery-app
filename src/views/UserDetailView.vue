<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { ServiceProvider } from '@/services/service-provider';
import type { User } from '@/types/user';

const props = defineProps<{ id: string }>();
const user = ref<User | null>(null);
const loading = ref(true);

onMounted(async () => {
  try {
    user.value = await ServiceProvider.users.getById(Number(props.id));
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <div>
    <router-link to="/users" class="btn btn-outline-secondary btn-sm mb-3">
      <i class="bi bi-arrow-left"></i> Назад до списку
    </router-link>

    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary"></div>
    </div>

    <div v-else-if="user" class="card shadow-sm border-0 p-4">
      <div class="row">
        <div class="col-md-3 text-center">
          <img :src="user.image || 'https://via.placeholder.com/150'" class="rounded-circle img-fluid border mb-2" />
          <h4>{{ user.firstName }} {{ user.lastName }}</h4>
          <span class="badge bg-primary">{{ user.role || 'Користувач' }}</span>
        </div>
        <div class="col-md-9">
          <p><strong>Username:</strong> {{ user.username }}</p>
          <p><strong>Email:</strong> {{ user.email }}</p>
          <p><strong>Телефон:</strong> {{ user.phone }}</p>
          <p><strong>Вік:</strong> {{ user.age }}</p>
          <p><strong>Стать:</strong> {{ user.gender }}</p>
          <router-link :to="`/users/${user.id}/edit`" class="btn btn-warning">
            <i class="bi bi-pencil-square"></i> Редагувати
          </router-link>
        </div>
      </div>

      <!-- Точка монтування для вкладеного маршруту /users/:id/edit -->
      <div class="mt-4">
        <router-view />
      </div>
    </div>
  </div>
</template>