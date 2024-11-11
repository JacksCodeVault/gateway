package com.zahra.smsgateway.dtos

data class SMSForwardResponseDTO(
    val success: Boolean = false,
    val message: String? = null,
    val data: Map<String, Any>? = null
)
