package com.zahra.smsgateway.helpers

import android.telephony.SmsManager

object SMSHelper {
    fun sendSMS(phoneNo: String, message: String) {
        val smsManager = SmsManager.getDefault()
        val parts = smsManager.divideMessage(message)

        if (parts.size > 1) {
            smsManager.sendMultipartTextMessage(phoneNo, null, parts, null, null)
        } else {
            smsManager.sendTextMessage(phoneNo, null, message, null, null)
        }
    }

    fun sendSMSFromSpecificSim(phoneNo: String, message: String, simSlot: Int) {
        val smsManager = SmsManager.getSmsManagerForSubscriptionId(simSlot)
        smsManager.sendMultipartTextMessage(phoneNo, null, smsManager.divideMessage(message), null, null)
    }
}
