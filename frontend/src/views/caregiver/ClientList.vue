<template>
  <div class="client-list-container p-6">
    <!-- Statistics Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <el-card class="stat-card">
        <div class="flex items-center justify-between">
          <div>
            <div class="text-gray-500">Total Patients</div>
            <div class="text-2xl font-bold mt-2">{{ mockPatients.length }}</div>
          </div>
          <el-icon class="text-3xl text-blue-500"><User /></el-icon>
        </div>
      </el-card>
      
      <el-card class="stat-card">
        <div class="flex items-center justify-between">
          <div>
            <div class="text-gray-500">Active Care Plans</div>
            <div class="text-2xl font-bold mt-2">{{ activeCareCount }}</div>
          </div>
          <el-icon class="text-3xl text-green-500"><Check /></el-icon>
        </div>
      </el-card>
      
      <el-card class="stat-card">
        <div class="flex items-center justify-between">
          <div>
            <div class="text-gray-500">Today's Tasks</div>
            <div class="text-2xl font-bold mt-2">{{ todayTasksCount }}</div>
          </div>
          <el-icon class="text-3xl text-purple-500"><List /></el-icon>
        </div>
      </el-card>
    </div>

    <!-- Search and Filter -->
    <div class="flex justify-between items-center mb-6">
      <el-input
        v-model="searchQuery"
        placeholder="Search by name or room number..."
        class="w-64"
        :prefix-icon="Search"
      />
      <el-select v-model="statusFilter" placeholder="Care Status" class="w-40">
        <el-option label="All Status" value="" />
        <el-option label="Active" value="active" />
        <el-option label="Completed" value="completed" />
      </el-select>
    </div>

    <!-- Patient List -->
    <div class="patient-list space-y-6">
      <div
        v-for="patient in filteredPatients"
        :key="patient.id"
        class="patient-card"
      >
        <el-card class="box-card hover:shadow-lg transition-shadow duration-300">
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center space-x-4">
              <div class="text-4xl font-bold text-indigo-600 bg-indigo-50 p-4 rounded-lg">
                {{ patient.room }}
              </div>
              <div>
                <div class="text-2xl font-medium text-gray-800">{{ patient.name }}</div>
                <div class="text-sm text-gray-500">ID: {{ patient.id }}</div>
              </div>
            </div>
            <div class="flex items-center gap-4">
              <el-tag :type="patient.status === 'active' ? 'success' : 'info'" class="text-base px-3 py-1">
                {{ patient.status === 'active' ? 'Active' : 'Completed' }}
              </el-tag>
              <el-button type="primary" @click="viewPatientDetails(patient)">
                View Details
              </el-button>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div class="info-item">
              <span class="text-gray-500">Gender</span>
              <span class="font-medium">{{ patient.gender }}</span>
            </div>
            <div class="info-item">
              <span class="text-gray-500">Age</span>
              <span class="font-medium">{{ patient.age }} years</span>
            </div>
            <div class="info-item col-span-2">
              <span class="text-gray-500">Care Requirements</span>
              <span class="font-medium">{{ patient.careReq }}</span>
            </div>
            <div class="info-item col-span-2">
              <span class="text-gray-500">Today's Tasks</span>
              <div class="flex flex-wrap gap-2 mt-2">
                <el-tag 
                  v-for="task in patient.todayTasks" 
                  :key="task.id"
                  :type="task.completed ? 'success' : 'warning'"
                  class="mr-2"
                >
                  {{ task.time }} - {{ task.content }}
                </el-tag>
              </div>
            </div>
          </div>
        </el-card>
      </div>
    </div>

    <!-- Patient Details Dialog -->
    <el-dialog
      v-model="showDetailsDialog"
      title="Patient Details"
      width="80%"
      destroy-on-close
    >
      <patient-details
        v-if="selectedPatient"
        :patient="selectedPatient"
        @update="loadPatients"
      />
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { User, Check, List, Search } from '@element-plus/icons-vue'
import PatientDetails from '@/components/caregiver/PatientDetails.vue'

// Mock data
const mockPatients = ref([
  {
    id: 'P001',
    name: 'John Smith',
    gender: 'Male',
    age: 75,
    room: 'A101',
    status: 'active',
    careReq: 'Regular blood pressure monitoring, assistance with daily activities',
    todayTasks: [
      { id: 1, time: '08:00', content: 'Morning care', completed: true },
      { id: 2, time: '12:00', content: 'Lunch assistance', completed: false }
    ]
  },
  {
    id: 'P002',
    name: 'Mary Johnson',
    gender: 'Female',
    age: 82,
    room: 'A102',
    status: 'active',
    careReq: 'Diabetes management, mobility assistance',
    todayTasks: [
      { id: 3, time: '09:00', content: 'Blood sugar check', completed: true },
      { id: 4, time: '15:00', content: 'Walking assistance', completed: false }
    ]
  },
  {
    id: 'P003',
    name: 'Robert Davis',
    gender: 'Male',
    age: 68,
    room: 'A103',
    status: 'completed',
    careReq: 'Post-surgery recovery care',
    todayTasks: [
      { id: 5, time: '10:00', content: 'Physical therapy', completed: true },
      { id: 6, time: '14:00', content: 'Wound dressing', completed: true }
    ]
  },
  {
    id: 'P004',
    name: 'Patricia Wilson',
    gender: 'Female',
    age: 79,
    room: 'A104',
    status: 'active',
    careReq: 'Memory care, assistance with meals',
    todayTasks: [
      { id: 7, time: '07:30', content: 'Morning medication', completed: true },
      { id: 8, time: '13:00', content: 'Memory exercises', completed: false }
    ]
  }
])

// State
const searchQuery = ref('')
const statusFilter = ref('')
const showDetailsDialog = ref(false)
const selectedPatient = ref(null)

// Computed
const filteredPatients = computed(() => {
  return mockPatients.value.filter(patient => {
    const matchesSearch = 
      patient.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      patient.room.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesStatus = !statusFilter.value || patient.status === statusFilter.value
    return matchesSearch && matchesStatus
  })
})

const activeCareCount = computed(() => {
  return mockPatients.value.filter(p => p.status === 'active').length
})

const todayTasksCount = computed(() => {
  return mockPatients.value.reduce((count, p) => count + p.todayTasks.length, 0)
})

// Methods
const viewPatientDetails = (patient) => {
  selectedPatient.value = patient
  showDetailsDialog.value = true
}
</script>

<style scoped>
.info-item {
  @apply flex flex-col space-y-1 p-2 rounded-lg bg-gray-50;
}

.patient-card {
  @apply transition-all duration-300;
}

.patient-card:hover {
  @apply transform -translate-y-1;
}

.stat-card {
  @apply transition-all duration-300 hover:shadow-lg;
}
</style> 