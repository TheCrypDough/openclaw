/*
 * AUTO ANNOTATION
 * File: apps/android/app/src/main/java/ai/openclaw/android/protocol/OpenClawProtocolConstants.kt
 * Purpose: File in apps area for project orchestration/configuration/data.
 * Module area: Native apps (macOS / iOS / Android / shared app assets)
 * System effect: Change can influence native apps (macos / ios / android / shared app assets) and therefore affects build/runtime behavior indirectly.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
package ai.openclaw.android.protocol

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
enum class OpenClawCapability(val rawValue: String) {
  Canvas("canvas"),
  Camera("camera"),
  Screen("screen"),
  Sms("sms"),
  VoiceWake("voiceWake"),
  Location("location"),
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
enum class OpenClawCanvasCommand(val rawValue: String) {
  Present("canvas.present"),
  Hide("canvas.hide"),
  Navigate("canvas.navigate"),
  Eval("canvas.eval"),
  Snapshot("canvas.snapshot"),
  ;

  companion object {
    const val NamespacePrefix: String = "canvas."
  }
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
enum class OpenClawCanvasA2UICommand(val rawValue: String) {
  Push("canvas.a2ui.push"),
  PushJSONL("canvas.a2ui.pushJSONL"),
  Reset("canvas.a2ui.reset"),
  ;

  companion object {
    const val NamespacePrefix: String = "canvas.a2ui."
  }
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
enum class OpenClawCameraCommand(val rawValue: String) {
  Snap("camera.snap"),
  Clip("camera.clip"),
  ;

  companion object {
    const val NamespacePrefix: String = "camera."
  }
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
enum class OpenClawScreenCommand(val rawValue: String) {
  Record("screen.record"),
  ;

  companion object {
    const val NamespacePrefix: String = "screen."
  }
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
enum class OpenClawSmsCommand(val rawValue: String) {
  Send("sms.send"),
  ;

  companion object {
    const val NamespacePrefix: String = "sms."
  }
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
enum class OpenClawLocationCommand(val rawValue: String) {
  Get("location.get"),
  ;

  companion object {
    const val NamespacePrefix: String = "location."
  }
}
