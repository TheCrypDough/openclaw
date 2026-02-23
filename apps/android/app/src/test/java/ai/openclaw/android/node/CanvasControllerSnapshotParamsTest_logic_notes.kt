/*
 * AUTO ANNOTATION
 * File: apps/android/app/src/test/java/ai/openclaw/android/node/CanvasControllerSnapshotParamsTest.kt
 * Purpose: File in apps area for project orchestration/configuration/data.
 * Module area: Native apps (macOS / iOS / Android / shared app assets)
 * System effect: Change can influence native apps (macos / ios / android / shared app assets) and therefore affects build/runtime behavior indirectly.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
package ai.openclaw.android.node

import org.junit.Assert.assertEquals
import org.junit.Assert.assertNull
import org.junit.Test

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
class CanvasControllerSnapshotParamsTest {
  @Test
  fun parseSnapshotParamsDefaultsToJpeg() {
    val params = CanvasController.parseSnapshotParams(null)
    assertEquals(CanvasController.SnapshotFormat.Jpeg, params.format)
    assertNull(params.quality)
    assertNull(params.maxWidth)
  }

  @Test
  fun parseSnapshotParamsParsesPng() {
    val params = CanvasController.parseSnapshotParams("""{"format":"png","maxWidth":900}""")
    assertEquals(CanvasController.SnapshotFormat.Png, params.format)
    assertEquals(900, params.maxWidth)
  }

  @Test
  fun parseSnapshotParamsParsesJpegAliases() {
    assertEquals(
      CanvasController.SnapshotFormat.Jpeg,
      CanvasController.parseSnapshotParams("""{"format":"jpeg"}""").format,
    )
    assertEquals(
      CanvasController.SnapshotFormat.Jpeg,
      CanvasController.parseSnapshotParams("""{"format":"jpg"}""").format,
    )
  }

  @Test
  fun parseSnapshotParamsClampsQuality() {
    val low = CanvasController.parseSnapshotParams("""{"quality":0.01}""")
    assertEquals(0.1, low.quality)

    val high = CanvasController.parseSnapshotParams("""{"quality":5}""")
    assertEquals(1.0, high.quality)
  }
}
