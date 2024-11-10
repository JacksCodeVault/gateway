  import { auth, googleProvider } from '@/config/firebase-config'
  import { signInWithPopup } from 'firebase/auth'
  import { authAPI } from '@/lib/api'

  const authService = {
    loginWithGoogle: async () => {
      try {
        const result = await signInWithPopup(auth, googleProvider);
        console.log('Firebase Auth Result:', result);
        
        const response = await authAPI.loginWithGoogle({
          token: result.user.accessToken,
          email: result.user.email,
          name: result.user.displayName
        });
        console.log('Backend Response:', response);
        
        if (response.data.token) {
          localStorage.setItem('token', response.data.token);
        }
        return response.data;
      } catch (error) {
        console.error('Google Auth Error:', {
          code: error.code,
          message: error.message,
          details: error
        });
        throw error;
      }
    },
    login: async (credentials) => {
      const response = await authAPI.login(credentials)
      if (response.data.data.accessToken) {
        localStorage.setItem('token', response.data.data.accessToken)
        return response.data.data
      }
      throw new Error('No token received')
    },

    register: async (userData) => {
      const response = await authAPI.register(userData)
      if (response.data.data.accessToken) {
        localStorage.setItem('token', response.data.data.accessToken)
        return response.data.data
      }
      throw new Error('No token received')
    },

    resetPassword: async (email) => {
      try {
        const response = await authAPI.resetPassword({ email })
        return response.data.data
      } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to send reset instructions')
      }
    },
  
    changePassword: async (currentPassword, newPassword) => {
      try {
        const response = await authAPI.changePassword({
          currentPassword,
          newPassword
        })
        return response.data.data
      } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to update password')
      }
    },

    deleteAccount: async (password) => {
      try {
        const response = await authAPI.deleteAccount({ password })
        localStorage.removeItem('token')
        return response.data.data
      } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to delete account')
      }
    },

    getApiKeys: async () => {
      const response = await authAPI.getApiKeys()
      return response.data.data.map(key => ({
        ...key,
        status: 'active' // Set default status for existing keys
      }))
    },
  
    generateApiKey: async () => {
      const response = await authAPI.generateApiKey()
      return {
        id: response.data.data.apiKey,
        key: response.data.data.apiKey,
        createdAt: new Date().toISOString(),
        status: 'active'
      }
    },
  
    revokeApiKey: async (keyId) => {
      const response = await authAPI.revokeApiKey(keyId)
      return response.data.data
    },
  

    logout: () => {
      localStorage.removeItem('token')
    },

    getCurrentUser: async () => {
      return await authAPI.getProfile()
    }
  }

  export default authService