package com.zahra.smsgateway.activities

import android.annotation.SuppressLint
import android.content.ClipData
import android.content.ClipboardManager
import android.content.Context
import android.content.Intent
import android.os.Build
import android.os.Bundle
import android.util.Log
import android.widget.*
import androidx.appcompat.app.AppCompatActivity
import androidx.core.app.ActivityCompat
import com.google.android.material.snackbar.Snackbar
import com.google.firebase.messaging.BuildConfig
import com.google.firebase.messaging.FirebaseMessaging
import com.zahra.smsgateway.*
import com.zahra.smsgateway.dtos.RegisterDeviceInputDTO
import com.zahra.smsgateway.dtos.RegisterDeviceResponseDTO
import com.zahra.smsgateway.helpers.SharedPreferenceHelper
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response



class MainActivity : AppCompatActivity() {
    @SuppressLint("UseSwitchCompatOrMaterialCode")
    private lateinit var gatewaySwitch: Switch
    @SuppressLint("UseSwitchCompatOrMaterialCode")
    private lateinit var receiveSMSSwitch: Switch
    private lateinit var apiKeyEditText: EditText
    private lateinit var registerDeviceBtn: Button
    private lateinit var grantSMSPermissionBtn: Button
    private lateinit var copyDeviceIdImgBtn: ImageButton
    private lateinit var deviceBrandAndModelTxt: TextView
    private lateinit var deviceIdTxt: TextView
    private lateinit var defaultSimSlotRadioGroup: RadioGroup

    private var deviceId: String? = null
    private val context: Context by lazy { applicationContext }

    companion object {
        private const val PERMISSION_REQUEST_CODE = 0
        private const val TAG = "MainActivity"
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        initializeViews()
        setupInitialState()
        setupClickListeners()
        checkPermissions()
        renderSimOptions()
    }

    private fun initializeViews() {
        gatewaySwitch = findViewById(R.id.gatewaySwitch)
        receiveSMSSwitch = findViewById(R.id.receiveSMSSwitch)
        apiKeyEditText = findViewById(R.id.apiKeyEditText)
        registerDeviceBtn = findViewById(R.id.registerDeviceBtn)
        grantSMSPermissionBtn = findViewById(R.id.grantSMSPermissionBtn)
        deviceBrandAndModelTxt = findViewById(R.id.deviceBrandAndModelTxt)
        deviceIdTxt = findViewById(R.id.deviceIdTxt)
        copyDeviceIdImgBtn = findViewById(R.id.copyDeviceIdImgBtn)
        defaultSimSlotRadioGroup = findViewById(R.id.defaultSimSlotRadioGroup)
    }

    @SuppressLint("SetTextI18n")
    private fun setupInitialState() {
        deviceId = SharedPreferenceHelper.getSharedPreferenceString(context, AppConstants.SHARED_PREFS_DEVICE_ID_KEY, "")
        deviceIdTxt.text = deviceId
        deviceBrandAndModelTxt.text = "${Build.BRAND} ${Build.MODEL}"
        
        // Ensure receive SMS is properly initialized
        val receiveSMSEnabled = SharedPreferenceHelper.getSharedPreferenceBoolean(
            context, 
            AppConstants.SHARED_PREFS_RECEIVE_SMS_ENABLED_KEY, 
            false
        )
        receiveSMSSwitch.isChecked = receiveSMSEnabled
        Log.d(TAG, "Initial Receive SMS State: $receiveSMSEnabled")
    }
    

    private fun setupClickListeners() {
        copyDeviceIdImgBtn.setOnClickListener { copyDeviceId() }
        gatewaySwitch.setOnCheckedChangeListener { button, isChecked -> handleGatewaySwitchChange(button, isChecked) }
        receiveSMSSwitch.setOnCheckedChangeListener { button, isChecked -> handleReceiveSMSChange(button, isChecked) }
        registerDeviceBtn.setOnClickListener { handleRegisterDevice() }
    }

