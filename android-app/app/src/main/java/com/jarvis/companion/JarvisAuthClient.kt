package com.jarvis.companion

import okhttp3.MediaType.Companion.toMediaType
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.RequestBody.Companion.toRequestBody
import org.json.JSONObject

class JarvisAuthClient(
    private val http: OkHttpClient = OkHttpClient()
) {
    data class Session(val accessToken: String, val refreshToken: String?, val email: String?)

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
        val request = Request.Builder()
            .url("${BuildConfig.SUPABASE_URL}/rest/v1/profiles?select=role,active&limit=1")
            .addHeader("apikey", BuildConfig.SUPABASE_PUBLISHABLE_KEY)
            .addHeader("Authorization", "Bearer $accessToken")
            .get()
            .build()

        http.newCall(request).execute().use { response ->
            val text = response.body?.string().orEmpty()
            check(response.isSuccessful) { "Unable to verify account access" }
            val row = org.json.JSONArray(text).optJSONObject(0) ?: return@use false
            row.optString("role") == "MASTER_ADMIN" && row.optBoolean("active", false)
        }
    }
}
