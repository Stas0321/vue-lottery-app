<script setup lang="ts">
import AppHeader from '@/components/layout/AppHeader.vue';
</script>

<template>
  <div class="d-flex flex-column min-vh-100">
    <AppHeader />
    <main class="flex-grow-1 container py-4">
      <slot />
    </main>
    <footer class="bg-white border-top text-center py-3 text-muted small">
      © 2026 Vue Lottery App. Лабораторна робота №5
    </footer>
  </div>
</template>