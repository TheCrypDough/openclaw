/*
 * AUTO ANNOTATION
 * File: apps/android/app/src/main/java/ai/openclaw/android/LocationMode.kt
 * Purpose: File in apps area for project orchestration/configuration/data.
 * Module area: Native apps (macOS / iOS / Android / shared app assets)
 * System effect: Change can influence native apps (macos / ios / android / shared app assets) and therefore affects build/runtime behavior indirectly.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
package ai.openclaw.android

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
enum class LocationMode(val rawValue: String) {
  Off("off"),
  WhileUsing("whileUsing"),
  Always("always"),
  ;

  companion object {
    fun fromRawValue(raw: String?): LocationMode {
      val normalized = raw?.trim()?.lowercase()
      return entries.firstOrNull { it.rawValue.lowercase() == normalized } ?: Off
    }
  }
}
