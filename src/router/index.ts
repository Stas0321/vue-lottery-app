import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/HomeView.vue'),
    meta: { title: 'Головна', layout: 'default' },
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('@/views/AboutView.vue'),
    meta: { title: 'Про автора', layout: 'default' },
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/LoginView.vue'),
    meta: { title: 'Вхід у систему', layout: 'auth' },
  },
  {
    path: '/users',
    meta: { requiresAuth: true, title: 'Користувачі', layout: 'default' },
    children: [
      {
        path: '',
        name: 'users',
        component: () => import('@/views/UsersView.vue'),
        meta: { title: 'Список користувачів', requiresAuth: true },
      },
      {
        path: ':id',
        name: 'user-detail',
        component: () => import('@/views/UserDetailView.vue'),
        props: true,
        meta: { title: 'Профіль користувача', requiresAuth: true },
        children: [
          {
            path: 'edit',
            name: 'user-edit',
            component: () => import('@/views/UserEditView.vue'),
            props: true,
            meta: { title: 'Редагування користувача', requiresAuth: true },
          },
        ],
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/views/NotFoundView.vue'),
    meta: { title: '404 Не знайдено', layout: 'default' },
  },
];

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

// Навігаційні охоронці (Navigation Guards)
router.beforeEach((to, from, next) => {
  const auth = useAuthStore();

  if (to.matched.some((record) => record.meta.requiresAuth) && !auth.isAuthenticated) {
    next({ name: 'login', query: { redirect: to.fullPath } });
  } else if (to.name === 'login' && auth.isAuthenticated) {
    next({ name: 'users' });
  } else {
    next();
  }
});

// Зміна заголовка вкладки
router.afterEach((to) => {
  document.title = `${to.meta.title || 'App'} | Vue Lottery`;
});