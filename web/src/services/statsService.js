import { gatewayAPI } from '@/lib/api'

const statsService = {
  getStats: async () => {
    const response = await gatewayAPI.getStats()
    return response.data.data
  }
}

export default statsService
