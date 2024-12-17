<template>
  <div class="nurse-dashboard">
    <!-- 添加顶部条带 -->
    <div class="top-bar mb-6">
      <div class="flex justify-between items-center h-full px-6">
        <h1 class="text-xl font-semibold text-gray-800">Nurse Dashboard</h1>
        <el-button 
          type="danger" 
          plain 
          class="logout-btn"
          @click="handleLogout"
        >
          <el-icon class="mr-1"><SwitchButton /></el-icon>
          Logout
        </el-button>
      </div>
    </div>

    <!-- 统计卡片 -->
    <div class="stats-container grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <el-card class="stat-card">
        <div class="flex items-center justify-between">
          <div>
            <div class="text-gray-500">Pending Patients</div>
            <div class="text-2xl font-bold mt-2">{{ stats.pendingPatients }}</div>
          </div>
          <el-icon class="text-3xl text-blue-500"><User /></el-icon>
        </div>
      </el-card>
      
      <el-card class="stat-card">
        <div class="flex items-center justify-between">
          <div>
            <div class="text-gray-500">Completed</div>
            <div class="text-2xl font-bold mt-2">{{ stats.completedPatients }}</div>
          </div>
          <el-icon class="text-3xl text-green-500"><Check /></el-icon>
        </div>
      </el-card>
      
      <el-card class="stat-card">
        <div class="flex items-center justify-between">
          <div>
            <div class="text-gray-500">Total Patients</div>
            <div class="text-2xl font-bold mt-2">{{ stats.totalPatients }}</div>
          </div>
          <el-icon class="text-3xl text-purple-500"><List /></el-icon>
        </div>
      </el-card>
    </div>

    <!-- 搜索和筛选 -->
    <div class="flex justify-between items-center mb-6">
      <el-input
        v-model="searchQuery"
        placeholder="Search by name or room..."
        class="w-64"
        :prefix-icon="Search"
      />
      <el-select v-model="statusFilter" placeholder="Status" class="w-32">
        <el-option label="All" value="" />
        <el-option label="Pending" value="pending" />
        <el-option label="Completed" value="completed" />
      </el-select>
    </div>

    <!-- 病人列表 - 改造成详细信息卡片 -->
    <div v-loading="loading" class="patient-list space-y-6">
      <div
        v-for="patient in filteredPatients"
        :key="patient.id"
        class="patient-card"
      >
        <el-card class="box-card hover:shadow-lg transition-shadow duration-300">
          <!-- 基本信息部分 -->
          <div class="card-header mb-6">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-4">
                <div class="text-4xl font-bold text-indigo-600 bg-indigo-50 p-4 rounded-lg">
                  {{ patient.room }}
                </div>
                <div>
                  <div class="text-2xl font-medium text-gray-800">{{ patient.name }}</div>
                  <div class="text-sm text-gray-500 mt-1">ID: {{ patient.id }}</div>
                </div>
              </div>
              <el-tag 
                :type="patient.completed ? 'success' : 'warning'"
                class="rounded-full px-4 py-2 text-base"
                @click.stop="toggleCompleted(patient)"
              >
                {{ patient.completed ? 'Completed' : 'Pending' }}
              </el-tag>
            </div>
          </div>

          <!-- 详细信息部分 -->
          <el-collapse 
            v-model="patient.activeNames"
            @change="() => handleCollapseChange(patient)"
          >
            <!-- 基本信息面板 -->
            <el-collapse-item name="1">
              <template #title>
                <div class="flex items-center gap-3 text-indigo-600">
                  <el-icon class="text-xl"><UserFilled /></el-icon>
                  <span class="text-lg font-semibold">Basic Information</span>
                </div>
              </template>
              <div class="grid grid-cols-2 gap-6 p-6 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-lg">
                <div class="info-item flex flex-col">
                  <span class="text-gray-500 text-sm mb-1">Gender</span>
                  <span class="text-gray-800 font-medium">{{ patient.gender }}</span>
                </div>
                <div class="info-item flex flex-col">
                  <span class="text-gray-500 text-sm mb-1">Age</span>
                  <span class="text-gray-800 font-medium">{{ patient.age }} years</span>
                </div>
                <div class="info-item flex flex-col col-span-2">
                  <span class="text-gray-500 text-sm mb-1">Treatment Requirements</span>
                  <span class="text-gray-800 font-medium">{{ patient.treatmentReq }}</span>
                </div>
                <div class="info-item flex flex-col col-span-2">
                  <span class="text-gray-500 text-sm mb-1">Allergies</span>
                  <span class="text-gray-800 font-medium">{{ patient.allergies }}</span>
                </div>
                <div class="info-item flex flex-col col-span-2">
                  <span class="text-gray-500 text-sm mb-1">Health Notes</span>
                  <span class="text-gray-800 font-medium">{{ patient.healthNotes }}</span>
                </div>
              </div>
            </el-collapse-item>

            <!-- 任务面板 -->
            <el-collapse-item name="2">
              <template #title>
                <div class="flex items-center gap-2 text-emerald-600">
                  <el-icon><List /></el-icon>
                  Tasks
                  <el-button 
                    type="success" 
                    size="small" 
                    link
                    @click.stop="showAddTaskDialog(patient)"
                  >
                    <el-icon><Plus /></el-icon>
                  </el-button>
                </div>
              </template>
              <div class="task-list">
                <el-table :data="patient.tasks" style="width: 100%">
                  <el-table-column prop="date" label="Date" width="120" />
                  <el-table-column prop="time" label="Time" width="100" />
                  <el-table-column prop="detail" label="Content" />
                  <el-table-column width="100">
                    <template #default="{ row }">
                      <el-button type="primary" link @click.stop="handleEditTask(patient, row)">
                        Edit
                      </el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </el-collapse-item>

            <!-- 记录面板 -->
            <el-collapse-item name="3">
              <template #title>
                <div class="flex items-center gap-2 text-purple-600">
                  <el-icon><Document /></el-icon>
                  Care Records
                  <el-button 
                    type="primary" 
                    size="small" 
                    link
                    @click.stop="showAddRecordDialog(patient)"
                  >
                    <el-icon><Plus /></el-icon>
                  </el-button>
                </div>
              </template>
              <div class="record-list">
                <el-table :data="patient.records" style="width: 100%">
                  <el-table-column prop="date" label="Date" width="120" />
                  <el-table-column prop="time" label="Time" width="100" />
                  <el-table-column prop="content" label="Content" />
                  <el-table-column prop="operator" label="Operator" width="120" />
                </el-table>
              </div>
            </el-collapse-item>
          </el-collapse>
        </el-card>
      </div>
    </div>

    <!-- 添加任务对话框 -->
    <el-dialog
      v-model="showTaskDialog"
      :title="editingTask ? 'Edit Task' : 'Add Task'"
      width="500px"
    >
      <el-form :model="taskForm" label-width="100px">
        <el-form-item label="Time">
          <el-time-picker
            v-model="taskForm.time"
            format="HH:mm"
            placeholder="Select time"
          />
        </el-form-item>
        <el-form-item label="Content">
          <el-input
            v-model="taskForm.content"
            type="textarea"
            rows="3"
            placeholder="Enter task content"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showTaskDialog = false">Cancel</el-button>
          <el-button type="primary" @click="handleSaveTask">Save</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 添加护理记录对话框 -->
    <el-dialog
      v-model="showRecordDialog"
      title="Add Care Record"
      width="500px"
    >
      <el-form :model="recordForm" label-width="100px">
        <el-form-item label="Content">
          <el-input
            v-model="recordForm.content"
            type="textarea"
            rows="4"
            placeholder="Enter care record content"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showRecordDialog = false">Cancel</el-button>
          <el-button type="primary" @click="handleAddRecord">Save</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { 
  Search, User, UserFilled, Check, List, 
  Document, Plus, SwitchButton 
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { nurseAPI } from '@/api/nurse'

const router = useRouter()
const searchQuery = ref('')
const statusFilter = ref('')

// 添加加载状态
const loading = ref(false)
const currentPatient = ref(null)

// 对话框控制
const showTaskDialog = ref(false)
const showRecordDialog = ref(false)
const editingTask = ref(null)

// 表单数据
const taskForm = ref({
  time: null,
  content: ''
})

const recordForm = ref({
  content: ''
})

// 移除模拟统计数据，改为响应式的空数据
const stats = ref({
  pendingPatients: 0,
  completedPatients: 0,
  totalPatients: 0
})

// 移除模拟病人数据，改为空数组
const patients = ref([])

// 过滤病人列表
const filteredPatients = computed(() => {
  return patients.value.filter(patient => {
    const matchesSearch = 
      patient.name.includes(searchQuery.value) || 
      patient.room.includes(searchQuery.value)
    const matchesStatus = 
      !statusFilter.value || 
      (statusFilter.value === 'completed' && patient.completed) ||
      (statusFilter.value === 'pending' && !patient.completed)
    return matchesSearch && matchesStatus
  })
})

// 点击病人卡片跳转到详情页
const handlePatientClick = (patient) => {
  router.push(`/nurse/patient/${patient.id}`)
}

// 修改状态切换函数
const toggleCompleted = (patient) => {
  patient.completed = !patient.completed
  if (patient.completed) {
    stats.value.completedPatients++
    stats.value.pendingPatients--
  } else {
    stats.value.completedPatients--
    stats.value.pendingPatients++
  }
}

// 修改获取病人数据的方法
const fetchAllPatients = async () => {
  try {
    loading.value = true
    console.log('Fetching patients from API...')
    const response = await nurseAPI.getAllPatients()
    console.log('API Response:', response)

    if (response.success) {
      console.log('Raw patients data:', response.data)
      
      const patientsData = response.data.map(patientInfo => {
        console.log('Processing patient:', patientInfo)
        return {
          id: patientInfo.id,
          room: patientInfo.room || 'Not Assigned',
          name: patientInfo.fullName || 
                (patientInfo.firstName && patientInfo.lastName ? 
                 `${patientInfo.firstName} ${patientInfo.lastName}` : 'Unknown'),
          gender: patientInfo.gender || 'Not Specified',
          age: patientInfo.age || 'N/A',
          treatmentReq: patientInfo.treatmentRequirements || 'None',
          allergies: patientInfo.allergies || 'None',
          healthNotes: patientInfo.healthNotes || 'None',
          tasks: [],
          records: [],
          activeNames: ['1'],
          completed: false
        }
      })

      console.log('Processed patients data:', patientsData)
      patients.value = patientsData
      
      // 更新统计数据
      stats.value = {
        pendingPatients: patientsData.filter(p => !p.completed).length,
        completedPatients: patientsData.filter(p => p.completed).length,
        totalPatients: patientsData.length
      }
      console.log('Updated stats:', stats.value)
    } else {
      throw new Error(response.error || 'Failed to fetch patients')
    }
  } catch (error) {
    console.error('Error in fetchAllPatients:', error)
    ElMessage.error(error.message || 'Failed to load patients data')
  } finally {
    loading.value = false
  }
}

// 修改 onMounted 钩子
onMounted(() => {
  fetchAllPatients()
})

// 添加年龄计算函数
const calculateAge = (birthDate) => {
  if (!birthDate) return null
  const birth = new Date(birthDate)
  const today = new Date()
  let age = today.getFullYear() - birth.getFullYear()
  const monthDiff = today.getMonth() - birth.getMonth()
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--
  }
  return age
}

