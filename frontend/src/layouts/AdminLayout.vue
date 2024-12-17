<template>
  <el-container class="h-screen">
    <el-main class="bg-gray-50">
      <router-view></router-view>
    </el-main>
  </el-container>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const handleLogout = () => {
  // 清除所有登录信息
  localStorage.removeItem('token')
  localStorage.removeItem('userRole')
  localStorage.removeItem('isLoggedIn')
  localStorage.removeItem('userId')
  // 跳转到登录页面
  router.push('/login')
}
</script>

<style scoped>
.el-main {
  @apply p-6;
}
</style> 