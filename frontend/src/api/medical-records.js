import api from './index'

export const medicalRecords = {
  // 创建医疗记录
  create: (data) => {
    return api.post('/api/medical-records', data)
  },

  // 获取客户的医疗记录
  getByClientId: (clientId) => {
    return api.get(`/api/medical-records/client/${clientId}`)
  }
} 