// 添加任务
const showAddTaskDialog = (patient) => {
  currentPatient.value = patient
  editingTask.value = null
  taskForm.value = {
    time: null,
    content: ''
  }
  showTaskDialog.value = true
}

// 保存任务
const handleSaveTask = async () => {
  if (!taskForm.value.time || !taskForm.value.content) {
    ElMessage.warning('Please fill in all task information')
    return
  }

  try {
    const now = new Date()
    const newTask = {
      id: `local-${Date.now()}`,
      date: now.toISOString().split('T')[0],
      time: taskForm.value.time instanceof Date ? 
        taskForm.value.time.toTimeString().slice(0, 5) : 
        taskForm.value.time,
      detail: taskForm.value.content,
      isLocal: true // 标记为本地任务
    }

    if (editingTask.value) {
      // 更新本地任务
      const index = currentPatient.value.tasks.findIndex(t => t.id === editingTask.value.id)
      if (index !== -1) {
        currentPatient.value.tasks[index] = {
          ...editingTask.value,
          time: newTask.time,
          detail: newTask.detail
        }
        ElMessage.success('Task updated successfully')
      }
    } else {
      // 添加新的本地任务
      currentPatient.value.tasks.unshift(newTask)
      ElMessage.success('Task added successfully')
    }

    // 保存到 localStorage
    const localTasks = JSON.parse(localStorage.getItem(`patient-${currentPatient.value.id}-tasks`) || '[]')
    if (editingTask.value) {
      const index = localTasks.findIndex(t => t.id === editingTask.value.id)
      if (index !== -1) {
        localTasks[index] = newTask
      }
    } else {
      localTasks.unshift(newTask)
    }
    localStorage.setItem(`patient-${currentPatient.value.id}-tasks`, JSON.stringify(localTasks))

    showTaskDialog.value = false
    taskForm.value = {
      time: null,
      content: ''
    }
    editingTask.value = null
  } catch (error) {
    console.error('Failed to save task:', error)
    ElMessage.error('Failed to save task')
  }
}

