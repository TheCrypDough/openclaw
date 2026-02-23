/*
 * AUTO ANNOTATION
 * File: apps/macos/Tests/OpenClawIPCTests/VoiceWakeOverlayViewSmokeTests.swift
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
struct VoiceWakeOverlayViewSmokeTests {
    @Test func overlayViewBuildsBodyInDisplayMode() {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let controller = VoiceWakeOverlayController(enableUI: false)
        _ = controller.startSession(source: .wakeWord, transcript: "hello", forwardEnabled: true)
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let view = VoiceWakeOverlayView(controller: controller)
        _ = view.body
    }

    @Test func overlayViewBuildsBodyInEditingMode() {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let controller = VoiceWakeOverlayController(enableUI: false)
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let token = controller.startSession(source: .pushToTalk, transcript: "edit me", forwardEnabled: true)
        controller.userBeganEditing()
        controller.updateLevel(token: token, 0.6)
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let view = VoiceWakeOverlayView(controller: controller)
        _ = view.body
    }

    @Test func closeButtonOverlayBuildsBody() {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let view = CloseButtonOverlay(isVisible: true, onHover: { _ in }, onClose: {})
        _ = view.body
    }
}
