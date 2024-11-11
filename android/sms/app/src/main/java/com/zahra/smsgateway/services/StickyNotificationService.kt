package com.zahra.smsgateway.services

import android.app.*
import android.content.Context
import android.content.Intent
import android.os.IBinder
import android.util.Log
import androidx.core.app.NotificationCompat
import com.zahra.smsgateway.R
import com.zahra.smsgateway.activities.MainActivity

class StickyNotificationService : Service() {
    companion object {
        private const val TAG = "StickyNotificationService"
        private const val DEFAULT_NOTIFICATION_CHANNEL_ID = "N1"
    }

    override fun onBind(intent: Intent): IBinder? {
        Log.i(TAG, "Service onBind ${intent.action}")
        return null
    }

    override fun onCreate() {
        super.onCreate()
        Log.i(TAG, "Service Started")
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        Log.i(TAG, "Received start id $startId: $intent")
        return START_STICKY
    }

    override fun onDestroy() {
        super.onDestroy()
        Log.i(TAG, "StickyNotificationService destroyed")
    }

    private fun createNotification(): Notification {
        val notificationChannelId = "stickyNotificationChannel"
        val notificationManager = getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager

        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.O) {
            val channel = NotificationChannel(
                notificationChannelId,
                notificationChannelId,
                NotificationManager.IMPORTANCE_HIGH
            ).apply {
                enableVibration(false)
                setShowBadge(false)
            }
            notificationManager.createNotificationChannel(channel)

            val notificationIntent = Intent(this, MainActivity::class.java)
            val pendingIntent = PendingIntent.getActivity(
                this, 0, notificationIntent,
                PendingIntent.FLAG_IMMUTABLE or PendingIntent.FLAG_UPDATE_CURRENT
            )

            return Notification.Builder(this, notificationChannelId)
                .setContentTitle("SMS Gateway is running")
                .setContentText("SMS Gateway is running in the background.")
                .setContentIntent(pendingIntent)
                .setOngoing(true)
                .setSmallIcon(R.drawable.ic_launcher_foreground)
                .build()
        }

        return NotificationCompat.Builder(this, notificationChannelId)
            .setContentTitle("SMS Gateway is running")
            .setContentText("SMS Gateway is running in the background.")
            .setOngoing(true)
            .setSmallIcon(R.drawable.ic_launcher_foreground)
            .build()
    }
}
