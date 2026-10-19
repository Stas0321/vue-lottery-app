<script setup lang="ts">
interface Props {
  modelValue: string;
  label: string;
  id: string;
  type?: string;
  errorMessage?: string;
  placeholder?: string;
}

withDefaults(defineProps<Props>(), {
  type: 'text',
  errorMessage: '',
  placeholder: '',
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  emit('update:modelValue', target.value);
};
</script>

<template>
  <div class="mb-3 text-start">
    <label :for="id" class="form-label fw-bold">{{ label }}</label>
    <input
      :id="id"
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      class="form-control"
      :class="{ 'is-invalid': errorMessage }"
      @input="handleInput"
    />
    <div v-if="errorMessage" class="invalid-feedback d-block">
      {{ errorMessage }}
    </div>
  </div>
</template>