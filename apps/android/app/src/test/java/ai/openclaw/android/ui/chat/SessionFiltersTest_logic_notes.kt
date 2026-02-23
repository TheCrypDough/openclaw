/*
 * AUTO ANNOTATION
 * File: apps/android/app/src/test/java/ai/openclaw/android/ui/chat/SessionFiltersTest.kt
 * Purpose: File in apps area for project orchestration/configuration/data.
 * Module area: Native apps (macOS / iOS / Android / shared app assets)
 * System effect: Change can influence native apps (macos / ios / android / shared app assets) and therefore affects build/runtime behavior indirectly.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
package ai.openclaw.android.ui.chat

import ai.openclaw.android.chat.ChatSessionEntry
import org.junit.Assert.assertEquals
import org.junit.Test

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
class SessionFiltersTest {
  @Test
  fun sessionChoicesPreferMainAndRecent() {
    val now = 1_700_000_000_000L
    val recent1 = now - 2 * 60 * 60 * 1000L
    val recent2 = now - 5 * 60 * 60 * 1000L
    val stale = now - 26 * 60 * 60 * 1000L
    val sessions =
      listOf(
        ChatSessionEntry(key = "recent-1", updatedAtMs = recent1),
        ChatSessionEntry(key = "main", updatedAtMs = stale),
        ChatSessionEntry(key = "old-1", updatedAtMs = stale),
        ChatSessionEntry(key = "recent-2", updatedAtMs = recent2),
      )

    val result = resolveSessionChoices("main", sessions, mainSessionKey = "main", nowMs = now).map { it.key }
    assertEquals(listOf("main", "recent-1", "recent-2"), result)
  }

  @Test
  fun sessionChoicesIncludeCurrentWhenMissing() {
    val now = 1_700_000_000_000L
    val recent = now - 10 * 60 * 1000L
    val sessions = listOf(ChatSessionEntry(key = "main", updatedAtMs = recent))

    val result = resolveSessionChoices("custom", sessions, mainSessionKey = "main", nowMs = now).map { it.key }
    assertEquals(listOf("main", "custom"), result)
  }
}
