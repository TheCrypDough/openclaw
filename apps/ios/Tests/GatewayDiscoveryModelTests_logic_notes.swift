/*
 * AUTO ANNOTATION
 * File: apps/ios/Tests/GatewayDiscoveryModelTests.swift
 * Purpose: File in apps area for project orchestration/configuration/data.
 * Module area: Native apps (macOS / iOS / Android / shared app assets)
 * System effect: Change can influence native apps (macos / ios / android / shared app assets) and therefore affects build/runtime behavior indirectly.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import Testing
@testable import OpenClaw

@Suite(.serialized) struct GatewayDiscoveryModelTests {
    @Test @MainActor func debugLoggingCapturesLifecycleAndResets() {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let model = GatewayDiscoveryModel()

        #expect(model.debugLog.isEmpty)
        #expect(model.statusText == "Idle")

        model.setDebugLoggingEnabled(true)
        #expect(model.debugLog.count >= 2)

        model.stop()
        #expect(model.statusText == "Stopped")
        #expect(model.gateways.isEmpty)
        #expect(model.debugLog.count >= 3)

        model.setDebugLoggingEnabled(false)
        #expect(model.debugLog.isEmpty)
    }
}
