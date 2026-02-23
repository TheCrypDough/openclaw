/*
 * AUTO ANNOTATION
 * File: apps/android/app/src/main/java/ai/openclaw/android/DeviceNames.kt
 * Purpose: File in apps area for project orchestration/configuration/data.
 * Module area: Native apps (macOS / iOS / Android / shared app assets)
 * System effect: Change can influence native apps (macos / ios / android / shared app assets) and therefore affects build/runtime behavior indirectly.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
package ai.openclaw.android

import android.content.Context
import android.os.Build
import android.provider.Settings

object DeviceNames {
  fun bestDefaultNodeName(context: Context): String {
    val deviceName =
      runCatching {
          Settings.Global.getString(context.contentResolver, "device_name")
        }
        .getOrNull()
        ?.trim()
        .orEmpty()

    if (deviceName.isNotEmpty()) return deviceName

    val model =
      listOfNotNull(Build.MANUFACTURER?.takeIf { it.isNotBlank() }, Build.MODEL?.takeIf { it.isNotBlank() })
        .joinToString(" ")
        .trim()

    return model.ifEmpty { "Android Node" }
  }
}