    @SuppressLint("SetTextI18n")
    private fun checkPermissions() {
        val missingPermissions = AppConstants.requiredPermissions.filter { permission ->
            !Utils.isPermissionGranted(context, permission)
        }

        if (missingPermissions.isEmpty()) {
            grantSMSPermissionBtn.isEnabled = false
            grantSMSPermissionBtn.text = "Permission Granted"
            renderSimOptions()
        } else {
            grantSMSPermissionBtn.isEnabled = true
            grantSMSPermissionBtn.setOnClickListener {
                ActivityCompat.requestPermissions(
                    this,
                    missingPermissions.toTypedArray(),
                    PERMISSION_REQUEST_CODE
                )
            }
        }
    }

    @SuppressLint("ResourceType", "SetTextI18n")
    private fun renderSimOptions() {
        try {
            defaultSimSlotRadioGroup.removeAllViews()
            val defaultSimSlotRadioBtn = RadioButton(context).apply {
                text = "Device Default"
                id = 123456
            }
            defaultSimSlotRadioGroup.addView(defaultSimSlotRadioBtn)

            Utils.getAvailableSimSlots(context).forEach { subscriptionInfo ->
                val simInfo = "SIM ${subscriptionInfo.simSlotIndex + 1} (${subscriptionInfo.displayName})"
                RadioButton(context).apply {
                    text = simInfo
                    id = subscriptionInfo.subscriptionId
                    defaultSimSlotRadioGroup.addView(this)
                }
            }

            val preferredSim = SharedPreferenceHelper.getSharedPreferenceInt(context, AppConstants.SHARED_PREFS_PREFERRED_SIM_KEY, -1)
            if (preferredSim == -1) {
                defaultSimSlotRadioGroup.check(defaultSimSlotRadioBtn.id)
            } else {
                defaultSimSlotRadioGroup.check(preferredSim)
            }

            defaultSimSlotRadioGroup.setOnCheckedChangeListener { _, checkedId ->
                findViewById<RadioButton>(checkedId)?.let { radioButton ->
                    if (radioButton.text == "Device Default") {
                        SharedPreferenceHelper.clearSharedPreference(context, AppConstants.SHARED_PREFS_PREFERRED_SIM_KEY)
                    } else {
                        SharedPreferenceHelper.setSharedPreferenceInt(context, AppConstants.SHARED_PREFS_PREFERRED_SIM_KEY, radioButton.id)
                    }
                }
            }
        } catch (e: Exception) {
            Log.e(TAG, "SIM_SLOT_ERROR ${e.message}")
        }
    }

    private fun copyDeviceId() {
        val clipboard = getSystemService(Context.CLIPBOARD_SERVICE) as ClipboardManager
        val clip = ClipData.newPlainText("Device ID", deviceId)
        clipboard.setPrimaryClip(clip)
        Snackbar.make(copyDeviceIdImgBtn, "Copied", Snackbar.LENGTH_LONG).show()
    }

    private fun handleGatewaySwitchChange(button: CompoundButton, isChecked: Boolean) {
        button.isEnabled = false
        val input = RegisterDeviceInputDTO().apply {
            enabled = isChecked
            appVersionCode = 1
            appVersionName = BuildConfig.VERSION_NAME

        }

        ApiManager.getApiService().updateDevice(deviceId!!, apiKeyEditText.text.toString(), input)
            .enqueue(object : Callback<RegisterDeviceResponseDTO> {
                override fun onResponse(call: Call<RegisterDeviceResponseDTO>, response: Response<RegisterDeviceResponseDTO>) {
                    if (!response.isSuccessful) {
                        Snackbar.make(button.rootView, response.message(), Snackbar.LENGTH_LONG).show()
                        button.isEnabled = true
                        return
                    }
                    SharedPreferenceHelper.setSharedPreferenceBoolean(context, AppConstants.SHARED_PREFS_GATEWAY_ENABLED_KEY, isChecked)
                    button.isChecked = response.body()?.data?.get("enabled") as Boolean
                    button.isEnabled = true
                }

                override fun onFailure(call: Call<RegisterDeviceResponseDTO>, t: Throwable) {
                    Snackbar.make(button.rootView, "An error occurred", Snackbar.LENGTH_LONG).show()
                    button.isEnabled = true
                }
            })
    }

