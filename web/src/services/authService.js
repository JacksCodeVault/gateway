  import { authAPI } from '@/lib/api'

  const authService = {
    login: async (credentials) => {
      const response = await authAPI.login(credentials)
      if (response.data.token) {
        localStorage.setItem('token', response.data.token)
      }
      return response.data
    },

    register: async (userData) => {
      const response = await authAPI.register(userData)
      if (response.data.token) {
        localStorage.setItem('token', response.data.token)
      }
      return response.data
    },

    logout: () => {
      localStorage.removeItem('token')
    },

    getCurrentUser: async () => {
      return await authAPI.getProfile()
    }
  }

  export default authService
