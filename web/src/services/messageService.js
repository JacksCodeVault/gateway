
import { deviceAPI } from '@/lib/api'

const messageService = {
  sendMessage: async (deviceId, messageData) => {
    return await deviceAPI.sendSMS(deviceId, messageData)
  }
}

export default messageService
