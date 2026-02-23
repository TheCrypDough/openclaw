/*
 * AUTO ANNOTATION
 * File: apps/ios/Tests/ScreenRecordServiceTests.swift
 * Purpose: File in apps area for project orchestration/configuration/data.
 * Module area: Native apps (macOS / iOS / Android / shared app assets)
 * System effect: Change can influence native apps (macos / ios / android / shared app assets) and therefore affects build/runtime behavior indirectly.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import Testing
@testable import OpenClaw

@Suite(.serialized) struct ScreenRecordServiceTests {
    @Test func clampDefaultsAndBounds() {
        #expect(ScreenRecordService._test_clampDurationMs(nil) == 10000)
        #expect(ScreenRecordService._test_clampDurationMs(0) == 250)
        #expect(ScreenRecordService._test_clampDurationMs(60001) == 60000)

        #expect(ScreenRecordService._test_clampFps(nil) == 10)
        #expect(ScreenRecordService._test_clampFps(0) == 1)
        #expect(ScreenRecordService._test_clampFps(120) == 30)
        #expect(ScreenRecordService._test_clampFps(.infinity) == 10)
    }

    @Test @MainActor func recordRejectsInvalidScreenIndex() async {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let recorder = ScreenRecordService()
        do {
            _ = try await recorder.record(
                screenIndex: 1,
                durationMs: 250,
                fps: 5,
                includeAudio: false,
                outPath: nil)
            Issue.record("Expected invalid screen index to throw")
        } catch let error as ScreenRecordService.ScreenRecordError {
            #expect(error.localizedDescription.contains("Invalid screen index") == true)
        } catch {
            Issue.record("Unexpected error type: \(error)")
        }
    }
}
