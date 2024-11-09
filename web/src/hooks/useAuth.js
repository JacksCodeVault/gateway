import { create } from 'zustand'
import authService from '@/services/authService'

const useAuth = create((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  login: async (credentials) => {
    const data = await authService.login(credentials)
    set({ user: data.user, isAuthenticated: true, isLoading: false })
  },

  loginWithGoogle: async () => {
    const data = await authService.loginWithGoogle()
    set({ user: data.user, isAuthenticated: true })
  },

  logout: () => {
    authService.logout()
    set({ user: null, isAuthenticated: false })
  },

  register: async (userData) => {
    const data = await authService.register(userData)
    set({ user: data.user, isAuthenticated: true, isLoading: false })
  },

  checkAuth: async () => {
    const token = localStorage.getItem('token')
    if (!token) {
      set({ user: null, isAuthenticated: false, isLoading: false })
      return
    }
    
    try {
      const data = await authService.getCurrentUser()
      set({ 
        user: data.user, 
        isAuthenticated: true, 
        isLoading: false 
      })
    } catch (error) {
      localStorage.removeItem('token')
      set({ 
        user: null, 
        isAuthenticated: false, 
        isLoading: false 
      })
    }
  }
}))
export { useAuth }