import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import LoginView from '@/views/LoginView.vue'
import RegisterView from '@/views/RegisterView.vue'
import ForgotPasswordView from '@/views/ForgotPasswordView.vue'
import ResetPasswordView from '@/views/ResetPasswordView.vue'
import MyBookingsView from '@/views/MyBookingsView.vue'
import NewBookingView from '@/views/NewBookingView.vue'
import PastBookingsView from '@/views/PastBookingsView.vue'
import EditBookingView from '@/views/EditBookingView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView,
    },
    {
      path: '/forgot-password',
      name: 'forgot-password',
      component: ForgotPasswordView,
    },
    {
      path: '/reset-password/:token',
      name: 'reset-password',
      component: ResetPasswordView,
    },
    {
      path: '/bookings',
      name: 'my-bookings',
      component: MyBookingsView,
    },
    {
      path: '/bookings/new',
      name: 'new-booking',
      component: NewBookingView,
    },
    {
      path: '/bookings/past',
      name: 'past-bookings',
      component: PastBookingsView,
    },
    {
      path: '/bookings/edit/:id',
      name: 'edit-booking',
      component: EditBookingView,
    },
  ],
})

export default router