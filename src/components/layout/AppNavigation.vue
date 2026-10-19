<script setup lang="ts">
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';

const auth = useAuthStore();
const router = useRouter();

const handleLogout = () => {
  auth.logout();
  router.push('/login');
};
</script>

<template>
  <ul class="navbar-nav me-auto mb-2 mb-lg-0">
    <li class="nav-item">
      <router-link to="/" class="nav-link" active-class="active fw-bold text-primary">Головна</router-link>
    </li>
    <li class="nav-item">
      <router-link to="/about" class="nav-link" active-class="active fw-bold text-primary">Про автора</router-link>
    </li>
    <li class="nav-item">
      <router-link to="/users" class="nav-link" active-class="active fw-bold text-primary">Користувачі</router-link>
    </li>
  </ul>

  <div class="d-flex align-items-center gap-3">
    <template v-if="auth.isAuthenticated">
      <span class="text-secondary small">Привіт, <strong>{{ auth.user?.firstName }}</strong></span>
      <button class="btn btn-outline-danger btn-sm" @click="handleLogout">
        <i class="bi bi-box-arrow-right"></i> Вийти
      </button>
    </template>
    <template v-else>
      <router-link to="/login" class="btn btn-primary btn-sm">
        <i class="bi bi-box-arrow-in-right"></i> Увійти
      </router-link>
    </template>
  </div>
</template>