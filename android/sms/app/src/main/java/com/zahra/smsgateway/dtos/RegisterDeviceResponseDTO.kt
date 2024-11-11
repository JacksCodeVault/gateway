package com.zahra.smsgateway.dtos

data class RegisterDeviceResponseDTO(
    val success: Boolean = false,
    val data: Map<String, Any>? = null,
    val error: String? = null
)
