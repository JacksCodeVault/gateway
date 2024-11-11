package com.zahra.smsgateway.services

import android.app.*
import android.content.Context
import android.content.Intent
import android.media.RingtoneManager
import android.os.Build
import android.util.Log
import androidx.core.app.NotificationCompat
import com.google.firebase.messaging.FirebaseMessagingService
import com.google.firebase.messaging.RemoteMessage
import com.google.gson.Gson
import com.zahra.smsgateway.AppConstants
import com.zahra.smsgateway.R
import com.zahra.smsgateway.activities.MainActivity
import com.zahra.smsgateway.helpers.SMSHelper
import com.zahra.smsgateway.helpers.SharedPreferenceHelper
import com.zahra.smsgateway.models.SMSPayload

class FCMService : FirebaseMessagingService() {
    companion object {
        private const val TAG = "FirebaseMessagingService"
        private const val DEFAULT_NOTIFICATION_CHANNEL_ID = "N1"
    }

    override fun onMessageReceived(remoteMessage: RemoteMessage) {
        Log.d(TAG, remoteMessage.data.toString())

        val gson = Gson()
        val smsPayload = gson.fromJson(remoteMessage.data["smsData"], SMSPayload::class.java)

        if (remoteMessage.data.isNotEmpty()) {
            val preferredSim = SharedPreferenceHelper.getSharedPreferenceInt(
                this,
                AppConstants.SHARED_PREFS_PREFERRED_SIM_KEY,
                -1
            )

            smsPayload.recipients.forEach { receiver ->
                try {
                    if (preferredSim == -1) {
                        SMSHelper.sendSMS(receiver, smsPayload.message)
                    } else {
                        SMSHelper.sendSMSFromSpecificSim(receiver, smsPayload.message, preferredSim)
                    }
                } catch (e: Exception) {
                    Log.d("SMS_SEND_ERROR", e.message ?: "Unknown error")
                }
            }
        }
    }

    override fun onNewToken(token: String) {
        sendRegistrationToServer(token)
    }

    private fun sendRegistrationToServer(token: String) {
        // Implementation for sending token to server
    }

    private fun sendNotification(title: String, messageBody: String) {
        val intent = Intent(this, MainActivity::class.java).apply {
            addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP)
        }

        val pendingIntent = PendingIntent.getActivity(
            this, 0, intent,
            PendingIntent.FLAG_ONE_SHOT or PendingIntent.FLAG_IMMUTABLE
        )

        val channelId = DEFAULT_NOTIFICATION_CHANNEL_ID
        val defaultSoundUri = RingtoneManager.getDefaultUri(RingtoneManager.TYPE_NOTIFICATION)

        val notificationBuilder = NotificationCompat.Builder(this, DEFAULT_NOTIFICATION_CHANNEL_ID)
            .setSmallIcon(R.drawable.ic_launcher_foreground)
            .setContentTitle(title)
            .setContentText(messageBody)
            .setAutoCancel(true)
            .setSound(defaultSoundUri)
            .setContentIntent(pendingIntent)

        val notificationManager = getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(
                channelId,
                "Channel human readable title",
                NotificationManager.IMPORTANCE_DEFAULT
            )
            notificationManager.createNotificationChannel(channel)
        }

        notificationManager.notify(0, notificationBuilder.build())
    }
}
