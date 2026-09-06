package com.jarvis.companion

import android.Manifest
import android.annotation.SuppressLint
import android.bluetooth.BluetoothAdapter
import android.bluetooth.BluetoothDevice
import android.bluetooth.BluetoothManager
import android.bluetooth.le.ScanCallback
import android.bluetooth.le.ScanResult
import android.content.Context
import android.content.pm.PackageManager
import android.os.Build
import androidx.core.content.ContextCompat
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow

class BleScanner(private val context: Context) {
    data class DeviceInfo(val name: String, val address: String, val rssi: Int)

    private val bluetoothManager = context.getSystemService(BluetoothManager::class.java)
    private val adapter: BluetoothAdapter? get() = bluetoothManager?.adapter
    private val _devices = MutableStateFlow<List<DeviceInfo>>(emptyList())
    val devices: StateFlow<List<DeviceInfo>> = _devices.asStateFlow()

    private val callback = object : ScanCallback() {
        @SuppressLint("MissingPermission")
        override fun onScanResult(callbackType: Int, result: ScanResult) {
            val d: BluetoothDevice = result.device
            val name = runCatching { d.name }.getOrNull().orEmpty().ifBlank { "Unknown BLE device" }
            val item = DeviceInfo(name, d.address, result.rssi)
            _devices.value = (_devices.value.filterNot { it.address == item.address } + item)
                .sortedByDescending { it.rssi }
        }
    }

    fun requiredPermissions(): Array<String> = when {
        Build.VERSION.SDK_INT >= Build.VERSION_CODES.S -> arrayOf(
            Manifest.permission.BLUETOOTH_SCAN,
            Manifest.permission.BLUETOOTH_CONNECT
        )
        else -> arrayOf(Manifest.permission.ACCESS_FINE_LOCATION)
    }

    fun hasPermissions(): Boolean = requiredPermissions().all {
        ContextCompat.checkSelfPermission(context, it) == PackageManager.PERMISSION_GRANTED
    }

    @SuppressLint("MissingPermission")
    fun start(): Result<Unit> = runCatching {
        check(hasPermissions()) { "Bluetooth permission required" }
        val a = adapter ?: error("Bluetooth is unavailable on this device")
        check(a.isEnabled) { "Turn Bluetooth on first" }
        _devices.value = emptyList()
        a.bluetoothLeScanner?.startScan(callback) ?: error("BLE scanner unavailable")
    }

    @SuppressLint("MissingPermission")
    fun stop() {
        if (!hasPermissions()) return
        runCatching { adapter?.bluetoothLeScanner?.stopScan(callback) }
    }
}
