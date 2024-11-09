
import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Request interceptor for API token
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => Promise.reject(error)
)

export const authAPI = {
  register: (data) => api.post('/api/v1/auth/register', data),
  login: (data) => api.post('/api/v1/auth/login', data),
  generateApiKey: () => api.post('/api/v1/auth/api-keys'),
  getProfile: () => api.get('/api/v1/auth/who-am-i')
}

export const userAPI = {
  getProfile: () => api.get('/api/v1/users/profile'),
  updateProfile: (data) => api.patch('/api/v1/users/profile', data)
}

export const deviceAPI = {
  register: (data) => api.post('/api/v1/gateway/devices', data),
  getDevices: () => api.get('/api/v1/gateway/devices'),
  sendSMS: (deviceId, data) => api.post(`/api/v1/gateway/devices/${deviceId}/sendSMS`, data)
}

export default api
