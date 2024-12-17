<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg transform transition-all hover:shadow-2xl">
      <div>
        <h2 class="mt-2 text-center text-3xl font-extrabold text-gray-900">
          Welcome Back
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Sign in to your account
        </p>
      </div>
      <div class="mt-8 space-y-6">
        <!-- Role Selection -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Select Role</label>
          <el-select 
            v-model="loginForm.role" 
            placeholder="Choose your role"
            class="w-full !h-12 text-lg"
            size="large"
          >
            <el-option 
              label="Nurse" 
              value="nurse"
              class="flex items-center text-gray-700"
            >
              <template #default>
                <div class="flex items-center py-2">
                  <el-icon class="mr-2 text-blue-500"><FirstAidKit /></el-icon>
                  <span>Nurse</span>
                </div>
              </template>
            </el-option>
            <el-option 
              label="Caregiver" 
              value="caregiver"
              class="flex items-center text-gray-700"
            >
              <template #default>
                <div class="flex items-center py-2">
                  <el-icon class="mr-2 text-green-500"><User /></el-icon>
                  <span>Caregiver</span>
                </div>
              </template>
            </el-option>
            <el-option 
              label="Administrator" 
              value="admin"
              class="flex items-center text-gray-700"
            >
              <template #default>
                <div class="flex items-center py-2">
                  <el-icon class="mr-2 text-purple-500"><Setting /></el-icon>
                  <span>Administrator</span>
                </div>
              </template>
            </el-option>
          </el-select>
        </div>

        <!-- Username and Password -->
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Username</label>
            <el-input
              v-model="loginForm.username"
              placeholder="Enter your username"
              :prefix-icon="User"
              size="large"
              class="!h-12"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <el-input
              v-model="loginForm.password"
              type="password"
              placeholder="Enter your password"
              :prefix-icon="Lock"
              show-password
              size="large"
              class="!h-12"
            />
          </div>
        </div>

        <!-- Additional Options -->
        <div class="flex items-center justify-between text-sm">
          <el-checkbox v-model="rememberMe">Remember me</el-checkbox>
          <div class="space-x-4">
            <a @click="showAdminMessage" class="text-indigo-600 hover:text-indigo-500 cursor-pointer transition-colors">
              Forgot password?
            </a>
            <a @click="showAdminMessage" class="text-indigo-600 hover:text-indigo-500 cursor-pointer transition-colors">
              Register
            </a>
          </div>
        </div>

        <!-- Login Button -->
        <div>
          <el-button 
            type="primary" 
            class="w-full !h-12 !text-lg !rounded-lg hover:opacity-90"
            :loading="loading"
            @click="handleLogin"
          >
            Sign In
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { User, Lock, Setting, FirstAidKit } from '@element-plus/icons-vue'
import api from '@/api'

const router = useRouter()
const loading = ref(false)
const rememberMe = ref(false)

const loginForm = ref({
  username: '',
  password: '',
  role: ''
})

const handleLogin = async () => {
  if (!loginForm.value.username || !loginForm.value.password || !loginForm.value.role) {
    ElMessage.warning('Please fill in all login information')
    return
  }

  loading.value = true
  try {
    console.log('Attempting login with:', {
      username: loginForm.value.username,
      password: loginForm.value.password
    })

    const response = await api.post('/auth/login', {
      username: loginForm.value.username,
      password: loginForm.value.password
    })

    console.log('Login response:', response)

    if (response.token) {
      if (response.role !== loginForm.value.role) {
        // 如果角色不匹配，提示用户选择正确的角色
        ElMessage.warning(`Please select the correct role: ${response.role}`)
        loginForm.value.role = response.role
        loading.value = false
        return
      }

      // Store auth info
      localStorage.setItem('token', response.token)
      localStorage.setItem('userRole', response.role)
      localStorage.setItem('isLoggedIn', 'true')
      localStorage.setItem('userId', response.userId)

      const routes = {
        nurse: '/nurse/patient-list',
        caregiver: '/caregiver/client-list',
        admin: '/admin/dashboard'
      }

      ElMessage.success('Login successful')
      await router.push(routes[response.role])
    }
  } catch (error) {
    console.error('Login error:', error)
    if (error.code === 'ECONNABORTED') {
      ElMessage.error('连接超时，请检查网络或联系管理员')
    } else if (error.response) {
      ElMessage.error(`登录失败: ${error.response.data?.error || '未知错��'}`)
    } else if (error.request) {
      ElMessage.error('无法连接到服务器，请检查网络连接')
    } else {
      ElMessage.error(`登录失败: ${error.message || '未知错误'}`)
    }
  } finally {
    loading.value = false
  }
}

const showAdminMessage = () => {
  ElMessage.info('Please contact administrator')
}
</script>

<style scoped>
.el-input {
  @apply w-full;
}

:deep(.el-input__wrapper) {
  @apply !rounded-lg !shadow-none border border-gray-300;
}

:deep(.el-select__wrapper) {
  @apply !rounded-lg;
}

:deep(.el-select .el-input__wrapper) {
  @apply !shadow-none border border-gray-300;
}

:deep(.el-select-dropdown__item) {
  @apply !h-10;
}

:deep(.el-button) {
  @apply transition-all duration-300;
}

:deep(.el-button:hover) {
  @apply transform scale-[1.02] shadow-md;
}

/* Improve dropdown menu styles */
:deep(.el-select-dropdown__item.selected) {
  @apply !bg-indigo-50 !text-indigo-600;
}

:deep(.el-select-dropdown__item:hover) {
  @apply !bg-gray-50;
}
</style> 