package com.zahra.smsgateway

import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import android.os.Build
import android.telephony.SubscriptionInfo
import android.telephony.SubscriptionManager
import androidx.core.app.ActivityCompat
import androidx.core.content.ContextCompat
import com.zahra.smsgateway.services.StickyNotificationService

object Utils {
    fun isPermissionGranted(context: Context, permission: String): Boolean {
        return ContextCompat.checkSelfPermission(context, permission) == PackageManager.PERMISSION_GRANTED
    }

    fun getAvailableSimSlots(context: Context): List<SubscriptionInfo> {
        if (ActivityCompat.checkSelfPermission(context, android.Manifest.permission.READ_PHONE_STATE) != PackageManager.PERMISSION_GRANTED) {
            return emptyList()
        }

        return SubscriptionManager.from(context).activeSubscriptionInfoList ?: emptyList()
    }

    fun startStickyNotificationService(context: Context) {
        if (!isPermissionGranted(context, android.Manifest.permission.RECEIVE_SMS)) {
            return
        }

        val notificationIntent = Intent(context, StickyNotificationService::class.java)
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            context.startForegroundService(notificationIntent)
        } else {
            context.startService(notificationIntent)
        }
    }

    fun stopStickyNotificationService(context: Context) {
        val notificationIntent = Intent(context, StickyNotificationService::class.java)
        context.stopService(notificationIntent)
    }
}
