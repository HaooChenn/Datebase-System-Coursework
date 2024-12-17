<template>
  <div class="client-info">
    <!-- 基本信息卡片 (所有角色可见) -->
    <el-card class="mb-4">
      <template #header>
        <div class="flex justify-between items-center">
          <span class="font-bold">基本信息</span>
          <el-tag :type="client.basic.status === '稳定' ? 'success' : 'warning'">
            {{ client.basic.status }}
          </el-tag>
        </div>
      </template>
      <el-descriptions :column="2" border>
        <el-descriptions-item label="姓名">{{ client.basic.name }}</el-descriptions-item>
        <el-descriptions-item label="性别">{{ client.basic.gender }}</el-descriptions-item>
        <el-descriptions-item label="年龄">{{ client.basic.age }}岁</el-descriptions-item>
        <el-descriptions-item label="房间号">{{ client.basic.room }}</el-descriptions-item>
      </el-descriptions>
    </el-card>

    <!-- 医疗信息 (仅护士可见) -->
    <el-card v-if="hasPermission('medical')" class="mb-4">
      <template #header>
        <div class="flex justify-between items-center">
          <span class="font-bold">医疗信息</span>
          <el-button 
            v-if="canEdit('medical')"
            type="primary" 
            size="small"
            @click="handleAddMedicalRecord"
          >
            添加记录
          </el-button>
        </div>
      </template>
      <div class="space-y-4">
        <div v-if="client.medical.allergies.length">
          <div class="text-gray-600 mb-1">过敏史</div>
          <el-tag 
            v-for="allergy in client.medical.allergies" 
            :key="allergy"
            class="mr-2"
            type="danger"
          >
            {{ allergy }}
          </el-tag>
        </div>
        <div>
          <div class="text-gray-600 mb-1">当前用药</div>
          <el-table :data="client.medical.current_medications" border>
            <el-table-column prop="name" label="药品名称" />
            <el-table-column prop="dosage" label="剂量" />
            <el-table-column prop="frequency" label="频率" />
          </el-table>
        </div>
      </div>
    </el-card>

    <!-- 护理信息 (仅护工可见) -->
    <el-card v-if="hasPermission('care')" class="mb-4">
      <template #header>
        <div class="flex justify-between items-center">
          <span class="font-bold">护理信息</span>
          <el-button 
            v-if="canEdit('care')"
            type="primary" 
            size="small"
            @click="handleAddCareRecord"
          >
            添加护理记录
          </el-button>
        </div>
      </template>
      <div class="space-y-4">
        <div>
          <div class="text-gray-600 mb-1">日常护理需求</div>
          <el-tag 
            v-for="need in client.care.assistance_needs" 
            :key="need"
            class="mr-2"
          >
            {{ need }}
          </el-tag>
        </div>
        <div>
          <div class="text-gray-600 mb-1">护理记录</div>
          <el-timeline>
            <el-timeline-item
              v-for="record in careRecords"
              :key="record.id"
              :timestamp="record.time"
            >
              <h4>{{ record.title }}</h4>
              <p class="text-gray-500">{{ record.description }}</p>
            </el-timeline-item>
          </el-timeline>
        </div>
      </div>
    </el-card>

    <!-- 管理信息 (仅行政可见) -->
    <el-card v-if="hasPermission('administrative')" class="mb-4">
      <template #header>
        <div class="flex justify-between items-center">
          <span class="font-bold">管理信息</span>
          <el-button 
            v-if="canEdit('administrative')"
            type="primary" 
            size="small"
            @click="handleEditAdminInfo"
          >
            编辑信息
          </el-button>
        </div>
      </template>
      <el-descriptions :column="2" border>
        <el-descriptions-item label="入住日期">
          {{ client.administrative.admission_date }}
        </el-descriptions-item>
        <el-descriptions-item label="合同类型">
          {{ client.administrative.contract_type }}
        </el-descriptions-item>
        <el-descriptions-item label="指定护工">
          {{ client.administrative.assigned_caregiver }}
        </el-descriptions-item>
        <el-descriptions-item label="指定护士">
          {{ client.administrative.assigned_nurse }}
        </el-descriptions-item>
      </el-descriptions>
    </el-card>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ROLE_PERMISSIONS } from '@/constants/clientSchema'

const props = defineProps({
  client: {
    type: Object,
    required: true
  },
  userRole: {
    type: String,
    required: true
  }
})

// 检查权限
const hasPermission = (section) => {
  return ROLE_PERMISSIONS[props.userRole].viewable.includes(section)
}

const canEdit = (section) => {
  return ROLE_PERMISSIONS[props.userRole].editable.includes(section)
}

// 处理各种操作的方法
const handleAddMedicalRecord = () => {
  // 实现添加医疗记录的逻辑
}

const handleAddCareRecord = () => {
  // 实现添加护理记录的逻辑
}

const handleEditAdminInfo = () => {
  // 实现编辑管理信息的逻辑
}
</script> 