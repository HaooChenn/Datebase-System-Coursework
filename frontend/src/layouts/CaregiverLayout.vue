<template>
  <el-container class="h-screen">
    <el-container>
      <el-header class="bg-white shadow-sm">
        <div class="flex justify-between items-center h-full">
          <div class="text-lg font-medium">{{ pageTitle }}</div>
          <div class="flex items-center">
            <el-dropdown>
              <span class="flex items-center cursor-pointer">
                <el-avatar size="small" class="mr-2">C</el-avatar>
                {{ caregiverInfo.name }}
                <el-icon class="ml-1"><ArrowDown /></el-icon>
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item @click="handleLogout">Logout</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </div>
      </el-header>

      <el-main class="bg-gray-50">
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowDown } from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()

const caregiverInfo = {
  name: 'Caregiver',
  id: 'C001'
}

const pageTitle = computed(() => {
  const titles = {
    '/caregiver/dashboard': 'Dashboard',
    '/caregiver/client-list': 'My Patients',
    '/caregiver/records': 'Care Records'
  }
  return titles[route.path] || ''
})

const handleLogout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('userRole')
  localStorage.removeItem('isLoggedIn')
  router.push('/login')
}
</script>

<style scoped>
.el-header {
  @apply h-16 leading-[4rem] px-4;
}

.el-main {
  @apply p-6;
}
</style> 