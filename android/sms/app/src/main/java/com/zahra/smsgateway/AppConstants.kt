package com.zahra.smsgateway

import android.Manifest

object AppConstants {
    const val API_BASE_URL = "https://343f-154-159-252-149.ngrok-free.app/api/v1/"
    val requiredPermissions = arrayOf(
        Manifest.permission.SEND_SMS,
        Manifest.permission.READ_SMS,
        Manifest.permission.RECEIVE_SMS,
        Manifest.permission.READ_PHONE_STATE
    )
    const val SHARED_PREFS_DEVICE_ID_KEY = "DEVICE_ID"
    const val SHARED_PREFS_API_KEY_KEY = "API_KEY"
    const val SHARED_PREFS_GATEWAY_ENABLED_KEY = "GATEWAY_ENABLED"
    const val SHARED_PREFS_PREFERRED_SIM_KEY = "PREFERRED_SIM"
    const val SHARED_PREFS_RECEIVE_SMS_ENABLED_KEY = "RECEIVE_SMS_ENABLED"
    const val SHARED_PREFS_TRACK_SENT_SMS_STATUS_KEY = "TRACK_SENT_SMS_STATUS"
}
