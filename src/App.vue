<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted } from 'vue';
import type { Participant, SortField, SortDirection } from '@/types/participant';
import WinnersBlock from '@/components/WinnersBlock.vue';
import RegistrationForm from '@/components/RegistrationForm.vue';
import ParticipantsTable from '@/components/ParticipantsTable.vue';
import SearchBar from '@/components/SearchBar.vue';
import Modal from '@/components/Modal.vue';
import BaseInput from '@/components/BaseInput.vue';
import BaseButton from '@/components/BaseButton.vue';

const STORAGE_PARTICIPANTS_KEY = 'vue_lottery_participants';
const STORAGE_WINNERS_KEY = 'vue_lottery_winners';

// Стан застосунку
const participants = ref<Participant[]>([]);
const winners = ref<Participant[]>([]);
const searchQuery = ref('');
const sortField = ref<SortField>('name');
const sortDirection = ref<SortDirection>('asc');

// Відновлення стану з localStorage
onMounted(() => {
  const savedParticipants = localStorage.getItem(STORAGE_PARTICIPANTS_KEY);
  if (savedParticipants) {
    try {
      participants.value = JSON.parse(savedParticipants);
    } catch {
      participants.value = [];
    }
  }

  const savedWinners = localStorage.getItem(STORAGE_WINNERS_KEY);
  if (savedWinners) {
    try {
      winners.value = JSON.parse(savedWinners);
    } catch {
      winners.value = [];
    }
  }
});

// Watcher з опцією deep для localStorage
watch(
  participants,
  (newVal) => {
    localStorage.setItem(STORAGE_PARTICIPANTS_KEY, JSON.stringify(newVal));
  },
  { deep: true }
);

watch(
  winners,
  (newVal) => {
    localStorage.setItem(STORAGE_WINNERS_KEY, JSON.stringify(newVal));
  },
  { deep: true }
);

// Додавання нового учасника
const handleAddParticipant = (newParticipantData: Omit<Participant, 'id'>) => {
  const newParticipant: Participant = {
    ...newParticipantData,
    id: Date.now().toString(),
  };
  participants.value.push(newParticipant);
};

// Вибір випадкового переможця
const canPickWinner = computed(() => {
  if (winners.value.length >= 3) return false;
  if (participants.value.length === 0) return false;
  const availableCandidates = participants.value.filter(
    (p) => !winners.value.some((w) => w.id === p.id)
  );
  return availableCandidates.length > 0;
});

const handlePickWinner = () => {
  if (!canPickWinner.value) return;
  const availableCandidates = participants.value.filter(
    (p) => !winners.value.some((w) => w.id === p.id)
  );
  const randomIndex = Math.floor(Math.random() * availableCandidates.length);
  const selectedWinner = availableCandidates[randomIndex];

  if (selectedWinner) {
    winners.value.push(selectedWinner);
  }
};

const handleRemoveWinner = (id: string) => {
  winners.value = winners.value.filter((w) => w.id !== id);
};

// Сортування та фільтрація
const handleSearch = (query: string) => {
  searchQuery.value = query;
};

const handleSortChange = (field: SortField) => {
  if (sortField.value === field) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortField.value = field;
    sortDirection.value = 'asc';
  }
};

const processedParticipants = computed(() => {
  const filtered = participants.value.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  );

  return filtered.slice().sort((a, b) => {
    let comparison = 0;
    if (sortField.value === 'name') {
      comparison = a.name.localeCompare(b.name, 'uk');
    } else {
      comparison = new Date(a.birthDate).getTime() - new Date(b.birthDate).getTime();
    }
    return sortDirection.value === 'asc' ? comparison : -comparison;
  });
});

const existingEmails = computed(() => participants.value.map((p) => p.email));

// --- Модальне вікно видалення ---
const isDeleteModalOpen = ref(false);
const participantToDelete = ref<Participant | null>(null);

const openDeleteModal = (participant: Participant) => {
  participantToDelete.value = participant;
  isDeleteModalOpen.value = true;
};

const closeDeleteModal = () => {
  participantToDelete.value = null;
  isDeleteModalOpen.value = false;
};

const confirmDelete = () => {
  if (participantToDelete.value) {
    const id = participantToDelete.value.id;
    participants.value = participants.value.filter((p) => p.id !== id);
    // Видаляємо також з переможців, якщо він там був
    winners.value = winners.value.filter((w) => w.id !== id);
  }
  closeDeleteModal();
};

// --- Модальне вікно редагування ---
const isEditModalOpen = ref(false);
const editFormData = reactive({
  id: '',
  name: '',
  email: '',
  phone: '',
  birthDate: '',
});
const editErrors = reactive({
  name: '',
  email: '',
  phone: '',
  birthDate: '',
});

const openEditModal = (participant: Participant) => {
  editFormData.id = participant.id;
  editFormData.name = participant.name;
  editFormData.email = participant.email;
  editFormData.phone = participant.phone;
  editFormData.birthDate = participant.birthDate;

  editErrors.name = '';
  editErrors.email = '';
  editErrors.phone = '';
  editErrors.birthDate = '';

  isEditModalOpen.value = true;
};

const closeEditModal = () => {
  isEditModalOpen.value = false;
};

