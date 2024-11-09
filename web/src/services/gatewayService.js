
import { deviceAPI } from '@/lib/api'

const gatewayService = {
  registerDevice: async (deviceData) => {
    return await deviceAPI.register(deviceData)
  },

  getDevices: async () => {
    return await deviceAPI.getDevices()
  },

  sendSMS: async (deviceId, messageData) => {
    return await deviceAPI.sendSMS(deviceId, messageData)
  }
}

export default gatewayService
