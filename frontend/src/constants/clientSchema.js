// 客户完整信息结构
export const CLIENT_SCHEMA = {
  // 基本信息 (所有角色可见)
  basic: {
    id: '',
    name: '',
    gender: '',
    age: '',
    room: '',
    status: '', // 当前状态：稳定、需要关注等
  },
  
  // 联系信息 (行政可见)
  contact: {
    phone: '',
    emergency_contact: '',
    emergency_phone: '',
    address: '',
  },
  
  // 医疗信息 (护士可见)
  medical: {
    blood_type: '',
    allergies: [],
    medical_history: [],
    current_medications: [],
    doctor: '',
  },
  
  // 护理信息 (护工可见)
  care: {
    daily_routine: [],
    dietary_restrictions: [],
    mobility_status: '',
    assistance_needs: [],
  },
  
  // 管理信息 (行政可见)
  administrative: {
    admission_date: '',
    contract_type: '',
    payment_status: '',
    assigned_caregiver: '',
    assigned_nurse: '',
  }
}

// 定义不同角色的权限
export const ROLE_PERMISSIONS = {
  caregiver: {
    viewable: ['basic', 'care'],
    editable: ['care'],
  },
  nurse: {
    viewable: ['basic', 'medical'],
    editable: ['medical'],
  },
  admin: {
    viewable: ['basic', 'contact', 'administrative'],
    editable: ['basic', 'contact', 'administrative'],
  }
} 