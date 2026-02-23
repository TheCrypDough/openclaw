/*
 * AUTO ANNOTATION
 * File: apps/android/app/src/main/java/ai/openclaw/android/gateway/DeviceAuthStore.kt
 * Purpose: File in apps area for project orchestration/configuration/data.
 * Module area: Native apps (macOS / iOS / Android / shared app assets)
 * System effect: Change can influence native apps (macos / ios / android / shared app assets) and therefore affects build/runtime behavior indirectly.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
package ai.openclaw.android.gateway

import ai.openclaw.android.SecurePrefs

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
class DeviceAuthStore(private val prefs: SecurePrefs) {
  fun loadToken(deviceId: String, role: String): String? {
    val key = tokenKey(deviceId, role)
    return prefs.getString(key)?.trim()?.takeIf { it.isNotEmpty() }
  }

  fun saveToken(deviceId: String, role: String, token: String) {
    val key = tokenKey(deviceId, role)
    prefs.putString(key, token.trim())
  }

  fun clearToken(deviceId: String, role: String) {
    val key = tokenKey(deviceId, role)
    prefs.remove(key)
  }

  private fun tokenKey(deviceId: String, role: String): String {
    val normalizedDevice = deviceId.trim().lowercase()
    val normalizedRole = role.trim().lowercase()
    return "gateway.deviceToken.$normalizedDevice.$normalizedRole"
  }
}
