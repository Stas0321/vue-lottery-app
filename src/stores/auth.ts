import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { ServiceProvider } from '@/services/service-provider';
import type { User } from '@/types/user';

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(localStorage.getItem('accessToken'));
  const user = ref<User | null>(
    localStorage.getItem('authUser') ? JSON.parse(localStorage.getItem('authUser')!) : null
  );

  const isAuthenticated = computed(() => !!token.value);

  const login = async (username: string, password: string) => {
    const res = await ServiceProvider.auth.login({ username, password });
    token.value = res.accessToken;
    localStorage.setItem('accessToken', res.accessToken);
    localStorage.setItem('refreshToken', res.refreshToken);

    const currentUser: User = {
      id: res.id,
      username: res.username,
      email: res.email,
      firstName: res.firstName,
      lastName: res.lastName,
      gender: res.gender as 'male' | 'female',
      age: 0,
      phone: '',
      image: res.image,
    };
    user.value = currentUser;
    localStorage.setItem('authUser', JSON.stringify(currentUser));
  };

  const logout = () => {
    token.value = null;
    user.value = null;
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('authUser');
  };

  return { token, user, isAuthenticated, login, logout };
});