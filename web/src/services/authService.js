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
  

    logout: () => {
      localStorage.removeItem('token')
    },

    getCurrentUser: async () => {
      return await authAPI.getProfile()
    }
  }

  export default authService