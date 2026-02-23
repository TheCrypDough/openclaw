# AUTOPLACEHOLDER_ANNOTATION: apps/android/app/proguard-rules.pro
# Purpose: File in apps area for project orchestration/configuration/data.
# Area: Native apps (macOS / iOS / Android / shared app assets)
# System effect: Change can influence native apps (macos / ios / android / shared app assets) and therefore affects build/runtime behavior indirectly.
# ── App classes ───────────────────────────────────────────────────
-keep class ai.openclaw.android.** { *; }

# ── Bouncy Castle ─────────────────────────────────────────────────
-keep class org.bouncycastle.** { *; }
-dontwarn org.bouncycastle.**

# ── CameraX ───────────────────────────────────────────────────────
-keep class androidx.camera.** { *; }

# ── kotlinx.serialization ────────────────────────────────────────
-keep class kotlinx.serialization.** { *; }
-keepclassmembers class * {
    @kotlinx.serialization.Serializable *;
}
-keepattributes *Annotation*, InnerClasses

# ── OkHttp ────────────────────────────────────────────────────────
-dontwarn okhttp3.**
-dontwarn okio.**
-keep class okhttp3.internal.platform.** { *; }

# ── Misc suppressions ────────────────────────────────────────────
-dontwarn com.sun.jna.**
-dontwarn javax.naming.**
-dontwarn lombok.Generated
-dontwarn org.slf4j.impl.StaticLoggerBinder
-dontwarn sun.net.spi.nameservice.NameServiceDescriptor
