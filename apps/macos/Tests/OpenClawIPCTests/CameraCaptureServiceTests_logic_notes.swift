/*
 * AUTO ANNOTATION
 * File: apps/macos/Tests/OpenClawIPCTests/CameraCaptureServiceTests.swift
 * Purpose: File in apps area for project orchestration/configuration/data.
 * Module area: Native apps (macOS / iOS / Android / shared app assets)
 * System effect: Change can influence native apps (macos / ios / android / shared app assets) and therefore affects build/runtime behavior indirectly.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import Testing

@testable import OpenClaw

@Suite struct CameraCaptureServiceTests {
    @Test func normalizeSnapDefaults() {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let res = CameraCaptureService.normalizeSnap(maxWidth: nil, quality: nil)
        #expect(res.maxWidth == 1600)
        #expect(res.quality == 0.9)
    }

    @Test func normalizeSnapClampsValues() {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let low = CameraCaptureService.normalizeSnap(maxWidth: -1, quality: -10)
        #expect(low.maxWidth == 1600)
        #expect(low.quality == 0.05)

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let high = CameraCaptureService.normalizeSnap(maxWidth: 9999, quality: 10)
        #expect(high.maxWidth == 9999)
        #expect(high.quality == 1.0)
    }
}
