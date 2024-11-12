import { gatewayAPI } from '@/lib/api'

const messageService = {
  /* sendMessage: async (deviceId, messageData) => {
    const response = await gatewayAPI.sendMessage(deviceId, messageData)
    return response.data
  },

  getMessages: async (deviceId) => {
    const response = await gatewayAPI.getMessages(deviceId)
    return response.data
  },

  getReceivedMessages: async (deviceId) => {
    const response = await gatewayAPI.getReceivedMessages(deviceId)
    return response.data
  } */
}

export default messageService
