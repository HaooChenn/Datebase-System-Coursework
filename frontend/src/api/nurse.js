import api from './index'

export const nurseAPI = {
  // Get all patients
  getAllPatients: async () => {
    console.log('Fetching all patients...')
    const response = await api.get('/nurse/patients')
    console.log('All patients response:', response)
    return response
  },
  
  // Get patient tasks
  getPatientTasks: async (patientId) => {
    console.log(`Fetching tasks for patient ${patientId}...`)
    const response = await api.get(`/nurse/patients/${patientId}/tasks`)
    console.log('Patient tasks response:', response)
    return response
  },
  
  // Add patient task
  addPatientTask: async (patientId, data) => {
    console.log(`Adding task for patient ${patientId}:`, data)
    const taskData = {
      content: data.detail,
      time: data.time
    }
    const response = await api.post(`/nurse/patients/${patientId}/tasks`, taskData)
    console.log('Add task response:', response)
    return response
  },
  
  // Update patient task
  updatePatientTask: async (patientId, taskId, data) => {
    console.log(`Updating task ${taskId} for patient ${patientId}:`, data)
    const taskData = {
      content: data.detail,
      time: data.time
    }
    const response = await api.put(`/nurse/patients/${patientId}/tasks/${taskId}`, taskData)
    console.log('Update task response:', response)
    return response
  },
  
  // Get patient records
  getPatientRecords: async (patientId) => {
    console.log(`Fetching records for patient ${patientId}...`)
    const response = await api.get(`/nurse/patients/${patientId}/records`)
    console.log('Patient records response:', response)
    return response
  },
  
  // Add patient record
  addPatientRecord: async (patientId, data) => {
    console.log(`Adding record for patient ${patientId}:`, data)
    const recordData = {
      content: data.content
    }
    const response = await api.post(`/nurse/patients/${patientId}/records`, recordData)
    console.log('Add record response:', response)
    return response
  }
} 