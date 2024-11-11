package com.zahra.smsgateway

import com.zahra.smsgateway.services.GatewayApiService
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory

object ApiManager {
    private var apiService: GatewayApiService? = null

    fun getApiService(): GatewayApiService {
        if (apiService == null) {
            apiService = createApiService()
        }
        return apiService!!
    }

    private fun createApiService(): GatewayApiService {
        val retrofit = Retrofit.Builder()
            .baseUrl(AppConstants.API_BASE_URL)
            .addConverterFactory(GsonConverterFactory.create())
            .build()

        return retrofit.create(GatewayApiService::class.java)
    }
}
