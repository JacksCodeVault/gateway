export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: '/api/v1/auth/register',
    LOGIN: '/api/v1/auth/login',
    API_KEYS: '/api/v1/auth/api-keys',
    REVOKE_API_KEY: (keyId) => `/api/v1/auth/api-keys/${keyId}`,
    GOOGLE_LOGIN: '/api/v1/auth/google',
    PROFILE: '/api/v1/auth/who-am-i',
    RESET_PASSWORD: '/api/v1/auth/reset-password',
    CHANGE_PASSWORD: '/api/v1/auth/change-password',
    DELETE_ACCOUNT: '/api/v1/auth/delete-account'
  },
  GATEWAY: {
    STATS: '/api/v1/gateway/stats',
    DEVICES: '/api/v1/gateway/devices',
    DEVICE_DETAIL: (id) => `/api/v1/gateway/devices/${id}`,
    SEND_SMS: (deviceId) => `/api/v1/gateway/devices/${deviceId}/sendSMS`,
    RECEIVE_SMS: (deviceId) => `/api/v1/gateway/devices/${deviceId}/receiveSMS`,
    //GET_RECEIVED_SMS: (deviceId) => `/api/v1/gateway/devices/${deviceId}/getReceivedSMS`,
    FORWARDED_MESSAGES: (deviceId) => `/api/v1/gateway/devices/${deviceId}/forwardedMessages`
  },
  REPORTS: {
    MESSAGES: '/api/v1/reports/messages',
    DEVICES: '/api/v1/reports/devices',
    EXPORT: '/api/v1/reports/export'
  }
}

export const MESSAGE_STATUS = {
  PENDING: 'pending',
  SENT: 'sent',
  DELIVERED: 'delivered',
  FAILED: 'failed'

}
