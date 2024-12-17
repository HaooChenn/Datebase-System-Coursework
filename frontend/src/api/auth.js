import api from './index'

export const auth = {
  login: (credentials) => {
    return api.post('/api/auth/login', {
      username: credentials.username,
      password: credentials.password
    })
  }
} 