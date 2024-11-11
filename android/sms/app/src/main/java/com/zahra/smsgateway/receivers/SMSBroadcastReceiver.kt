package com.zahra.smsgateway.receivers

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.provider.Telephony
import android.util.Log
import com.zahra.smsgateway.ApiManager
import com.zahra.smsgateway.AppConstants
import com.zahra.smsgateway.dtos.SMSDTO
import com.zahra.smsgateway.dtos.SMSForwardResponseDTO
import com.zahra.smsgateway.helpers.SharedPreferenceHelper
import retrofit2.Call
import retrofit2.Response

class SMSBroadcastReceiver : BroadcastReceiver() {
    companion object {
        private const val TAG = "SMSBroadcastReceiver"
    }

    override fun onReceive(context: Context, intent: Intent) {
        Log.d(TAG, "onReceive: ${intent.action}")

        if (intent.action != Telephony.Sms.Intents.SMS_RECEIVED_ACTION) {
            Log.d(TAG, "Not Valid intent")
            return
        }

        val messages = Telephony.Sms.Intents.getMessagesFromIntent(intent)
        if (messages == null) {
            Log.d(TAG, "No messages found")
            return
        }

        val deviceId = SharedPreferenceHelper.getSharedPreferenceString(context, AppConstants.SHARED_PREFS_DEVICE_ID_KEY, "")
        val apiKey = SharedPreferenceHelper.getSharedPreferenceString(context, AppConstants.SHARED_PREFS_API_KEY_KEY, "")
        val receiveSMSEnabled = SharedPreferenceHelper.getSharedPreferenceBoolean(context, AppConstants.SHARED_PREFS_RECEIVE_SMS_ENABLED_KEY, false)

        if (deviceId.isEmpty() || apiKey.isEmpty() || !receiveSMSEnabled) {
            Log.d(TAG, "Device ID or API Key is empty or Receive SMS Feature is disabled")
            return
        }

        val receivedSMSDTO = SMSDTO()
        messages.forEach { message ->
            receivedSMSDTO.message = receivedSMSDTO.message + message.messageBody
            receivedSMSDTO.sender = message.originatingAddress ?: ""
            receivedSMSDTO.receivedAtInMillis = message.timestampMillis
        }

        ApiManager.getApiService().sendReceivedSMS(deviceId, apiKey, receivedSMSDTO)
            .enqueue(object : retrofit2.Callback<SMSForwardResponseDTO> {
                override fun onResponse(call: Call<SMSForwardResponseDTO>, response: Response<SMSForwardResponseDTO>) {
                    if (response.isSuccessful) {
                        Log.d(TAG, "SMS sent to server successfully")
                    } else {
                        Log.e(TAG, "Failed to send SMS to server")
                    }
                }

                override fun onFailure(call: Call<SMSForwardResponseDTO>, t: Throwable) {
                    Log.e(TAG, "Failed to send SMS to server", t)
                }
            })
    }
}
