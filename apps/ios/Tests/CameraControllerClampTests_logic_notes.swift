/*
 * AUTO ANNOTATION
 * File: apps/ios/Tests/CameraControllerClampTests.swift
 * Purpose: File in apps area for project orchestration/configuration/data.
 * Module area: Native apps (macOS / iOS / Android / shared app assets)
 * System effect: Change can influence native apps (macos / ios / android / shared app assets) and therefore affects build/runtime behavior indirectly.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import Testing
@testable import OpenClaw

@Suite struct CameraControllerClampTests {
    @Test func clampQualityDefaultsAndBounds() {
        #expect(CameraController.clampQuality(nil) == 0.9)
        #expect(CameraController.clampQuality(0.0) == 0.05)
        #expect(CameraController.clampQuality(0.049) == 0.05)
        #expect(CameraController.clampQuality(0.05) == 0.05)
        #expect(CameraController.clampQuality(0.5) == 0.5)
        #expect(CameraController.clampQuality(1.0) == 1.0)
        #expect(CameraController.clampQuality(1.1) == 1.0)
    }

    @Test func clampDurationDefaultsAndBounds() {
        #expect(CameraController.clampDurationMs(nil) == 3000)
        #expect(CameraController.clampDurationMs(0) == 250)
        #expect(CameraController.clampDurationMs(249) == 250)
        #expect(CameraController.clampDurationMs(250) == 250)
        #expect(CameraController.clampDurationMs(1000) == 1000)
        #expect(CameraController.clampDurationMs(60000) == 60000)
        #expect(CameraController.clampDurationMs(60001) == 60000)
    }
}
