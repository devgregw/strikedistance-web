package dev.gregwhatley.strikedistance.ui.temperature

import android.Manifest
import android.content.pm.PackageManager
import android.location.Location
import android.util.Log
import androidx.activity.ComponentActivity
import androidx.activity.result.contract.ActivityResultContracts
import androidx.annotation.RequiresPermission
import androidx.lifecycle.ViewModel
import com.google.android.gms.location.CurrentLocationRequest
import com.google.android.gms.location.FusedLocationProviderClient
import com.google.android.gms.location.Granularity
import com.google.android.gms.location.LocationServices
import com.google.android.gms.location.Priority
import dev.gregwhatley.strikedistance.logic.TempUnit
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.suspendCancellableCoroutine
import kotlinx.coroutines.withContext
import kotlin.coroutines.resume
import kotlin.coroutines.resumeWithException

class LocationViewModel(private val fusedLocationClient: FusedLocationProviderClient, private val requestPermissions: suspend () -> Boolean): ViewModel() {
    class Factory(private val activity: ComponentActivity) : androidx.lifecycle.ViewModelProvider.Factory {
        @Suppress("UNCHECKED_CAST")
        override fun <T : ViewModel> create(modelClass: Class<T>): T {
            return LocationViewModel(
                fusedLocationClient = LocationServices.getFusedLocationProviderClient(activity),
                requestPermissions = {
                    withContext(Dispatchers.Main) {
                        suspendCancellableCoroutine { continuation ->
                            val permission = Manifest.permission.ACCESS_COARSE_LOCATION
                            when {
                                activity.checkSelfPermission(permission) == PackageManager.PERMISSION_GRANTED -> {
                                    // You can use the API that requires the permission.
                                    continuation.resume(true)
                                }
                                activity.shouldShowRequestPermissionRationale(permission) -> {
                                    // In an educational UI, explain to the user why your app requires this
                                    // permission for a specific feature to behave as expected, and what
                                    // features are disabled if it's declined. In this UI, include a
                                    // "cancel" or "no thanks" button that lets the user continue
                                    // using your app without granting the permission.
                                    Log.i("StrikeDistance", "Show rationale")
                                    continuation.resume(false)
                                }
                                else -> {
                                    // You can directly ask for the permission.
                                    // The registered ActivityResultCallback gets the result of this request.
                                    val request = activity.registerForActivityResult(ActivityResultContracts.RequestPermission()) { isGranted ->
                                        if (isGranted) {
                                            Log.i("StrikeDistance", "Location permission granted")
                                            continuation.resume(true)
                                        } else {
                                            Log.w("StrikeDistance", "Location permission denied")
                                            continuation.resume(false)
                                        }
                                    }
                                    request.launch(permission)
                                }
                            }
                        }}
                }
            ) as T
        }
    }

    private val _tempUnit = MutableStateFlow(TempUnit.Fahrenheit)
    val tempUnit = _tempUnit.asStateFlow()

    private val _tempValue = MutableStateFlow("70")
    val tempValue = _tempValue.asStateFlow()

    fun setTempUnit(unit: TempUnit) {
        _tempUnit.value = unit
    }

    fun setTempValue(value: String) {
        _tempValue.value = value
    }

    @RequiresPermission(allOf = [Manifest.permission.ACCESS_COARSE_LOCATION])
    suspend fun getLocation(): Location {
        return if (requestPermissions()) {
            withContext(Dispatchers.IO) {
                suspendCancellableCoroutine { continuation ->
                    val request = CurrentLocationRequest.Builder()
                        .setPriority(Priority.PRIORITY_BALANCED_POWER_ACCURACY)
                        .setGranularity(Granularity.GRANULARITY_COARSE)
                        .setDurationMillis(15_000)
                        .build()
                    fusedLocationClient.getCurrentLocation(request, null)
                        .addOnSuccessListener {
                            if (it == null)
                                continuation.resumeWithException(RuntimeException("Location request timed out"))
                            else
                                continuation.resume(it)
                        }
                        .addOnFailureListener {
                            continuation.resumeWithException(it)
                        }
                }
            }
        } else {
            throw SecurityException("Location permission not granted")
        }
    }

    fun reformatTemp() {
        val current = _tempValue.value.toDoubleOrNull() ?: return
        _tempValue.value = "%.2f".format(current)
    }
}