<script setup lang="ts">
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useForm, useField } from 'vee-validate';
import * as yup from 'yup';
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const route = useRoute();
const auth = useAuthStore();
const serverError = ref<string | null>(null);

const schema = yup.object({
  username: yup.string().required("Ім'я користувача обов'язкове"),
  password: yup.string().required('Пароль обов’язковий').min(6, 'Мінімум 6 символів'),
});

const { handleSubmit, isSubmitting } = useForm({
  validationSchema: schema,
  initialValues: { username: 'emilys', password: 'emilyspass' },
});

const { value: username, errorMessage: usernameError } = useField<string>('username');
const { value: password, errorMessage: passwordError } = useField<string>('password');

const onSubmit = handleSubmit(async (values) => {
  serverError.value = null;
  try {
    await auth.login(values.username, values.password);
    const redirectPath = (route.query.redirect as string) || '/users';
    router.push(redirectPath);
  } catch (e) {
    serverError.value = (e as Error).message || 'Невірний логін або пароль';
  }
});
</script>

<template>
  <div class="card shadow border-0 p-4">
    <div class="text-center mb-4">
      <i class="bi bi-shield-lock-fill text-primary display-4"></i>
      <h3 class="fw-bold mt-2">Вхід у систему</h3>
      <p class="text-muted small">Тестовий аккаунт: emilys / emilyspass</p>
    </div>

    <div v-if="serverError" class="alert alert-danger py-2 small">
      {{ serverError }}
    </div>

    <form @submit.prevent="onSubmit">
      <div class="mb-3">
        <label class="form-label fw-bold">Логін (Username)</label>
        <input
          v-model="username"
          type="text"
          class="form-control"
          :class="{ 'is-invalid': usernameError }"
        />
        <div class="invalid-feedback">{{ usernameError }}</div>
      </div>

      <div class="mb-4">
        <label class="form-label fw-bold">Пароль</label>
        <input
          v-model="password"
          type="password"
          class="form-control"
          :class="{ 'is-invalid': passwordError }"
        />
        <div class="invalid-feedback">{{ passwordError }}</div>
      </div>

      <button type="submit" class="btn btn-primary w-100 py-2 fw-bold" :disabled="isSubmitting">
        <span v-if="isSubmitting" class="spinner-border spinner-border-sm me-1"></span>
        Увійти
      </button>
    </form>
  </div>
</template>