/*
 * AUTO ANNOTATION
 * File: apps/macos/Tests/OpenClawIPCTests/MenuContentSmokeTests.swift
 * Purpose: File in apps area for project orchestration/configuration/data.
 * Module area: Native apps (macOS / iOS / Android / shared app assets)
 * System effect: Change can influence native apps (macos / ios / android / shared app assets) and therefore affects build/runtime behavior indirectly.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import SwiftUI
import Testing
@testable import OpenClaw

@Suite(.serialized)
@MainActor
struct MenuContentSmokeTests {
    @Test func menuContentBuildsBodyLocalMode() {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let state = AppState(preview: true)
        state.connectionMode = .local
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let view = MenuContent(state: state, updater: nil)
        _ = view.body
    }

    @Test func menuContentBuildsBodyRemoteMode() {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let state = AppState(preview: true)
        state.connectionMode = .remote
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let view = MenuContent(state: state, updater: nil)
        _ = view.body
    }

    @Test func menuContentBuildsBodyUnconfiguredMode() {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let state = AppState(preview: true)
        state.connectionMode = .unconfigured
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let view = MenuContent(state: state, updater: nil)
        _ = view.body
    }

    @Test func menuContentBuildsBodyWithDebugAndCanvas() {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let state = AppState(preview: true)
        state.connectionMode = .local
        state.debugPaneEnabled = true
        state.canvasEnabled = true
        state.canvasPanelVisible = true
        state.swabbleEnabled = true
        state.voicePushToTalkEnabled = true
        state.heartbeatsEnabled = true
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let view = MenuContent(state: state, updater: nil)
        _ = view.body
    }
}
