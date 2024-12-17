import axios from 'axios'
import { ElMessage } from 'element-plus'

const api = axios.create({
  baseURL: '/api',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json'
  },
  retry: 3,
  retryDelay: 1000
})

// Request interceptor
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    console.log('Request:', {
      url: config.url,
      method: config.method,
      headers: config.headers,
      data: config.data
    })
    return config
  },
  error => {
    console.error('Request error:', error)
    return Promise.reject(error)
  }
)

// Response interceptor
api.interceptors.response.use(undefined, async (err) => {
  const { config } = err
  if (!config || !config.retry) {
    return Promise.reject(err)
  }

  config.__retryCount = config.__retryCount || 0

  if (config.__retryCount >= config.retry) {
    return Promise.reject(err)
  }

  config.__retryCount += 1
  console.log(`Retrying request (${config.__retryCount}/${config.retry})`)

  await new Promise(resolve => setTimeout(resolve, config.retryDelay))
  return api(config)
})

// Response interceptor
api.interceptors.response.use(
  response => {
    console.log('Response:', {
      url: response.config.url,
      status: response.status,
      data: response.data
    })
    return response.data
  },
  error => {
    console.error('Response error:', {
      url: error.config?.url,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    })

    if (error.response) {
      // Handle 401 unauthorized
      if (error.response.status === 401) {
        localStorage.removeItem('token')
        localStorage.removeItem('userRole')
        localStorage.removeItem('isLoggedIn')
        ElMessage.error('Session expired. Please login again.')
        window.location.href = '/login'
        return Promise.reject(error.response.data)
      }

      // Handle other status codes
      const message = error.response.data?.error || 'An error occurred'
      ElMessage.error(message)
      return Promise.reject(error.response.data)
    }

    // Handle network errors
    if (error.message.includes('timeout')) {
      ElMessage.error('Request timeout. Please try again.')
    } else {
      ElMessage.error('Network error. Please check your connection.')
    }
    return Promise.reject(error)
  }
)

export default api 