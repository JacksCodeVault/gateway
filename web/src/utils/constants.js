
export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: '/api/v1/auth/register',
    LOGIN: '/api/v1/auth/login',
    API_KEYS: '/api/v1/auth/api-keys',
    PROFILE: '/api/v1/auth/who-am-i'
  },
  USERS: {
    PROFILE: '/api/v1/users/profile'
  },
  GATEWAY: {
    DEVICES: '/api/v1/gateway/devices',
    SEND_SMS: (deviceId) => `/api/v1/gateway/devices/${deviceId}/sendSMS`
  }
}

export const MESSAGE_STATUS = {
  PENDING: 'pending',
  DELIVERED: 'delivered',
  FAILED: 'failed'
}
