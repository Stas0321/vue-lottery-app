<script setup lang="ts">
import { ref, watch, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useUsersStore } from '@/stores/users';
import type { CreateUserDto } from '@/types/user';
import { useForm, useField } from 'vee-validate';
import * as yup from 'yup';

const route = useRoute();
const router = useRouter();
const usersStore = useUsersStore();

const limit = 10;
const page = computed(() => Number(route.query.page) || 1);
const search = computed(() => (route.query.q as string) || '');

const searchInput = ref(search.value);
let searchDebounce: ReturnType<typeof setTimeout>;

const loadData = () => {
  const skip = (page.value - 1) * limit;
  usersStore.fetchUsers(limit, skip, search.value);
};

onMounted(loadData);
watch([page, search], loadData);

// Пошук із збереженням у query
const onSearchInput = () => {
  clearTimeout(searchDebounce);
  searchDebounce = setTimeout(() => {
    router.push({ query: { ...route.query, q: searchInput.value || undefined, page: 1 } });
  }, 300);
};

const totalPages = computed(() => Math.ceil(usersStore.total / limit));

const goToPage = (p: number) => {
  router.push({ query: { ...route.query, page: p } });
};

// Форма додавання нового користувача
const isCreateOpen = ref(false);
const schema = yup.object({
  firstName: yup.string().required("Ім'я обов'язкове"),
  lastName: yup.string().required("Прізвище обов'язкове"),
  email: yup.string().required('Email обов’язковий').email('Невалідний email'),
  username: yup.string().required('Username обов’язковий'),
  phone: yup.string().required('Телефон обов’язковий'),
  age: yup.number().required('Вік обов’язковий').positive().integer(),
  gender: yup.string().required('Оберіть стать'),
});

const { handleSubmit, resetForm } = useForm({ validationSchema: schema });
const { value: firstName, errorMessage: firstNameErr } = useField<string>('firstName');
const { value: lastName, errorMessage: lastNameErr } = useField<string>('lastName');
const { value: email, errorMessage: emailErr } = useField<string>('email');
const { value: username, errorMessage: usernameErr } = useField<string>('username');
const { value: phone, errorMessage: phoneErr } = useField<string>('phone');
const { value: age, errorMessage: ageErr } = useField<number>('age');
const { value: gender, errorMessage: genderErr } = useField<string>('gender');

const onCreateSubmit = handleSubmit(async (values) => {
  await usersStore.addUser(values as CreateUserDto);
  resetForm();
  isCreateOpen.value = false;
});

const deleteUser = async (id: number) => {
  if (confirm('Видалити користувача?')) {
    await usersStore.removeUser(id);
  }
};
</script>

<template>
  <div>
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2 class="mb-0">Керування користувачами</h2>
      <button class="btn btn-success" @click="isCreateOpen = !isCreateOpen">
        <i class="bi bi-person-plus-fill me-1"></i> Додати користувача
      </button>
    </div>

    <!-- Форма створення -->
    <div v-if="isCreateOpen" class="card p-3 mb-4 shadow-sm bg-light">
      <h5 class="mb-3">Новий користувач</h5>
      <form @submit.prevent="onCreateSubmit">
        <div class="row g-2">
          <div class="col-md-4">
            <input v-model="firstName" placeholder="Ім'я" class="form-control" :class="{ 'is-invalid': firstNameErr }" />
            <div class="invalid-feedback">{{ firstNameErr }}</div>
          </div>
          <div class="col-md-4">
            <input v-model="lastName" placeholder="Прізвище" class="form-control" :class="{ 'is-invalid': lastNameErr }" />
            <div class="invalid-feedback">{{ lastNameErr }}</div>
          </div>
          <div class="col-md-4">
            <input v-model="email" placeholder="Email" class="form-control" :class="{ 'is-invalid': emailErr }" />
            <div class="invalid-feedback">{{ emailErr }}</div>
          </div>
          <div class="col-md-3">
            <input v-model="username" placeholder="Username" class="form-control" :class="{ 'is-invalid': usernameErr }" />
            <div class="invalid-feedback">{{ usernameErr }}</div>
          </div>
          <div class="col-md-3">
            <input v-model="phone" placeholder="Телефон" class="form-control" :class="{ 'is-invalid': phoneErr }" />
            <div class="invalid-feedback">{{ phoneErr }}</div>
          </div>
          <div class="col-md-3">
            <input v-model="age" type="number" placeholder="Вік" class="form-control" :class="{ 'is-invalid': ageErr }" />
            <div class="invalid-feedback">{{ ageErr }}</div>
          </div>
          <div class="col-md-3">
            <select v-model="gender" class="form-select" :class="{ 'is-invalid': genderErr }">
              <option disabled value="">Оберіть стать</option>
              <option value="male">Чоловіча</option>
              <option value="female">Жіноча</option>
            </select>
            <div class="invalid-feedback">{{ genderErr }}</div>
          </div>
        </div>
        <div class="mt-3 text-end">
          <button type="button" class="btn btn-secondary me-2" @click="isCreateOpen = false">Скасувати</button>
          <button type="submit" class="btn btn-primary">Зберегти</button>
        </div>
      </form>
    </div>

    <!-- Пошук -->
    <div class="mb-3">
      <div class="input-group">
        <span class="input-group-text"><i class="bi bi-search"></i></span>
        <input
          v-model="searchInput"
          class="form-control"
          placeholder="Пошук користувачів (фільтрація через API та query URL)..."
          @input="onSearchInput"
        />
      </div>
    </div>

    <div v-if="usersStore.isLoading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status"></div>
    </div>

    <div v-else-if="usersStore.error" class="alert alert-danger">
      {{ usersStore.error }}
    </div>

    <div v-else class="card shadow-sm border-0">
      <div class="table-responsive">
        <table class="table table-hover align-middle mb-0">
          <thead class="table-light">
            <tr>
              <th>ID</th>
              <th>Ім'я</th>
              <th>Email</th>
              <th>Телефон</th>
              <th>Стать / Вік</th>
              <th class="text-end">Дії</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in usersStore.users" :key="user.id">
              <td>{{ user.id }}</td>
              <td>
                <router-link :to="`/users/${user.id}`" class="fw-bold text-decoration-none">
                  {{ user.firstName }} {{ user.lastName }}
                </router-link>
              </td>
              <td>{{ user.email }}</td>
              <td>{{ user.phone }}</td>
              <td>{{ user.gender }} / {{ user.age }}</td>
              <td class="text-end">
                <router-link :to="`/users/${user.id}/edit`" class="btn btn-sm btn-outline-warning me-1">
                  <i class="bi bi-pencil"></i>
                </router-link>
                <button class="btn btn-sm btn-outline-danger" @click="deleteUser(user.id)">
                  <i class="bi bi-trash"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Пагінація -->
      <div class="card-footer bg-white d-flex justify-content-between align-items-center">
        <span>Всього знайдено: {{ usersStore.total }}</span>
        <div class="btn-group">
          <button class="btn btn-outline-secondary btn-sm" :disabled="page <= 1" @click="goToPage(page - 1)">
            Попередня
          </button>
          <button
            v-for="p in totalPages"
            :key="p"
            class="btn btn-sm"
            :class="p === page ? 'btn-primary' : 'btn-outline-secondary'"
            @click="goToPage(p)"
          >
            {{ p }}
          </button>
          <button class="btn btn-outline-secondary btn-sm" :disabled="page >= totalPages" @click="goToPage(page + 1)">
            Наступна
          </button>
        </div>
      </div>
    </div>
  </div>
</template>