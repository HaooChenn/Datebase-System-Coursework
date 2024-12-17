<template>
  <div class="patient-details">
    <!-- Basic Information -->
    <el-card class="mb-6">
      <template #header>
        <div class="flex items-center">
          <el-icon class="mr-2"><User /></el-icon>
          <span>Basic Information</span>
        </div>
      </template>
      <div class="grid grid-cols-2 gap-4">
        <div class="info-item">
          <span class="label">Room</span>
          <span class="value">{{ patient.room }}</span>
        </div>
        <div class="info-item">
          <span class="label">Name</span>
          <span class="value">{{ patient.name }}</span>
        </div>
        <div class="info-item">
          <span class="label">Gender</span>
          <span class="value">{{ patient.gender }}</span>
        </div>
        <div class="info-item">
          <span class="label">Age</span>
          <span class="value">{{ patient.age }} years</span>
        </div>
        <div class="info-item col-span-2">
          <span class="label">Care Requirements</span>
          <span class="value">{{ patient.careReq }}</span>
        </div>
      </div>
    </el-card>

    <!-- Care Records -->
    <el-card>
      <template #header>
        <div class="flex justify-between items-center">
          <div class="flex items-center">
            <el-icon class="mr-2"><Document /></el-icon>
            <span>Care Records</span>
          </div>
          <el-button type="primary" @click="showAddRecordDialog = true">
            Add Record
          </el-button>
        </div>
      </template>

      <div v-loading="loading">
        <el-empty v-if="!loading && records.length === 0" description="No care records found" />
        <el-timeline v-else>
          <el-timeline-item
            v-for="record in records"
            :key="record.id"
            :timestamp="record.date"
            :type="record.status === 'Completed' ? 'success' : 'warning'"
          >
            <el-card class="mb-4">
              <div class="flex justify-between items-start">
                <div>
                  <div class="flex items-center gap-2 mb-2">
                    <el-tag size="small">{{ record.type }}</el-tag>
                    <span class="text-gray-500">{{ record.time }}</span>
                  </div>
                  <div class="text-gray-700">{{ record.content }}</div>
                  <div class="text-gray-500 text-sm mt-2">
                    By: {{ record.operator }}
                  </div>
                </div>
              </div>
            </el-card>
          </el-timeline-item>
        </el-timeline>
      </div>
    </el-card>

    <!-- Add Record Dialog -->
    <el-dialog
      v-model="showAddRecordDialog"
      title="Add Care Record"
      width="500px"
    >
      <el-form :model="recordForm" label-width="100px">
        <el-form-item label="Type">
          <el-select v-model="recordForm.type" placeholder="Select care type">
            <el-option label="Daily Care" value="Daily Care" />
            <el-option label="Medication" value="Medication" />
            <el-option label="Special Care" value="Special Care" />
          </el-select>
        </el-form-item>
        <el-form-item label="Content">
          <el-input
            v-model="recordForm.content"
            type="textarea"
            rows="4"
            placeholder="Enter care record details"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showAddRecordDialog = false">Cancel</el-button>
          <el-button type="primary" @click="handleAddRecord">Save</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { User, Document } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { caregiverAPI } from '@/api/caregiver'

const props = defineProps({
  patient: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['update'])

const loading = ref(false)
const records = ref([])
const showAddRecordDialog = ref(false)
const recordForm = ref({
  type: '',
  content: ''
})

const loadRecords = async () => {
  try {
    loading.value = true
    const response = await caregiverAPI.getClientRecords(props.patient.id)
    if (response.success) {
      records.value = response.data
    } else {
      throw new Error(response.error || 'Failed to load records')
    }
  } catch (error) {
    console.error('Error loading records:', error)
    ElMessage.error('Failed to load care records')
  } finally {
    loading.value = false
  }
}

const handleAddRecord = async () => {
  if (!recordForm.value.type || !recordForm.value.content) {
    ElMessage.warning('Please fill in all required fields')
    return
  }

  try {
    const response = await caregiverAPI.addClientRecord(props.patient.id, recordForm.value)
    if (response.success) {
      ElMessage.success('Care record added successfully')
      showAddRecordDialog.value = false
      recordForm.value = { type: '', content: '' }
      loadRecords()
      emit('update')
    } else {
      throw new Error(response.error || 'Failed to add record')
    }
  } catch (error) {
    console.error('Error adding record:', error)
    ElMessage.error('Failed to add care record')
  }
}

onMounted(() => {
  loadRecords()
})
</script>

<style scoped>
.info-item {
  @apply p-4 bg-gray-50 rounded-lg;
}

.label {
  @apply text-gray-500 text-sm block mb-1;
}

.value {
  @apply text-gray-800 font-medium;
}

.el-timeline {
  @apply mt-4;
}
</style> 