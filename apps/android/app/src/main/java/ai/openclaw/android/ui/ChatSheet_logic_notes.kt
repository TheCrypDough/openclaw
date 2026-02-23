/*
 * AUTO ANNOTATION
 * File: apps/android/app/src/main/java/ai/openclaw/android/ui/ChatSheet.kt
 * Purpose: File in apps area for project orchestration/configuration/data.
 * Module area: Native apps (macOS / iOS / Android / shared app assets)
 * System effect: Change can influence native apps (macos / ios / android / shared app assets) and therefore affects build/runtime behavior indirectly.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
package ai.openclaw.android.ui

import androidx.compose.runtime.Composable
import ai.openclaw.android.MainViewModel
import ai.openclaw.android.ui.chat.ChatSheetContent

@Composable
fun ChatSheet(viewModel: MainViewModel) {
  ChatSheetContent(viewModel = viewModel)
}
