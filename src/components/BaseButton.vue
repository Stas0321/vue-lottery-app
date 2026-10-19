<script setup lang="ts">
interface Props {
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning';
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

withDefaults(defineProps<Props>(), {
  variant: 'primary',
  disabled: false,
  type: 'button',
});

defineEmits<{
  (e: 'click', event: MouseEvent): void;
}>();
</script>

<template>
  <button
    :type="type"
    :disabled="disabled"
    :class="['btn', `btn-${variant}`]"
    @click="$emit('click',$event)"
  >
    <slot />
  </button>
</template>