package com.zahra.smsgateway.models

data class SMSPayload(
    var recipients: Array<String> = arrayOf(),
    var message: String = "",
    // Legacy fields that are no longer used
    var receivers: Array<String> = arrayOf(),
    var smsBody: String = ""
) {
    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (javaClass != other?.javaClass) return false

        other as SMSPayload

        if (!recipients.contentEquals(other.recipients)) return false
        if (message != other.message) return false
        if (!receivers.contentEquals(other.receivers)) return false
        if (smsBody != other.smsBody) return false

        return true
    }

    override fun hashCode(): Int {
        var result = recipients.contentHashCode()
        result = 31 * result + message.hashCode()
        result = 31 * result + receivers.contentHashCode()
        result = 31 * result + smsBody.hashCode()
        return result
    }
}
