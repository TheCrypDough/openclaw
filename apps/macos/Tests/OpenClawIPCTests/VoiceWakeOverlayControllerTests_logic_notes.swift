/*
 * AUTO ANNOTATION
 * File: apps/macos/Tests/OpenClawIPCTests/VoiceWakeOverlayControllerTests.swift
 * Purpose: File in apps area for project orchestration/configuration/data.
 * Module area: Native apps (macOS / iOS / Android / shared app assets)
 * System effect: Change can influence native apps (macos / ios / android / shared app assets) and therefore affects build/runtime behavior indirectly.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import Foundation
import Testing
@testable import OpenClaw

@Suite(.serialized)
@MainActor
struct VoiceWakeOverlayControllerTests {
    @Test func overlayControllerLifecycleWithoutUI() async {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let controller = VoiceWakeOverlayController(enableUI: false)
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let token = controller.startSession(
            source: .wakeWord,
            transcript: "hello",
            attributed: nil,
            forwardEnabled: true,
            isFinal: false)

        #expect(controller.snapshot().token == token)
        #expect(controller.snapshot().isVisible == true)

        controller.updatePartial(token: token, transcript: "hello world")
        #expect(controller.snapshot().text == "hello world")

        controller.updateLevel(token: token, -0.5)
        #expect(controller.model.level == 0)
        try? await Task.sleep(nanoseconds: 120_000_000)
        controller.updateLevel(token: token, 2.0)
        #expect(controller.model.level == 1)

        controller.dismiss(token: token, reason: .explicit, outcome: .empty)
        #expect(controller.snapshot().isVisible == false)
        #expect(controller.snapshot().token == nil)
    }

    @Test func evaluateTokenDropsMismatchAndNoActive() {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let active = UUID()
        #expect(VoiceWakeOverlayController.evaluateToken(active: nil, incoming: active) == .dropNoActive)
        #expect(VoiceWakeOverlayController.evaluateToken(active: active, incoming: UUID()) == .dropMismatch)
        #expect(VoiceWakeOverlayController.evaluateToken(active: active, incoming: active) == .accept)
        #expect(VoiceWakeOverlayController.evaluateToken(active: active, incoming: nil) == .accept)
    }

    @Test func updateLevelThrottlesRapidChanges() async {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let controller = VoiceWakeOverlayController(enableUI: false)
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let token = controller.startSession(
            source: .wakeWord,
            transcript: "level test",
            attributed: nil,
            forwardEnabled: false,
            isFinal: false)

        controller.updateLevel(token: token, 0.25)
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let first = controller.model.level

        controller.updateLevel(token: token, 0.9)
        #expect(controller.model.level == first)

        controller.updateLevel(token: token, 0)
        #expect(controller.model.level == 0)

        try? await Task.sleep(nanoseconds: 120_000_000)
        controller.updateLevel(token: token, 0.9)
        #expect(controller.model.level == 0.9)
    }

    @Test func overlayControllerExercisesHelpers() async {
        await VoiceWakeOverlayController.exerciseForTesting()
    }
}
