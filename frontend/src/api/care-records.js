import api from './index'

export const careRecords = {
  // 创建护理记录
  create: (data) => {
    return api.post('/api/care-records', data)
  },

  // 获取客户的护理记录
  getByClientId: (clientId) => {
    return api.get(`/api/care-records/client/${clientId}`)
  }
} 