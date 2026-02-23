/*
 * AUTO ANNOTATION
 * File: apps/android/app/src/main/java/ai/openclaw/android/node/SmsHandler.kt
 * Purpose: File in apps area for project orchestration/configuration/data.
 * Module area: Native apps (macOS / iOS / Android / shared app assets)
 * System effect: Change can influence native apps (macos / ios / android / shared app assets) and therefore affects build/runtime behavior indirectly.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
package ai.openclaw.android.node

import ai.openclaw.android.gateway.GatewaySession

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
class SmsHandler(
  private val sms: SmsManager,
) {
  suspend fun handleSmsSend(paramsJson: String?): GatewaySession.InvokeResult {
    val res = sms.send(paramsJson)
    if (res.ok) {
      return GatewaySession.InvokeResult.ok(res.payloadJson)
    } else {
      val error = res.error ?: "SMS_SEND_FAILED"
      val idx = error.indexOf(':')
      val code = if (idx > 0) error.substring(0, idx).trim() else "SMS_SEND_FAILED"
      return GatewaySession.InvokeResult.error(code = code, message = error)
    }
  }
}
