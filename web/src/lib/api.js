
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
  loginWithGoogle: (data) => api.post('/api/v1/auth/google', data),
  resetPassword: (data) => api.post('/api/v1/auth/reset-password', data),
  changePassword: (data) => api.post('/api/v1/auth/change-password', data),
  getProfile: () => api.get('/api/v1/auth/who-am-i'),
  deleteAccount: () => api.delete('/api/v1/auth/delete-account'),
  generateApiKey: () => api.post('/api/v1/auth/api-keys'),
  getApiKeys: () => api.get('/api/v1/auth/api-keys'),
  revokeApiKey: (keyId) => api.delete(`/api/v1/auth/api-keys/${keyId}`)
}

export const userAPI = {
  getProfile: () => api.get('/api/v1/users/profile'),
  updateProfile: (data) => api.patch('/api/v1/users/profile', data)
}

export const gatewayAPI = {
  // Stats
  getStats: () => api.get('/api/v1/gateway/stats'),
  
  // Device management
  registerDevice: (data) => api.post('/api/v1/gateway/devices', data),
  getDevices: () => api.get('/api/v1/gateway/devices'),
  updateDevice: (id, data) => api.patch(`/api/v1/gateway/devices/${id}`, data),
  deleteDevice: (id) => api.delete(`/api/v1/gateway/devices/${id}`),
  
  // SMS operations
  sendSMS: (deviceId, data) => api.post(`/api/v1/gateway/devices/${deviceId}/sendSMS`, data),
  receiveSMS: (deviceId, data) => api.post(`/api/v1/gateway/devices/${deviceId}/receiveSMS`, data),
  //getReceivedSMS: (deviceId) => api.get(`/api/v1/gateway/devices/${deviceId}/getReceivedSMS`),
  getForwardedMessages: (deviceId) => api.get(`/api/v1/gateway/devices/${deviceId}/forwardedMessages`)}


export default api
