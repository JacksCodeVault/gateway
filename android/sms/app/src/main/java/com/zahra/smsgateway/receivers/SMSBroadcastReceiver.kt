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
import java.util.Date

class SMSBroadcastReceiver : BroadcastReceiver() {
    companion object {
        private const val TAG = "SMSBroadcastReceiver"
    }

    override fun onReceive(context: Context, intent: Intent) {
        Log.d(TAG, "📱 SMS Broadcast Received: ${intent.action}")

        if (intent.action != Telephony.Sms.Intents.SMS_RECEIVED_ACTION) {
            Log.d(TAG, "❌ Not a valid SMS intent")
            return
        }

        val messages = Telephony.Sms.Intents.getMessagesFromIntent(intent)
        if (messages == null) {
            Log.d(TAG, "❌ No messages found in intent")
            return
        }

        val deviceId = SharedPreferenceHelper.getSharedPreferenceString(
    context,
    AppConstants.SHARED_PREFS_DEVICE_ID_KEY,
    ""
)
Log.d(TAG, "Device ID length: ${deviceId.length}")

        val apiKey = SharedPreferenceHelper.getSharedPreferenceString(
            context,
            AppConstants.SHARED_PREFS_API_KEY_KEY,
            ""
        )
        val receiveSMSEnabled = SharedPreferenceHelper.getSharedPreferenceBoolean(
            context,
            AppConstants.SHARED_PREFS_RECEIVE_SMS_ENABLED_KEY,
            false
        )

        Log.d(TAG, """
            📱 Device Configuration:
            Device ID: $deviceId
            API Key: ${apiKey.take(10)}... (truncated)
            SMS Forwarding Enabled: $receiveSMSEnabled
        """.trimIndent())

        if (deviceId.isEmpty() || apiKey.isEmpty() || !receiveSMSEnabled) {
            Log.d(TAG, "❌ SMS Forwarding disabled or missing configuration")
            return
        }

        messages.forEach { message ->
            Log.d(TAG, """
                📨 New SMS Received:
                From: ${message.originatingAddress}
                Message: ${message.messageBody}
                Timestamp: ${Date(message.timestampMillis)}
                Raw Timestamp: ${message.timestampMillis}
            """.trimIndent())
        }

        val receivedSMSDTO = SMSDTO().apply {
            messages.forEach { message ->
                this.message = this.message + message.messageBody
                this.sender = message.originatingAddress ?: ""
                this.receivedAtInMillis = message.timestampMillis
            }
        }

        ApiManager.getApiService().sendReceivedSMS(deviceId, apiKey, receivedSMSDTO)
            .enqueue(object : retrofit2.Callback<SMSForwardResponseDTO> {
                override fun onResponse(
                    call: Call<SMSForwardResponseDTO>,
                    response: Response<SMSForwardResponseDTO>
                ) {
                    if (response.isSuccessful) {
                        Log.d(TAG, "✅ SMS forwarded to server successfully")
                    } else {
                        Log.e(TAG, "❌ Failed to forward SMS to server: ${response.code()}")
                    }
                }

                override fun onFailure(call: Call<SMSForwardResponseDTO>, t: Throwable) {
                    Log.e(TAG, "❌ Failed to forward SMS to server", t)
                }
            })
    }
}
