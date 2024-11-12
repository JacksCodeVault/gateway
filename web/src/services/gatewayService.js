import { gatewayAPI } from '@/lib/api'

const gatewayService = {
  // Stats
  getStats: async () => {
    const response = await gatewayAPI.getStats()
    return response.data
  },

  // Device Management
  registerDevice: async (deviceData) => {
    const response = await gatewayAPI.registerDevice(deviceData)
    return response.data
  },

  getDevices: async () => {
    const response = await gatewayAPI.getDevices()
    return response.data
  },

  updateDevice: async (deviceId, data) => {
    const response = await gatewayAPI.updateDevice(deviceId, data)
    return response.data
  },

  deleteDevice: async (deviceId) => {
    const response = await gatewayAPI.deleteDevice(deviceId)
    return response.data
  },

  // SMS Operations
  sendSMS: async (deviceId, messageData) => {
    const response = await gatewayAPI.sendSMS(deviceId, messageData)
    return response.data
  },

  receiveSMS: async (deviceId, messageData) => {
    const response = await gatewayAPI.receiveSMS(deviceId, messageData)
    return response.data
  },

/*   getReceivedSMS: async (deviceId) => {
    const response = await gatewayAPI.getReceivedSMS(deviceId)
    return response.data
  }, */
  getForwardedMessages: async (deviceId) => {
    const response = await gatewayAPI.getForwardedMessages(deviceId)
    return response.data
  }
}

export default gatewayService
