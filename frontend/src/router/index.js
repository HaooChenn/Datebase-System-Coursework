import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/views/LoginView.vue'
import { ElMessage } from 'element-plus'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/nurse',
      component: () => import('@/layouts/NurseLayout.vue'),
      meta: { requiresAuth: true, role: 'nurse' },
      children: [
        {
          path: 'patient-list',
          name: 'nurse-patient-list',
          component: () => import('@/views/nurse/PatientList.vue')
        }
      ]
    },
    {
      path: '/caregiver',
      component: () => import('@/layouts/CaregiverLayout.vue'),
      meta: { requiresAuth: true, role: 'caregiver' },
      children: [
        {
          path: '',
          redirect: '/caregiver/client-list'
        },
        {
          path: 'client-list',
          name: 'caregiver-client-list',
          component: () => import('@/views/caregiver/ClientList.vue')
        }
      ]
    },
    {
      path: '/admin',
      component: () => import('@/layouts/AdminLayout.vue'),
      meta: { requiresAuth: true, role: 'admin' },
      children: [
        {
          path: 'dashboard',
          name: 'admin-dashboard',
          component: () => import('@/views/admin/Dashboard.vue')
        }
      ]
    }
  ]
})

// Navigation guard
router.beforeEach((to, from, next) => {
  // Allow access to login page
  if (to.path === '/login') {
    if (localStorage.getItem('isLoggedIn') === 'true') {
      const userRole = localStorage.getItem('userRole')
      const routes = {
        nurse: '/nurse/patient-list',
        caregiver: '/caregiver/client-list',
        admin: '/admin/dashboard'
      }
      next(routes[userRole] || '/login')
    } else {
      next()
    }
    return
  }

  // Check authentication for protected routes
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true'
  const userRole = localStorage.getItem('userRole')
  const token = localStorage.getItem('token')

  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!isLoggedIn || !token) {
      ElMessage.warning('Please login first')
      next('/login')
      return
    }

    // Check role
    if (to.matched.some(record => record.meta.role && record.meta.role !== userRole)) {
      ElMessage.error('Access denied')
      next('/login')
      return
    }
  }

  next()
})

export default router 