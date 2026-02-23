/*
 * AUTO ANNOTATION
 * File: apps/ios/Tests/VoiceWakeManagerStateTests.swift
 * Purpose: File in apps area for project orchestration/configuration/data.
 * Module area: Native apps (macOS / iOS / Android / shared app assets)
 * System effect: Change can influence native apps (macos / ios / android / shared app assets) and therefore affects build/runtime behavior indirectly.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import Foundation
import SwabbleKit
import Testing
@testable import OpenClaw

@Suite(.serialized) struct VoiceWakeManagerStateTests {
    @Test @MainActor func suspendAndResumeCycleUpdatesState() async {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let manager = VoiceWakeManager()
        manager.isEnabled = true
        manager.isListening = true
        manager.statusText = "Listening"

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let suspended = manager.suspendForExternalAudioCapture()
        #expect(suspended == true)
        #expect(manager.isListening == false)
        #expect(manager.statusText == "Paused")

        manager.resumeAfterExternalAudioCapture(wasSuspended: true)
        try? await Task.sleep(nanoseconds: 900_000_000)
        #expect(manager.statusText.contains("Voice Wake") == true)
    }

    @Test @MainActor func handleRecognitionCallbackRestartsOnError() async {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let manager = VoiceWakeManager()
        manager.isEnabled = true
        manager.isListening = true

        manager._test_handleRecognitionCallback(transcript: nil, segments: [], errorText: "boom")
        #expect(manager.statusText.contains("Recognizer error") == true)
        #expect(manager.isListening == false)

        try? await Task.sleep(nanoseconds: 900_000_000)
        #expect(manager.statusText.contains("Voice Wake") == true)
    }

    @Test @MainActor func handleRecognitionCallbackDispatchesCommand() async {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let manager = VoiceWakeManager()
        manager.triggerWords = ["openclaw"]
        manager.isEnabled = true

        actor CaptureBox {
            var value: String?
            func set(_ next: String) { self.value = next }
        }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let capture = CaptureBox()
        manager.configure { cmd in
            await capture.set(cmd)
        }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let transcript = "openclaw hello"
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let triggerRange = transcript.range(of: "openclaw")!
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let helloRange = transcript.range(of: "hello")!
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let segments = [
            WakeWordSegment(text: "openclaw", start: 0.0, duration: 0.2, range: triggerRange),
            WakeWordSegment(text: "hello", start: 0.8, duration: 0.2, range: helloRange),
        ]

        manager._test_handleRecognitionCallback(transcript: transcript, segments: segments, errorText: nil)
        #expect(manager.lastTriggeredCommand == "hello")
        #expect(manager.statusText == "Triggered")

        try? await Task.sleep(nanoseconds: 300_000_000)
        #expect(await capture.value == "hello")
    }
}