// 添加护理记录
const showAddRecordDialog = (patient) => {
  currentPatient.value = patient
  recordForm.value = {
    content: ''
  }
  showRecordDialog.value = true
}

// 保存护理记录
const handleAddRecord = async () => {
  if (!recordForm.value.content) {
    ElMessage.warning('Please enter record content')
    return
  }

  try {
    const response = await nurseAPI.addPatientRecord(
      currentPatient.value.id,
      { content: recordForm.value.content }
    )
    if (response.success) {
      currentPatient.value.records.unshift(response.data)
      ElMessage.success('Record added successfully')
      showRecordDialog.value = false
    }
  } catch (error) {
    console.error('Failed to add record:', error)
    ElMessage.error('Failed to add record')
  }
}

// 修改任务和记录的加载逻辑
const loadPatientDetails = async (patient) => {
  try {
    if (patient.activeNames.includes('2')) {
      // 加载后端任务
      const tasksResponse = await nurseAPI.getPatientTasks(patient.id)
      if (tasksResponse.success && Array.isArray(tasksResponse.data)) {
        // 加载本地任务
        const localTasks = JSON.parse(localStorage.getItem(`patient-${patient.id}-tasks`) || '[]')
        // 合并后端和本地任务，本地任务放在前面
        patient.tasks = [...localTasks, ...tasksResponse.data]
      }
    }
    
    if (patient.activeNames.includes('3') && patient.records.length === 0) {
      const recordsResponse = await nurseAPI.getPatientRecords(patient.id)
      if (recordsResponse.success && Array.isArray(recordsResponse.data)) {
        patient.records = recordsResponse.data
      }
    }
  } catch (error) {
    console.error('Error loading patient details:', error)
    ElMessage.error('Failed to load patient details')
  }
}

