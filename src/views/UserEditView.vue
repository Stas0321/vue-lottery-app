<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useForm, useField } from 'vee-validate';
import * as yup from 'yup';
import { ServiceProvider } from '@/services/service-provider';
import { useUsersStore } from '@/stores/users';

const props = defineProps<{ id: string }>();
const router = useRouter();
const usersStore = useUsersStore();
const isSubmittingLocal = ref(false);

const schema = yup.object({
  firstName: yup.string().required("Ім'я обов'язкове"),
  lastName: yup.string().required("Прізвище обов'язкове"),
  email: yup.string().required('Email обов’язковий').email('Невалідний email'),
  phone: yup.string().required('Телефон обов’язковий'),
});

const { handleSubmit, setValues } = useForm({ validationSchema: schema });
const { value: firstName, errorMessage: firstNameErr } = useField<string>('firstName');
const { value: lastName, errorMessage: lastNameErr } = useField<string>('lastName');
const { value: email, errorMessage: emailErr } = useField<string>('email');
const { value: phone, errorMessage: phoneErr } = useField<string>('phone');

onMounted(async () => {
  const data = await ServiceProvider.users.getById(Number(props.id));
  setValues({
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email,
    phone: data.phone,
  });
});

const onSubmit = handleSubmit(async (values) => {
  isSubmittingLocal.value = true;
  try {
    await usersStore.updateUser(Number(props.id), values);
    alert('Дані користувача оновлено!');
    router.push(`/users/${props.id}`);
  } finally {
    isSubmittingLocal.value = false;
  }
});
</script>

<template>
  <div class="card p-3 border-warning bg-light">
    <h5 class="text-warning-emphasis mb-3">Вкладене редагування даних</h5>
    <form @submit.prevent="onSubmit">
      <div class="row g-2">
        <div class="col-md-6">
          <label class="form-label">Ім'я</label>
          <input v-model="firstName" class="form-control" :class="{ 'is-invalid': firstNameErr }" />
          <div class="invalid-feedback">{{ firstNameErr }}</div>
        </div>
        <div class="col-md-6">
          <label class="form-label">Прізвище</label>
          <input v-model="lastName" class="form-control" :class="{ 'is-invalid': lastNameErr }" />
          <div class="invalid-feedback">{{ lastNameErr }}</div>
        </div>
        <div class="col-md-6">
          <label class="form-label">Email</label>
          <input v-model="email" class="form-control" :class="{ 'is-invalid': emailErr }" />
          <div class="invalid-feedback">{{ emailErr }}</div>
        </div>
        <div class="col-md-6">
          <label class="form-label">Телефон</label>
          <input v-model="phone" class="form-control" :class="{ 'is-invalid': phoneErr }" />
          <div class="invalid-feedback">{{ phoneErr }}</div>
        </div>
      </div>
      <div class="mt-3 text-end">
        <router-link :to="`/users/${id}`" class="btn btn-secondary me-2">Скасувати</router-link>
        <button type="submit" class="btn btn-primary" :disabled="isSubmittingLocal">
          Оновити дані
        </button>
      </div>
    </form>
  </div>
</template>