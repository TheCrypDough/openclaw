/*
 * AUTO ANNOTATION
 * File: apps/ios/Tests/AppCoverageTests.swift
 * Purpose: File in apps area for project orchestration/configuration/data.
 * Module area: Native apps (macOS / iOS / Android / shared app assets)
 * System effect: Change can influence native apps (macos / ios / android / shared app assets) and therefore affects build/runtime behavior indirectly.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import SwiftUI
import Testing
@testable import OpenClaw

@Suite struct AppCoverageTests {
    @Test @MainActor func nodeAppModelUpdatesBackgroundedState() {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let appModel = NodeAppModel()

        appModel.setScenePhase(.background)
        #expect(appModel.isBackgrounded == true)

        appModel.setScenePhase(.inactive)
        #expect(appModel.isBackgrounded == false)

        appModel.setScenePhase(.active)
        #expect(appModel.isBackgrounded == false)
    }

    @Test @MainActor func voiceWakeStartReportsUnsupportedOnSimulator() async {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let voiceWake = VoiceWakeManager()
        voiceWake.isEnabled = true

        await voiceWake.start()

        #expect(voiceWake.isListening == false)
        #expect(voiceWake.statusText.contains("Simulator"))

        voiceWake.stop()
        #expect(voiceWake.statusText == "Off")
    }
}
