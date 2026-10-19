<script setup lang="ts">
import { reactive } from 'vue';
import type { Participant } from '@/types/participant';
import BaseInput from './BaseInput.vue';
import BaseButton from './BaseButton.vue';

const props = defineProps<{
  existingEmails: string[];
}>();

const emit = defineEmits<{
  (e: 'add-participant', participant: Omit<Participant, 'id'>): void;
}>();

const formData = reactive({
  name: '',
  email: '',
  phone: '',
  birthDate: '',
});

const errors = reactive({
  name: '',
  email: '',
  phone: '',
  birthDate: '',
});

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^\+380\d{9}$/;

const validate = (): boolean => {
  let isValid = true;
  errors.name = '';
  errors.email = '';
  errors.phone = '';
  errors.birthDate = '';

  if (!formData.name.trim()) {
    errors.name = "Ім'я є обов'язковим";
    isValid = false;
  }

  if (!formData.email.trim()) {
    errors.email = "E-mail є обов'язковим";
    isValid = false;
  } else if (!emailRegex.test(formData.email)) {
    errors.email = 'Некоректний формат e-mail';
    isValid = false;
  } else if (
    props.existingEmails.some(
      (e) => e.toLowerCase() === formData.email.trim().toLowerCase()
    )
  ) {
    errors.email = 'Учасник з таким e-mail вже зареєстрований';
    isValid = false;
  }

  if (!formData.phone.trim()) {
    errors.phone = "Телефон є обов'язковим";
    isValid = false;
  } else if (!phoneRegex.test(formData.phone)) {
    errors.phone = 'Телефон має бути у форматі +380XXXXXXXXX';
    isValid = false;
  }

  if (!formData.birthDate) {
    errors.birthDate = "Дата народження є обов'язковою";
    isValid = false;
  } else {
    const selectedDate = new Date(formData.birthDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selectedDate > today) {
      errors.birthDate = 'Дата народження не повинна бути у майбутньому';
      isValid = false;
    }
  }

  return isValid;
};

const resetForm = () => {
  formData.name = '';
  formData.email = '';
  formData.phone = '';
  formData.birthDate = '';
  // Очищення форми без тригеру валідації
  errors.name = '';
  errors.email = '';
  errors.phone = '';
  errors.birthDate = '';
};

const handleSubmit = () => {
  if (!validate()) return;

  emit('add-participant', {
    name: formData.name.trim(),
    email: formData.email.trim(),
    phone: formData.phone.trim(),
    birthDate: formData.birthDate,
  });

  resetForm();
};
</script>

<template>
  <div class="card mb-4 shadow-sm">
    <div class="card-header bg-white py-3">
      <h4 class="mb-0">Реєстрація нового учасника</h4>
    </div>
    <div class="card-body">
      <form @submit.prevent="handleSubmit" @keydown.enter.prevent="handleSubmit">
        <div class="row">
          <div class="col-md-6">
            <BaseInput
              id="name"
              v-model="formData.name"
              label="Ім'я"
              placeholder="Тарас Шевченко"
              :error-message="errors.name"
            />
          </div>
          <div class="col-md-6">
            <BaseInput
              id="email"
              v-model="formData.email"
              type="email"
              label="E-mail"
              placeholder="example@mail.com"
              :error-message="errors.email"
            />
          </div>
        </div>

        <div class="row">
          <div class="col-md-6">
            <BaseInput
              id="phone"
              v-model="formData.phone"
              label="Номер телефону"
              placeholder="+380991234567"
              :error-message="errors.phone"
            />
          </div>
          <div class="col-md-6">
            <BaseInput
              id="birthDate"
              v-model="formData.birthDate"
              type="date"
              label="Дата народження"
              :error-message="errors.birthDate"
            />
          </div>
        </div>

        <div class="text-end mt-2">
          <BaseButton type="submit" variant="primary">
            <i class="bi bi-save me-1"></i> Save
          </BaseButton>
        </div>
      </form>
    </div>
  </div>
</template>