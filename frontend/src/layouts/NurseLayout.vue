<template>
  <div class="nurse-layout">
    <el-container>
      <el-header class="bg-white border-b">
        <div class="flex justify-between items-center h-full">
          <h1 class="text-xl font-bold">Nurse Station</h1>
          <el-button type="danger" plain @click="handleLogout">
            <el-icon class="mr-1"><SwitchButton /></el-icon>
            Logout
          </el-button>
        </div>
      </el-header>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { SwitchButton } from '@element-plus/icons-vue'

const router = useRouter()

const handleLogout = () => {
  // 清除所有相关的本地存储
  localStorage.removeItem('token')
  localStorage.removeItem('userRole')
  localStorage.removeItem('isLoggedIn')
  
  // 显示退出成功消息
  ElMessage.success('Logged out successfully')
  
  // 重定向到登录页面
  router.push('/login')
}
</script>

<style scoped>
.nurse-layout {
  min-height: 100vh;
}

.el-header {
  @apply px-6;
  height: 60px;
  line-height: 60px;
}

.el-main {
  @apply bg-gray-50;
  min-height: calc(100vh - 60px);
}
</style> 