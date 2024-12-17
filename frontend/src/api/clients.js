import api from './index'

export const clients = {
  // 获取客户列表
  getList: () => {
    return api.get('/api/clients')
  },

  // 获取所有客户详细信息（包括护士和护工信息）
  getAllWithDetails: () => {
    return api.get('/api/clients/details')
  },

  // 获取单个客户详情
  getById: (id) => {
    return api.get(`/api/clients/${id}`)
  },

  // 创建客户
  create: (data) => {
    return api.post('/api/clients', data)
  }
} 