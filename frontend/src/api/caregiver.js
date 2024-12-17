import api from './index'

export const caregiverAPI = {
  // Get all patients
  getAllClients: async () => {
    console.log('Fetching all patients...')
    const response = await api.get('/caregiver/patients')
    console.log('All patients response:', response)
    return response
  },
  
  // Get patient tasks
  getClientTasks: async (clientId) => {
    console.log(`Fetching tasks for patient ${clientId}...`)
    const response = await api.get(`/caregiver/patients/${clientId}/care-records`)
    console.log('Patient tasks response:', response)
    return response
  },
  
  // Add patient task
  addClientTask: async (clientId, data) => {
    console.log(`Adding task for patient ${clientId}:`, data)
    const response = await api.post(`/caregiver/patients/${clientId}/care-records`, {
      type: 'Daily Care',
      content: data.content,
      status: 'Completed'
    })
    console.log('Add task response:', response)
    return response
  },
  
  // Get patient care records
  getClientRecords: async (clientId) => {
    console.log(`Fetching records for patient ${clientId}...`)
    const response = await api.get(`/caregiver/patients/${clientId}/care-records`)
    console.log('Patient records response:', response)
    return response
  },
  
  // Add patient care record
  addClientRecord: async (clientId, data) => {
    console.log(`Adding record for patient ${clientId}:`, data)
    const response = await api.post(`/caregiver/patients/${clientId}/care-records`, {
      type: data.type || 'Daily Care',
      content: data.content,
      status: 'Completed'
    })
    console.log('Add record response:', response)
    return response
  }
} 