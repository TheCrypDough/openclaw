/*
 * AUTO ANNOTATION
 * File: apps/android/app/src/main/java/ai/openclaw/android/VoiceWakeMode.kt
 * Purpose: File in apps area for project orchestration/configuration/data.
 * Module area: Native apps (macOS / iOS / Android / shared app assets)
 * System effect: Change can influence native apps (macos / ios / android / shared app assets) and therefore affects build/runtime behavior indirectly.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
package ai.openclaw.android

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
enum class VoiceWakeMode(val rawValue: String) {
  Off("off"),
  Foreground("foreground"),
  Always("always"),
  ;

  companion object {
    fun fromRawValue(raw: String?): VoiceWakeMode {
      return entries.firstOrNull { it.rawValue == raw?.trim()?.lowercase() } ?: Foreground
    }
  }
}