// 监听折叠面板的变化
const handleCollapseChange = (patient) => {
  loadPatientDetails(patient)
}

// 修改任务对话框
const handleEditTask = (patient, task) => {
  // 只允许编辑本地任务
  if (!task.isLocal) {
    ElMessage.warning('Cannot edit database tasks')
    return
  }
  
  currentPatient.value = patient
  editingTask.value = task
  taskForm.value = {
    time: new Date(`2000-01-01T${task.time}`),
    content: task.detail
  }
  showTaskDialog.value = true
}

// 添加退出登录方法
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
.nurse-dashboard {
  @apply p-6 bg-gray-50 min-h-screen;
}

.patient-card {
  @apply transition-all duration-300;
}

.info-item {
  @apply p-2 rounded;
}

/* 美化折叠面板 */
:deep(.el-collapse) {
  @apply border-none;
}

:deep(.el-collapse-item__header) {
  @apply bg-white font-medium;
}

:deep(.el-collapse-item__content) {
  @apply p-0;
}

/* 美化表格 */
:deep(.el-table) {
  @apply rounded-lg overflow-hidden;
}

:deep(.el-table th) {
  @apply bg-gray-50;
}

:deep(.el-table__row) {
  @apply hover:bg-gray-50 transition-colors duration-300;
}

/* 按钮样式 */
:deep(.el-button) {
  @apply transition-all duration-300;
}

:deep(.el-button:hover) {
  @apply transform scale-105;
}

/* 标签样式 */
:deep(.el-tag) {
  @apply cursor-pointer transition-all duration-300;
}

:deep(.el-tag:hover) {
  @apply transform scale-105;
}

/* 添加新的样式 */
.info-item {
  @apply bg-white p-4 rounded-lg shadow-sm transition-all duration-300;
}

.info-item:hover {
  @apply shadow-md transform -translate-y-0.5;
}

/* 修改折叠面板样式 */
:deep(.el-collapse-item__header) {
  @apply bg-white font-medium p-4 transition-all duration-300;
}

:deep(.el-collapse-item__header:hover) {
  @apply bg-gray-50;
}

:deep(.el-collapse-item__content) {
  @apply p-0 overflow-hidden;
}

/* 美化表格样式 */
:deep(.el-table) {
  @apply rounded-lg overflow-hidden shadow-sm;
  
  th {
    @apply bg-gray-50 font-medium text-gray-700;
  }
  
  td {
    @apply text-gray-600;
  }
}

/* 美化标签样式 */
:deep(.el-tag) {
  @apply shadow-sm transition-all duration-300;
  
  &:hover {
    @apply transform scale-105 shadow;
  }
}

/* 在已有的样式中添加 */
.top-bar {
  @apply bg-white shadow-sm;
  height: 64px;
  position: sticky;
  top: 0;
  z-index: 10;
}

.logout-btn {
  @apply transition-all duration-300;
}

.logout-btn:hover {
  @apply transform scale-105;
}
</style>
