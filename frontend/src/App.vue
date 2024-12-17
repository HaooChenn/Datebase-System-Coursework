<template>
  <div class="app-container">
    <router-view v-slot="{ Component }">
      <component :is="Component" />
    </router-view>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

onMounted(() => {
  // Check if user is logged in
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true'
  const userRole = localStorage.getItem('userRole')

  if (isLoggedIn && userRole) {
    // Redirect to appropriate dashboard
    const routes = {
      nurse: '/nurse/patient-list',
      caregiver: '/caregiver/client-list',
      admin: '/admin/dashboard'
    }
    router.push(routes[userRole] || '/login')
  } else {
    // Redirect to login page
    router.push('/login')
  }
})
</script>

<style>
.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.loading-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #f5f7fa;
}

.loading-icon {
  font-size: 48px;
  color: #409EFF;
  animation: rotate 1s linear infinite;
}

.loading-text {
  margin-top: 16px;
  font-size: 16px;
  color: #909399;
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
