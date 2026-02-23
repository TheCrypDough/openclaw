/*
 * AUTO ANNOTATION
 * File: apps/android/app/src/main/java/ai/openclaw/android/gateway/BonjourEscapes.kt
 * Purpose: File in apps area for project orchestration/configuration/data.
 * Module area: Native apps (macOS / iOS / Android / shared app assets)
 * System effect: Change can influence native apps (macos / ios / android / shared app assets) and therefore affects build/runtime behavior indirectly.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
package ai.openclaw.android.gateway

object BonjourEscapes {
  fun decode(input: String): String {
    if (input.isEmpty()) return input

    val bytes = mutableListOf<Byte>()
    var i = 0
    while (i < input.length) {
      if (input[i] == '\\' && i + 3 < input.length) {
        val d0 = input[i + 1]
        val d1 = input[i + 2]
        val d2 = input[i + 3]
        if (d0.isDigit() && d1.isDigit() && d2.isDigit()) {
          val value =
            ((d0.code - '0'.code) * 100) + ((d1.code - '0'.code) * 10) + (d2.code - '0'.code)
          if (value in 0..255) {
            bytes.add(value.toByte())
            i += 4
            continue
          }
        }
      }

      val codePoint = Character.codePointAt(input, i)
      val charBytes = String(Character.toChars(codePoint)).toByteArray(Charsets.UTF_8)
      for (b in charBytes) {
        bytes.add(b)
      }
      i += Character.charCount(codePoint)
    }

    return String(bytes.toByteArray(), Charsets.UTF_8)
  }
}
