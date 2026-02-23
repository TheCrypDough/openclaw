/*
 * AUTO ANNOTATION
 * File: apps/android/app/src/main/java/ai/openclaw/android/NodeApp.kt
 * Purpose: File in apps area for project orchestration/configuration/data.
 * Module area: Native apps (macOS / iOS / Android / shared app assets)
 * System effect: Change can influence native apps (macos / ios / android / shared app assets) and therefore affects build/runtime behavior indirectly.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
package ai.openclaw.android

import android.app.Application
import android.os.StrictMode
import android.util.Log
import java.security.Security

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
class NodeApp : Application() {
  val runtime: NodeRuntime by lazy { NodeRuntime(this) }

  override fun onCreate() {
    super.onCreate()
    // Register Bouncy Castle as highest-priority provider for Ed25519 support
    try {
      val bcProvider = Class.forName("org.bouncycastle.jce.provider.BouncyCastleProvider")
        .getDeclaredConstructor().newInstance() as java.security.Provider
      Security.removeProvider("BC")
      Security.insertProviderAt(bcProvider, 1)
    } catch (it: Throwable) {
      Log.e("NodeApp", "Failed to register Bouncy Castle provider", it)
    }
    if (BuildConfig.DEBUG) {
      StrictMode.setThreadPolicy(
        StrictMode.ThreadPolicy.Builder()
          .detectAll()
          .penaltyLog()
          .build(),
      )
      StrictMode.setVmPolicy(
        StrictMode.VmPolicy.Builder()
          .detectAll()
          .penaltyLog()
          .build(),
      )
    }
  }
}
