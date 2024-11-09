
import api from '@/lib/api'

const statsService = {
  getStats: async () => {
    return await api.get('/api/v1/stats')
  }
}

export default statsService
