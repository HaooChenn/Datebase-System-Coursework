<template>
  <div class="admin-dashboard bg-gray-50 min-h-screen">
    <!-- 顶部条带 -->
    <div class="top-bar mb-6">
      <div class="flex justify-between items-center h-full px-6">
        <h1 class="text-xl font-semibold text-gray-800">Admin Dashboard</h1>
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

    <!-- 主要内容区域 -->
    <div class="dashboard-content px-6">
      <!-- 数据概览卡片 -->
      <el-row :gutter="20" class="mb-6">
        <el-col :span="6" v-for="card in dataCards" :key="card.title">
          <el-card 
            shadow="hover" 
            class="h-32 transform transition-all duration-300 hover:scale-105 bg-white"
          >
            <div class="flex items-center justify-between">
              <div>
                <div class="text-gray-500 mb-2">{{ card.title }}</div>
                <div class="text-3xl font-bold" :class="card.color">{{ card.value }}</div>
                <div class="text-sm text-gray-400 mt-1">{{ card.change }}</div>
              </div>
              <el-icon class="text-4xl" :class="card.color">
                <component :is="card.icon" />
              </el-icon>
            </div>
          </el-card>
        </el-col>
      </el-row>

      <!-- Care Staff Workload Statistics -->
      <el-card class="mb-6 bg-white">
        <template #header>
          <div class="flex justify-between items-center">
            <span class="font-medium">Care Staff Workload Statistics</span>
            <div class="flex gap-4">
              <el-select v-model="staffFilter" placeholder="Filter by Role" size="small">
                <el-option label="All" value="" />
                <el-option label="Nurse" value="nurse" />
                <el-option label="Caregiver" value="caregiver" />
              </el-select>
              <el-select v-model="departmentFilter" placeholder="Select Department" size="small">
                <el-option 
                  v-for="dept in departments" 
                  :key="dept.id" 
                  :label="dept.name" 
                  :value="dept.id" 
                />
              </el-select>
              <el-button type="primary" size="small" @click="exportStaffStats">
                <el-icon class="mr-1"><Download /></el-icon>Export Report
              </el-button>
            </div>
          </div>
        </template>
        
        <el-table :data="filteredStaffStats" style="width: 100%">
          <el-table-column prop="staffName" label="Staff Name" width="120" />
          <el-table-column prop="role" label="Role" width="100">
            <template #default="{ row }">
              <el-tag :type="row.role === 'nurse' ? 'success' : 'warning'" class="rounded-full">
                {{ row.role === 'nurse' ? 'Nurse' : 'Caregiver' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="assignedPatients" label="Assigned Patients" width="100" />
          <el-table-column prop="completedTasks" label="Completed Tasks" width="100" />
          <el-table-column prop="workload" label="Workload" width="200">
            <template #default="{ row }">
              <el-progress 
                :percentage="row.workload" 
                :status="getWorkloadStatus(row.workload)"
              />
            </template>
          </el-table-column>
          <el-table-column prop="efficiency" label="Efficiency" width="150">
            <template #default="{ row }">
              <div class="flex items-center">
                <span class="mr-2">{{ row.efficiency }}%</span>
                <el-icon 
                  :class="row.efficiency >= 80 ? 'text-green-500' : 'text-orange-500'"
                >
                  <component :is="row.efficiency >= 80 ? 'ArrowUp' : 'ArrowDown'" />
                </el-icon>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="Actions" width="200">
            <template #default="{ row }">
              <el-button type="primary" link @click="viewStaffDetails(row)">Details</el-button>
              <el-button type="success" link @click="adjustWorkload(row)">Adjust</el-button>
              <el-button type="warning" link @click="viewPerformance(row)">Performance</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>

      <!-- Hospital Overview -->
      <el-card class="mb-6 bg-white">
        <template #header>
          <div class="flex justify-between items-center">
            <span class="font-medium">Hospital Overview</span>
            <el-button-group>
              <el-button type="primary" plain size="small" @click="refreshStats">
                <el-icon><Refresh /></el-icon>
              </el-button>
              <el-button type="primary" plain size="small" @click="exportStats">
                <el-icon><Download /></el-icon>
              </el-button>
            </el-button-group>
          </div>
        </template>

        <div class="grid grid-cols-4 gap-4 mb-4">
          <div class="stat-box bg-blue-50 p-4 rounded-lg">
            <div class="text-blue-500 text-sm">Total Beds</div>
            <div class="text-2xl font-bold mt-1">{{ stats.totalBeds }}</div>
            <div class="text-sm text-gray-500 mt-1">Occupancy {{ stats.occupancyRate }}%</div>
          </div>
          <div class="stat-box bg-green-50 p-4 rounded-lg">
            <div class="text-green-500 text-sm">Current Patients</div>
            <div class="text-2xl font-bold mt-1">{{ stats.currentPatients }}</div>
            <div class="text-sm text-gray-500 mt-1">vs Last Month {{ stats.patientChange }}%</div>
          </div>
          <div class="stat-box bg-yellow-50 p-4 rounded-lg">
            <div class="text-yellow-500 text-sm">Special Care</div>
            <div class="text-2xl font-bold mt-1">{{ stats.specialCare }}</div>
            <div class="text-sm text-gray-500 mt-1">Need Attention</div>
          </div>
          <div class="stat-box bg-purple-50 p-4 rounded-lg">
            <div class="text-purple-500 text-sm">Today's Discharge</div>
            <div class="text-2xl font-bold mt-1">{{ stats.dischargeToday }}</div>
            <div class="text-sm text-gray-500 mt-1">Pending</div>
          </div>
        </div>

        <!-- Room Usage Table -->
        <el-table :data="roomStats" style="width: 100%" :max-height="400">
          <el-table-column prop="floor" label="Floor" width="100" />
          <el-table-column prop="roomType" label="Room Type" width="120">
            <template #default="{ row }">
              <el-tag :type="getRoomTypeTag(row.roomType)" class="rounded-full">
                {{ row.roomType }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="totalRooms" label="Total Rooms" width="100" />
          <el-table-column prop="occupiedRooms" label="Occupied" width="100" />
          <el-table-column prop="occupancyRate" label="Occupancy Rate" width="180">
            <template #default="{ row }">
              <el-progress 
                :percentage="row.occupancyRate"
                :color="getOccupancyColor(row.occupancyRate)"
              />
            </template>
          </el-table-column>
          <el-table-column prop="nurseCount" label="Nurses" width="120" />
          <el-table-column prop="caregiverCount" label="Caregivers" width="120" />
          <el-table-column label="Staff Assignment" width="200">
            <template #default="{ row }">
              <el-button type="primary" link @click="assignStaff(row)">
                Manage Staff
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>

      <!-- 图表统计区域 - 移到最下面 -->
      <div class="grid grid-cols-2 gap-6 mb-6">
        <!-- Room Occupancy Statistics -->
        <el-card class="h-80 bg-white">
          <template #header>
            <div class="flex justify-between items-center">
              <span class="font-medium">Room Occupancy Statistics</span>
              <el-select v-model="occupancyTimeRange" size="small">
                <el-option label="Last 7 days" value="7" />
                <el-option label="Last 30 days" value="30" />
                <el-option label="Last 90 days" value="90" />
              </el-select>
            </div>
          </template>
          <div class="chart-container" style="height: 100%">
            <div class="flex items-center justify-center h-full text-gray-400">
              Chart will be implemented soon
            </div>
          </div>
        </el-card>

        <!-- Care Task Distribution -->
        <el-card class="h-80 bg-white">
          <template #header>
            <div class="flex justify-between items-center">
              <span class="font-medium">Care Task Distribution</span>
              <el-radio-group v-model="taskDistributionType" size="small">
                <el-radio-button label="type">Type</el-radio-button>
                <el-radio-button label="status">Status</el-radio-button>
              </el-radio-group>
            </div>
          </template>
          <div class="chart-container" style="height: 100%">
            <div class="flex items-center justify-center h-full text-gray-400">
              Chart will be implemented soon
            </div>
          </div>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import {
  User, FirstAidKit, Bell, List, Download, Refresh,
  ArrowUp, ArrowDown, SwitchButton
} from '@element-plus/icons-vue'

const router = useRouter()

// Basic statistics data
const stats = ref({
  totalBeds: 200,
  occupancyRate: 85,
  currentPatients: 170,
  patientChange: 5,
  specialCare: 45,
  dischargeToday: 3
})

// Data overview cards
const dataCards = ref([
  {
    title: 'Active Nurses',
    value: '24',
    icon: 'FirstAidKit',
    color: 'text-blue-500',
    change: '+2 from last week'
  },
  {
    title: 'Active Caregivers',
    value: '36',
    icon: 'User',
    color: 'text-green-500',
    change: '+3 from last week'
  },
  {
    title: "Today's Tasks",
    value: '156',
    icon: 'List',
    color: 'text-orange-500',
    change: '85% completed'
  },
  {
    title: 'Pending Alerts',
    value: '8',
    icon: 'Bell',
    color: 'text-red-500',
    change: '3 high priority'
  }
])

// Staff statistics
const staffFilter = ref('')
const departmentFilter = ref('')
const departments = ref([
  { id: 1, name: 'General Care' },
  { id: 2, name: 'Intensive Care' },
  { id: 3, name: 'Rehabilitation' }
])

const staffStats = ref([
  {
    id: 1,
    staffName: 'John Smith',
    role: 'nurse',
    assignedPatients: 8,
    completedTasks: 45,
    workload: 75,
    efficiency: 88,
    department: 'General Care'
  },
  {
    id: 2,
    staffName: 'Mary Johnson',
    role: 'caregiver',
    assignedPatients: 5,
    completedTasks: 32,
    workload: 60,
    efficiency: 92,
    department: 'Rehabilitation'
  },
  {
    id: 3,
    staffName: 'David Wilson',
    role: 'nurse',
    assignedPatients: 0,
    completedTasks: 0,
    workload: 0,
    efficiency: 0,
    department: 'Intensive Care'
  }
])

// Room statistics
const roomStats = ref([
  {
    floor: '1st Floor',
    roomType: 'Standard',
    totalRooms: 20,
    occupiedRooms: 18,
    occupancyRate: 90,
    nurseCount: 4,
    caregiverCount: 6
  },
  {
    floor: '2nd Floor',
    roomType: 'VIP',
    totalRooms: 10,
    occupiedRooms: 7,
    occupancyRate: 70,
    nurseCount: 3,
    caregiverCount: 4
  },
  {
    floor: '3rd Floor',
    roomType: 'ICU',
    totalRooms: 8,
    occupiedRooms: 6,
    occupancyRate: 75,
    nurseCount: 6,
    caregiverCount: 3
  }
])

// Basic variables
const taskDistributionType = ref('type')
const occupancyTimeRange = ref('7')

// Computed properties
const filteredStaffStats = computed(() => {
  return staffStats.value.filter(staff => {
    if (staffFilter.value && staff.role !== staffFilter.value) return false
    if (departmentFilter.value && staff.department !== departments.value.find(d => d.id === departmentFilter.value)?.name) return false
    return true
  })
})

// Methods
const getWorkloadStatus = (workload) => {
  if (workload >= 90) return 'exception'
  if (workload >= 70) return 'warning'
  return 'success'
}

const getRoomTypeTag = (type) => {
  switch (type) {
    case 'VIP': return 'success'
    case 'ICU': return 'danger'
    default: return 'info'
  }
}

const getOccupancyColor = (rate) => {
  if (rate >= 90) return '#F56C6C'
  if (rate >= 70) return '#E6A23C'
  return '#67C23A'
}

const assignStaff = (row) => {
  ElMessage.success(`Opening staff assignment dialog for ${row.floor}`)
}

const handleLogout = () => {
  // 清除所有登录信息
  localStorage.removeItem('token')
  localStorage.removeItem('userRole')
  localStorage.removeItem('isLoggedIn')
  localStorage.removeItem('userId')
  // 提示并跳转
  ElMessage.success('退出登录成功')
  router.push('/login')
}

const viewStaffDetails = (staff) => {
  ElMessage.success(`Viewing details for ${staff.staffName}`)
}

const adjustWorkload = (staff) => {
  ElMessage.success(`Adjusting workload for ${staff.staffName}`)
}

const viewPerformance = (staff) => {
  ElMessage.success(`Viewing performance for ${staff.staffName}`)
}

const exportStaffStats = () => {
  ElMessage.success('Exporting staff statistics report')
}

const refreshStats = () => {
  ElMessage.success('Refreshing statistics')
}

const exportStats = () => {
  ElMessage.success('Exporting hospital overview report')
}
</script>

<style scoped>
.admin-dashboard {
  background-color: #f5f7fa;
}

.top-bar {
  background-color: white;
  height: 64px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.chart-container {
  width: 100%;
  height: calc(100% - 20px);
}

/* Card Styles */
:deep(.el-card) {
  transition: all 0.3s ease;
  border: none;
}

:deep(.el-card:hover) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

/* Table Styles */
:deep(.el-table) {
  border-radius: 8px;
  overflow: hidden;
}

:deep(.el-table th) {
  background-color: #f8fafc;
  font-weight: 600;
}

:deep(.el-table__row) {
  transition: background-color 0.2s ease;
}

:deep(.el-table__row:hover) {
  background-color: #f1f5f9;
}

/* Progress Bar Styles */
:deep(.el-progress-bar__outer) {
  border-radius: 4px;
}

:deep(.el-progress-bar__inner) {
  border-radius: 4px;
  transition: all 0.3s ease;
}

/* Tag Styles */
:deep(.el-tag) {
  border-radius: 16px;
  padding: 0 12px;
  height: 24px;
  line-height: 24px;
}

/* Button Styles */
:deep(.el-button) {
  border-radius: 6px;
  transition: all 0.2s ease;
}

:deep(.el-button:hover) {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

/* Stat Box Styles */
.stat-box {
  transition: all 0.3s ease;
  cursor: pointer;
}

.stat-box:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

/* Icon Styles */
:deep(.el-icon) {
  vertical-align: middle;
}

/* Select and Radio Styles */
:deep(.el-select),
:deep(.el-radio-group) {
  margin-bottom: 0;
}

:deep(.el-select:hover),
:deep(.el-radio-button:hover) {
  transform: translateY(-1px);
}
</style> 