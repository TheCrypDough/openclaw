/*
 * AUTO ANNOTATION
 * File: apps/android/app/src/main/java/ai/openclaw/android/ui/CameraHudOverlay.kt
 * Purpose: File in apps area for project orchestration/configuration/data.
 * Module area: Native apps (macOS / iOS / Android / shared app assets)
 * System effect: Change can influence native apps (macos / ios / android / shared app assets) and therefore affects build/runtime behavior indirectly.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
package ai.openclaw.android.ui

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableFloatStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.alpha
import androidx.compose.ui.graphics.Color
import kotlinx.coroutines.delay

@Composable
fun CameraFlashOverlay(
  token: Long,
  modifier: Modifier = Modifier,
) {
  Box(modifier = modifier.fillMaxSize()) {
    CameraFlash(token = token)
  }
}

@Composable
private fun CameraFlash(token: Long) {
  var alpha by remember { mutableFloatStateOf(0f) }
  LaunchedEffect(token) {
    if (token == 0L) return@LaunchedEffect
    alpha = 0.85f
    delay(110)
    alpha = 0f
  }

  Box(
    modifier =
      Modifier
        .fillMaxSize()
        .alpha(alpha)
        .background(Color.White),
  )
}
