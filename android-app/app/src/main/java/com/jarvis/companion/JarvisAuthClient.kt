package com.jarvis.companion

import android.net.Uri
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.RequestBody.Companion.toRequestBody
import org.json.JSONArray
import org.json.JSONObject
import java.net.URLEncoder
import java.nio.charset.StandardCharsets

class JarvisAuthClient(
    private val http: OkHttpClient = OkHttpClient()
) {
    data class Session(val accessToken: String, val refreshToken: String?, val email: String?)

    fun googleOAuthUrl(): String {
        val redirect = URLEncoder.encode(BuildConfig.OAUTH_REDIRECT_URI, StandardCharsets.UTF_8.toString())
        return "${BuildConfig.SUPABASE_URL}/auth/v1/authorize?provider=google&redirect_to=$redirect"
    }

    fun sessionFromRedirect(uri: Uri): Result<Session> = runCatching {
        require(uri.scheme == "jarviscompanion" && uri.host == "auth") { "Invalid OAuth callback" }
        val params = mutableMapOf<String, String>()
        val raw = uri.fragment.orEmpty()
        raw.split('&').forEach { pair ->
            val parts = pair.split('=', limit = 2)
            if (parts.size == 2) params[parts[0]] = Uri.decode(parts[1])
        }
        params["error_description"]?.let { error(it) }
        val token = params["access_token"].orEmpty()
        require(token.isNotBlank()) { "Google sign-in did not return a session" }
        Session(
            accessToken = token,
            refreshToken = params["refresh_token"],
            email = null
        )
    }

    fun signIn(email: String, password: String): Result<Session> = runCatching {
        require(email.isNotBlank()) { "Email is required" }
        require(password.isNotBlank()) { "Password is required" }

        val body = JSONObject()
            .put("email", email.trim())
            .put("password", password)
            .toString()
            .toRequestBody("application/json".toMediaType())

        val request = Request.Builder()
            .url("${BuildConfig.SUPABASE_URL}/auth/v1/token?grant_type=password")
            .addHeader("apikey", BuildConfig.SUPABASE_PUBLISHABLE_KEY)
            .addHeader("Content-Type", "application/json")
            .post(body)
            .build()

        http.newCall(request).execute().use { response ->
            val text = response.body?.string().orEmpty()
            val json = runCatching { JSONObject(text) }.getOrElse { JSONObject() }
            if (!response.isSuccessful) {
                error(json.optString("msg", json.optString("message", "Sign-in failed")))
            }
            val token = json.optString("access_token")
            check(token.isNotBlank()) { "No access token returned" }
            Session(
                accessToken = token,
                refreshToken = json.optString("refresh_token").ifBlank { null },
                email = json.optJSONObject("user")?.optString("email")?.ifBlank { null }
            )
        }
    }

    fun verifyChairman(accessToken: String): Result<Boolean> = runCatching {
        val userRequest = Request.Builder()
            .url("${BuildConfig.SUPABASE_URL}/auth/v1/user")
            .addHeader("apikey", BuildConfig.SUPABASE_PUBLISHABLE_KEY)
            .addHeader("Authorization", "Bearer $accessToken")
            .get()
            .build()

        val user = http.newCall(userRequest).execute().use { response ->
            val text = response.body?.string().orEmpty()
            check(response.isSuccessful) { "Unable to verify Google identity" }
            JSONObject(text)
        }

        val authenticatedEmail = user.optString("email")
        if (!authenticatedEmail.equals(BuildConfig.CHAIRMAN_GOOGLE_EMAIL, ignoreCase = true)) {
            return@runCatching false
        }

        val uid = user.optString("id")
        require(uid.isNotBlank()) { "Authenticated user ID missing" }

        val profileRequest = Request.Builder()
            .url("${BuildConfig.SUPABASE_URL}/rest/v1/profiles?id=eq.$uid&select=role,active&limit=1")
            .addHeader("apikey", BuildConfig.SUPABASE_PUBLISHABLE_KEY)
            .addHeader("Authorization", "Bearer $accessToken")
            .get()
            .build()

        http.newCall(profileRequest).execute().use { response ->
            val text = response.body?.string().orEmpty()
            check(response.isSuccessful) { "Unable to verify Chairman authorization" }
            val row = JSONArray(text).optJSONObject(0) ?: return@use false
            row.optString("role") == "MASTER_ADMIN" && row.optBoolean("active", false)
        }
    }
}