    private fun handleReceiveSMSChange(button: CompoundButton, isChecked: Boolean) {
        Log.d(TAG, """
            📱 Receive SMS Toggle Changed:
            New State: ${if(isChecked) "Enabled" else "Disabled"}
            Device ID: ${deviceId ?: "Not Set"}
            API Key: ${apiKeyEditText.text}
        """.trimIndent())

        SharedPreferenceHelper.setSharedPreferenceBoolean(
            context,
            AppConstants.SHARED_PREFS_RECEIVE_SMS_ENABLED_KEY,
            isChecked
        )
        button.isChecked = isChecked
    }

    @SuppressLint("SetTextI18n")
    private fun handleRegisterDevice() {
        registerDeviceBtn.isEnabled = false
        registerDeviceBtn.text = "Loading..."

        FirebaseMessaging.getInstance().token.addOnCompleteListener { task ->
            if (!task.isSuccessful) {
                Snackbar.make(registerDeviceBtn, "Failed to obtain FCM Token", Snackbar.LENGTH_LONG).show()
                registerDeviceBtn.isEnabled = true
                registerDeviceBtn.text = "Update"
                return@addOnCompleteListener
            }

            val registerDeviceInput = RegisterDeviceInputDTO().apply {
                enabled = true
                fcmToken = task.result
                brand = Build.BRAND
                manufacturer = Build.MANUFACTURER
                model = Build.MODEL
                buildId = Build.ID
                os = Build.VERSION.BASE_OS
                appVersionCode = 1
                appVersionName = BuildConfig.VERSION_NAME
            }

            ApiManager.getApiService().registerDevice(apiKeyEditText.text.toString(), registerDeviceInput)
                .enqueue(object : Callback<RegisterDeviceResponseDTO> {
                    override fun onResponse(call: Call<RegisterDeviceResponseDTO>, response: Response<RegisterDeviceResponseDTO>) {
                        handleRegisterDeviceResponse(response)
                    }

                    @SuppressLint("SetTextI18n")
                    override fun onFailure(call: Call<RegisterDeviceResponseDTO>, t: Throwable) {
                        Snackbar.make(registerDeviceBtn, "An error occurred", Snackbar.LENGTH_LONG).show()
                        registerDeviceBtn.isEnabled = true
                        registerDeviceBtn.text = "Update"
                    }
                })
        }
    }

    @SuppressLint("SetTextI18n")
    private fun handleRegisterDeviceResponse(response: Response<RegisterDeviceResponseDTO>) {
        if (!response.isSuccessful) {
            Snackbar.make(registerDeviceBtn, response.message(), Snackbar.LENGTH_LONG).show()
            registerDeviceBtn.isEnabled = true
            registerDeviceBtn.text = "Update"
            return
        }
    
        // Extract device ID from response
        val deviceId = response.body()?.data?.get("id").toString()
        Log.d(TAG, "Received Device ID: $deviceId")
    
        // Save API Key
        SharedPreferenceHelper.setSharedPreferenceString(
            context, 
            AppConstants.SHARED_PREFS_API_KEY_KEY, 
            apiKeyEditText.text.toString()
        )
    
        // Save device ID
        SharedPreferenceHelper.setSharedPreferenceString(
            context,
            AppConstants.SHARED_PREFS_DEVICE_ID_KEY,
            deviceId
        )
    
        // Update UI
        deviceIdTxt.text = deviceId
        registerDeviceBtn.isEnabled = true
        registerDeviceBtn.text = "Update"
    
        Snackbar.make(registerDeviceBtn, "Device Registration Successful", Snackbar.LENGTH_LONG).show()
    }
    

    override fun onRequestPermissionsResult(requestCode: Int, permissions: Array<String>, grantResults: IntArray) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults)
        if (requestCode == PERMISSION_REQUEST_CODE) {
            checkPermissions()
        }
    }
}
