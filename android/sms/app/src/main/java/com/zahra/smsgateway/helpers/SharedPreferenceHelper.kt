package com.zahra.smsgateway.helpers

import android.content.Context

object SharedPreferenceHelper {
    private const val PREF_FILE = "PREF"

    fun setSharedPreferenceString(context: Context, key: String, value: String) {
        context.getSharedPreferences(PREF_FILE, 0).edit().apply {
            putString(key, value)
            apply()
        }
    }

    fun setSharedPreferenceInt(context: Context, key: String, value: Int) {
        context.getSharedPreferences(PREF_FILE, 0).edit().apply {
            putInt(key, value)
            apply()
        }
    }

    fun setSharedPreferenceBoolean(context: Context, key: String, value: Boolean) {
        context.getSharedPreferences(PREF_FILE, 0).edit().apply {
            putBoolean(key, value)
            apply()
        }
    }

    fun getSharedPreferenceString(context: Context, key: String, defValue: String): String {
        return context.getSharedPreferences(PREF_FILE, 0).getString(key, defValue) ?: defValue
    }

    fun getSharedPreferenceInt(context: Context, key: String, defValue: Int): Int {
        return context.getSharedPreferences(PREF_FILE, 0).getInt(key, defValue)
    }

    fun getSharedPreferenceBoolean(context: Context, key: String, defValue: Boolean): Boolean {
        return context.getSharedPreferences(PREF_FILE, 0).getBoolean(key, defValue)
    }

    fun clearSharedPreference(context: Context, key: String) {
        context.getSharedPreferences(PREF_FILE, 0).edit().apply {
            remove(key)
            apply()
        }
    }
}
