package com.zahra.smsgateway.services

import com.zahra.smsgateway.dtos.SMSDTO
import com.zahra.smsgateway.dtos.SMSForwardResponseDTO
import com.zahra.smsgateway.dtos.RegisterDeviceInputDTO
import com.zahra.smsgateway.dtos.RegisterDeviceResponseDTO
import retrofit2.Call
import retrofit2.http.*

interface GatewayApiService {
    @POST("gateway/devices")
    fun registerDevice(
        @Header("x-api-key") apiKey: String,
        @Body body: RegisterDeviceInputDTO
    ): Call<RegisterDeviceResponseDTO>

    @PATCH("gateway/devices/{deviceId}")
    fun updateDevice(
        @Path("deviceId") deviceId: String,
        @Header("x-api-key") apiKey: String,
        @Body body: RegisterDeviceInputDTO
    ): Call<RegisterDeviceResponseDTO>

    @POST("gateway/devices/{deviceId}/receiveSMS")
    fun sendReceivedSMS(
        @Path("deviceId") deviceId: String,
        @Header("x-api-key") apiKey: String,
        @Body body: SMSDTO
    ): Call<SMSForwardResponseDTO>
}
