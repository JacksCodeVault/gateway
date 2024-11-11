package com.zahra.smsgateway.dtos

data class SMSDTO(
    var sender: String = "",
    var message: String = "",
    var receivedAtInMillis: Long = 0
)
