<script setup lang="ts">
import Logo from './Logo.vue';
import AppNavigation from './AppNavigation.vue';
</script>

<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-white border-bottom shadow-sm py-3">
    <div class="container">
      <Logo />
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navContent"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div id="navContent" class="collapse navbar-collapse">
        <AppNavigation />
      </div>
    </div>
  </nav>
</template>