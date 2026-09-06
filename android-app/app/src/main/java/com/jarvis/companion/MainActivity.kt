package com.jarvis.companion

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.compose.setContent
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.unit.dp
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        val bleScanner = BleScanner(this)
        val authClient = JarvisAuthClient()

        setContent {
            MaterialTheme {
                JarvisApp(bleScanner, authClient)
            }
        }
    }
}

@Composable
private fun JarvisApp(bleScanner: BleScanner, authClient: JarvisAuthClient) {
    val scope = rememberCoroutineScope()
    val devices by bleScanner.devices.collectAsState()
    var email by remember { mutableStateOf("") }
    var password by remember { mutableStateOf("") }
    var status by remember { mutableStateOf("Sign in with your Chairman account.") }
    var signedIn by remember { mutableStateOf(false) }
    var scanning by remember { mutableStateOf(false) }

    val permissionLauncher = rememberLauncherForActivityResult(
        ActivityResultContracts.RequestMultiplePermissions()
    ) { grants ->
        val granted = grants.values.all { it }
        status = if (granted) "Bluetooth access granted. Tap Scan again." else "Bluetooth permission is required to discover the watch."
    }

    Surface(modifier = Modifier.fillMaxSize()) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(20.dp),
            verticalArrangement = Arrangement.spacedBy(14.dp)
        ) {
            Text("JARVIS Companion", style = MaterialTheme.typography.headlineMedium)
            Text("Chairman access • Android • Smartwatch bridge", style = MaterialTheme.typography.bodyMedium)

            if (!signedIn) {
                OutlinedTextField(
                    value = email,
                    onValueChange = { email = it },
                    label = { Text("Email") },
                    keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Email),
                    modifier = Modifier.fillMaxWidth()
                )
                OutlinedTextField(
                    value = password,
                    onValueChange = { password = it },
                    label = { Text("Password") },
                    visualTransformation = PasswordVisualTransformation(),
                    modifier = Modifier.fillMaxWidth()
                )
                Button(
                    onClick = {
                        status = "Signing in…"
                        scope.launch {
                            val result = withContext(Dispatchers.IO) { authClient.signIn(email, password) }
                            result.onSuccess { session ->
                                val chairman = withContext(Dispatchers.IO) { authClient.verifyChairman(session.accessToken) }
                                chairman.onSuccess { ok ->
                                    signedIn = ok
                                    status = if (ok) "Chairman verified. Smartwatch tools unlocked." else "Account signed in, but Chairman access is not active."
                                }.onFailure { status = it.message ?: "Chairman verification failed." }
                            }.onFailure { status = it.message ?: "Sign-in failed." }
                        }
                    },
                    modifier = Modifier.fillMaxWidth()
                ) { Text("Sign in") }
            } else {
                Row(horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                    Button(onClick = {
                        if (!bleScanner.hasPermissions()) {
                            permissionLauncher.launch(bleScanner.requiredPermissions())
                        } else {
                            val result = bleScanner.start()
                            scanning = result.isSuccess
                            status = result.fold(
                                onSuccess = { "Scanning for nearby BLE smartwatches…" },
                                onFailure = { it.message ?: "Unable to start BLE scan." }
                            )
                        }
                    }) { Text(if (scanning) "Scan again" else "Scan watch") }

                    OutlinedButton(onClick = {
                        bleScanner.stop()
                        scanning = false
                        status = "Scan stopped."
                    }) { Text("Stop") }
                }

                Text("Nearby devices", style = MaterialTheme.typography.titleMedium)
                if (devices.isEmpty()) {
                    Text("No BLE devices found yet.")
                } else {
                    LazyColumn(
                        modifier = Modifier.weight(1f),
                        verticalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        items(devices, key = { it.address }) { device ->
                            Card(modifier = Modifier.fillMaxWidth()) {
                                Column(modifier = Modifier.padding(14.dp)) {
                                    Text(device.name, style = MaterialTheme.typography.titleSmall)
                                    Text(device.address)
                                    Text("Signal: ${device.rssi} dBm")
                                }
                            }
                        }
                    }
                }
            }

            HorizontalDivider()
            Row(verticalAlignment = Alignment.CenterVertically) {
                Text(status, style = MaterialTheme.typography.bodySmall)
            }
        }
    }
}
