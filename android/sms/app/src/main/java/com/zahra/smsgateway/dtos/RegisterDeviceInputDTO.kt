package com.zahra.smsgateway.dtos

data class RegisterDeviceInputDTO(
    var enabled: Boolean = false,
    var fcmToken: String? = null,
    var brand: String? = null,
    var manufacturer: String? = null,
    var model: String? = null,
    var serial: String? = null,
    var buildId: String? = null,
    var os: String? = null,
    var osVersion: String? = null,
    var appVersionName: String? = null,
    var appVersionCode: Int = 0  // Changed to Int type
)

