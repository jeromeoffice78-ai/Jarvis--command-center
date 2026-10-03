package com.jarvis.companion

import android.bluetooth.BluetoothAdapter
import android.content.Intent
import android.net.Uri
import android.os.Build
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.compose.setContent
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.unit.dp
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext

private const val WEB = "https://jarvis-command-hub-jerome.lovable.app"

class MainActivity : ComponentActivity() {
    private var callback by mutableStateOf<Uri?>(null)
    override fun onCreate(state: Bundle?) {
        super.onCreate(state)
        callback = intent?.data
        setContent { MaterialTheme { JarvisApp(BleScanner(this), JarvisAuthClient(), callback) } }
    }
    override fun onNewIntent(intent: Intent) {
        super.onNewIntent(intent); setIntent(intent); callback = intent.data
    }
}

private enum class Screen { Chat, Watch, Settings, Diagnostics }

@Composable
private fun JarvisApp(scanner: BleScanner, auth: JarvisAuthClient, callback: Uri?) {
    val ctx = LocalContext.current
    val scope = rememberCoroutineScope()
    val devices by scanner.devices.collectAsState()
    var screen by remember { mutableStateOf(Screen.Chat) }
    var signedIn by remember { mutableStateOf(false) }
    var scanning by remember { mutableStateOf(false) }
    var status by remember { mutableStateOf("Sign in with your Chairman Google account.") }
    var email by remember { mutableStateOf("") }
    var password by remember { mutableStateOf("") }
    var voice by remember { mutableStateOf(true) }
    var autoListen by remember { mutableStateOf(false) }

    LaunchedEffect(callback) {
        val uri = callback ?: return@LaunchedEffect
        if (uri.scheme == "jarviscompanion" && uri.host == "auth") {
            status = "Google verified. Checking Chairman authorization…"
            auth.sessionFromRedirect(uri).onSuccess { s ->
                scope.launch {
                    auth.verifyChairman(s.accessToken).onSuccess { ok ->
                        signedIn = ok
                        status = if (ok) "Chairman access authorized." else "Account is not an active Chairman profile."
                    }.onFailure { status = it.message ?: "Chairman verification failed." }
                }
            }.onFailure { status = it.message ?: "Google sign-in failed." }
        }
    }

    val permissions = rememberLauncherForActivityResult(
        ActivityResultContracts.RequestMultiplePermissions()
    ) { grants ->
        status = if (grants.values.all { it }) "Bluetooth granted. Scan again." else "Bluetooth permission is required."
    }

    Column(Modifier.fillMaxSize()) {
        Box(Modifier.weight(1f).fillMaxWidth()) {
            when (screen) {
                Screen.Chat -> {
                    Column(Modifier.fillMaxSize().padding(20.dp), verticalArrangement = Arrangement.spacedBy(12.dp)) {
                        Text("JARVIS", style = MaterialTheme.typography.headlineLarge)
                        Text("Command Center")
                        if (!signedIn) {
                            Button(onClick = {
                                status = "Opening Google verification…"
                                ctx.startActivity(Intent(Intent.ACTION_VIEW, Uri.parse(auth.googleOAuthUrl())))
                            }, Modifier.fillMaxWidth()) { Text("Continue with Google") }
                            Text("Chairman Google account: ${BuildConfig.CHAIRMAN_GOOGLE_EMAIL}")
                            OutlinedTextField(email, { email = it }, label = { Text("Email") }, Modifier.fillMaxWidth())
                            OutlinedTextField(password, { password = it }, label = { Text("Password") }, Modifier.fillMaxWidth())
                            OutlinedButton(onClick = {
                                scope.launch {
                                    status = "Signing in…"
                                    auth.signIn(email, password).onSuccess { s ->
                                        auth.verifyChairman(s.accessToken).onSuccess { ok ->
                                            signedIn = ok
                                            status = if (ok) "Chairman verified." else "Chairman access is not active."
                                        }.onFailure { status = it.message ?: "Chairman verification failed." }
                                    }.onFailure { status = it.message ?: "Sign-in failed." }
                                }
                            }, Modifier.fillMaxWidth()) { Text("Sign in with password") }
                        } else {
                            Text("Chairman access is active.", color = MaterialTheme.colorScheme.primary)
                            Button(onClick = { ctx.startActivity(Intent(Intent.ACTION_VIEW, Uri.parse(WEB))) }, Modifier.fillMaxWidth()) {
                                Text("Open Jarvis AI Command Center")
                            }
                        }
                        HorizontalDivider()
                        Text(status)
                    }
                }
                Screen.Watch -> {
                    Column(Modifier.fillMaxSize().padding(20.dp), verticalArrangement = Arrangement.spacedBy(10.dp)) {
                        Text("Smartwatch Bridge", style = MaterialTheme.typography.headlineMedium)
                        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                            Button(onClick = {
                                if (!scanner.hasPermissions()) permissions.launch(scanner.requiredPermissions())
                                else scanner.start().fold(
                                    { scanning = true; status = "Scanning for BLE smartwatches…" },
                                    { status = it.message ?: "BLE scan failed." }
                                )
                            }) { Text(if (scanning) "Scan again" else "Scan watch") }
                            OutlinedButton(onClick = { scanner.stop(); scanning = false; status = "Scan stopped." }) { Text("Stop") }
                        }
                        if (devices.isEmpty()) Text("No BLE devices found. Put the watch in discovery mode and scan.")
                        else LazyColumn(Modifier.fillMaxWidth().weight(1f), verticalArrangement = Arrangement.spacedBy(8.dp)) {
                            items(devices, key = { it.address }) { d ->
                                Card(Modifier.fillMaxWidth()) { Column(Modifier.padding(14.dp)) {
                                    Text(d.name, style = MaterialTheme.typography.titleMedium)
                                    Text(d.address); Text("Signal: ${d.rssi} dBm")
                                }}
                            }
                        }
                        Text(status)
                    }
                }
                Screen.Settings -> {
                    Column(Modifier.fillMaxSize().padding(20.dp), verticalArrangement = Arrangement.spacedBy(12.dp)) {
                        Text("Settings", style = MaterialTheme.typography.headlineMedium)
                        Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) { Text("Spoken replies"); Switch(voice, { voice = it }) }
                        Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) { Text("Auto-listen"); Switch(autoListen, { autoListen = it }) }
                        HorizontalDivider()
                        Text("Full web settings are available from the Command Center.")
                        Button(onClick = { ctx.startActivity(Intent(Intent.ACTION_VIEW, Uri.parse("${WEB}/settings"))) }, Modifier.fillMaxWidth()) { Text("Open Web Settings") }
                    }
                }
                Screen.Diagnostics -> {
                    Column(Modifier.fillMaxSize().padding(20.dp), verticalArrangement = Arrangement.spacedBy(10.dp)) {
                        Text("Diagnostics", style = MaterialTheme.typography.headlineMedium)
                        Text("Android SDK: ${Build.VERSION.SDK_INT}")
                        Text("Chairman authorization: ${if (signedIn) "OK" else "Not signed in"}")
                        Text("Bluetooth permissions: ${if (scanner.hasPermissions()) "Available" else "Not granted"}")
                        Text("Bluetooth radio: ${if (BluetoothAdapter.getDefaultAdapter()?.isEnabled == true) "Enabled" else "Disabled"}")
                        Text("BLE scan: ${if (scanning) "Running" else "Stopped"}")
                        Text("Nearby devices: ${devices.size}")
                        Text("OAuth redirect: ${BuildConfig.OAUTH_REDIRECT_URI}")
                        HorizontalDivider()
                        Text(status)
                    }
                }
            }
        }
        NavigationBar {
            Screen.entries.forEach { s ->
                NavigationBarItem(selected = screen == s, onClick = { screen = s }, icon = { Text(s.name.take(1)) }, label = { Text(s.name) })
            }
        }
    }
}
