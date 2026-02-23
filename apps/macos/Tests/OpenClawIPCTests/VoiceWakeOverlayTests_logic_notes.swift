/*
 * AUTO ANNOTATION
 * File: apps/macos/Tests/OpenClawIPCTests/VoiceWakeOverlayTests.swift
 * Purpose: File in apps area for project orchestration/configuration/data.
 * Module area: Native apps (macOS / iOS / Android / shared app assets)
 * System effect: Change can influence native apps (macos / ios / android / shared app assets) and therefore affects build/runtime behavior indirectly.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import Foundation
import Testing
@testable import OpenClaw

@Suite struct VoiceWakeOverlayTests {
    @Test func guardTokenDropsWhenNoActive() {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let outcome = VoiceWakeOverlayController.evaluateToken(active: nil, incoming: UUID())
        #expect(outcome == .dropNoActive)
    }

    @Test func guardTokenAcceptsMatching() {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let token = UUID()
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let outcome = VoiceWakeOverlayController.evaluateToken(active: token, incoming: token)
        #expect(outcome == .accept)
    }

    @Test func guardTokenDropsMismatchWithoutDismissing() {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let outcome = VoiceWakeOverlayController.evaluateToken(active: UUID(), incoming: UUID())
        #expect(outcome == .dropMismatch)
    }
}