const validateEdit = (): boolean => {
  let isValid = true;
  editErrors.name = '';
  editErrors.email = '';
  editErrors.phone = '';
  editErrors.birthDate = '';

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^\+380\d{9}$/;

  if (!editFormData.name.trim()) {
    editErrors.name = "Ім'я обов'язкове";
    isValid = false;
  }

  if (!editFormData.email.trim()) {
    editErrors.email = "E-mail обов'язковий";
    isValid = false;
  } else if (!emailRegex.test(editFormData.email)) {
    editErrors.email = 'Некоректний e-mail';
    isValid = false;
  } else {
    // Власний email дублікатом не вважається
    const isDuplicate = participants.value.some(
      (p) =>
        p.id !== editFormData.id &&
        p.email.toLowerCase() === editFormData.email.trim().toLowerCase()
    );
    if (isDuplicate) {
      editErrors.email = 'E-mail вже зайнятий іншим учасником';
      isValid = false;
    }
  }

  if (!editFormData.phone.trim()) {
    editErrors.phone = "Телефон обов'язковий";
    isValid = false;
  } else if (!phoneRegex.test(editFormData.phone)) {
    editErrors.phone = 'Формат: +380XXXXXXXXX';
    isValid = false;
  }

  if (!editFormData.birthDate) {
    editErrors.birthDate = "Дата народження обов'язкова";
    isValid = false;
  } else {
    const d = new Date(editFormData.birthDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (d > today) {
      editErrors.birthDate = 'Дата не може бути у майбутньому';
      isValid = false;
    }
  }

  return isValid;
};

const handleUpdateParticipant = () => {
  if (!validateEdit()) return;

  const index = participants.value.findIndex((p) => p.id === editFormData.id);
  if (index !== -1) {
    const updated: Participant = {
      id: editFormData.id,
      name: editFormData.name.trim(),
      email: editFormData.email.trim(),
      phone: editFormData.phone.trim(),
      birthDate: editFormData.birthDate,
    };
    participants.value[index] = updated;

    // Оновлюємо також дані у блоці переможців, якщо учасник переміг
    const winnerIndex = winners.value.findIndex((w) => w.id === updated.id);
    if (winnerIndex !== -1) {
      winners.value[winnerIndex] = { ...updated };
    }
  }
  closeEditModal();
};
</script>

<template>
  <div class="container py-4">
    <header class="text-center mb-5">
      <h1 class="display-5 fw-bold text-primary">Vue Lottery App</h1>
      <p class="lead text-secondary">Лабораторна робота №4</p>
    </header>

    <!-- 1. Блок переможців -->
    <WinnersBlock
      :winners="winners"
      :can-pick-winner="canPickWinner"
      @pick-winner="handlePickWinner"
      @remove-winner="handleRemoveWinner"
    />

    <!-- 2. Форма реєстрації -->
    <RegistrationForm
      :existing-emails="existingEmails"
      @add-participant="handleAddParticipant"
    />

    <!-- 3. Пошуковий рядок -->
    <SearchBar @filter-by-name="handleSearch" />

    <!-- 4. Таблиця учасників -->
    <ParticipantsTable
      :participants="processedParticipants"
      :sort-field="sortField"
      :sort-direction="sortDirection"
      @change-sort="handleSortChange"
      @edit="openEditModal"
      @delete="openDeleteModal"
    />

    <!-- Модальне вікно видалення -->
    <Modal
      :is-open="isDeleteModalOpen"
      title="Підтвердження видалення"
      @close="closeDeleteModal"
    >
      <template #body>
        <p v-if="participantToDelete" class="mb-0">
          Ви дійсно бажаєте видалити учасника
          <strong>{{ participantToDelete.name }}</strong>,
          <strong>{{ participantToDelete.email }}</strong>?
        </p>
      </template>
      <template #footer>
        <BaseButton variant="secondary" @click="closeDeleteModal">Ні</BaseButton>
        <BaseButton variant="danger" @click="confirmDelete">Так</BaseButton>
      </template>
    </Modal>

    <!-- Модальне вікно редагування -->
    <Modal
      :is-open="isEditModalOpen"
      title="Редагувати дані учасника"
      @close="closeEditModal"
    >
      <template #body>
        <form @submit.prevent="handleUpdateParticipant">
          <BaseInput
            id="edit-name"
            v-model="editFormData.name"
            label="Ім'я"
            :error-message="editErrors.name"
          />
          <BaseInput
            id="edit-email"
            v-model="editFormData.email"
            type="email"
            label="E-mail"
            :error-message="editErrors.email"
          />
          <BaseInput
            id="edit-phone"
            v-model="editFormData.phone"
            label="Телефон"
            :error-message="editErrors.phone"
          />
          <BaseInput
            id="edit-birthDate"
            v-model="editFormData.birthDate"
            type="date"
            label="Дата народження"
            :error-message="editErrors.birthDate"
          />
        </form>
      </template>
      <template #footer>
        <BaseButton variant="secondary" @click="closeEditModal">Скасувати</BaseButton>
        <BaseButton variant="primary" @click="handleUpdateParticipant">Оновити дані</BaseButton>
      </template>
    </Modal>
  </div>
</template>