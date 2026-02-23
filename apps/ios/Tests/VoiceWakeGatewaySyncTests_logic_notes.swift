/*
 * AUTO ANNOTATION
 * File: apps/ios/Tests/VoiceWakeGatewaySyncTests.swift
 * Purpose: File in apps area for project orchestration/configuration/data.
 * Module area: Native apps (macOS / iOS / Android / shared app assets)
 * System effect: Change can influence native apps (macos / ios / android / shared app assets) and therefore affects build/runtime behavior indirectly.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import Foundation
import Testing
@testable import OpenClaw

@Suite struct VoiceWakeGatewaySyncTests {
    @Test func decodeGatewayTriggersFromJSONSanitizes() {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let payload = #"{"triggers":[" openclaw  ","", "computer"]}"#
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let triggers = VoiceWakePreferences.decodeGatewayTriggers(from: payload)
        #expect(triggers == ["openclaw", "computer"])
    }

    @Test func decodeGatewayTriggersFromJSONFallsBackWhenEmpty() {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let payload = #"{"triggers":["  ",""]}"#
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let triggers = VoiceWakePreferences.decodeGatewayTriggers(from: payload)
        #expect(triggers == VoiceWakePreferences.defaultTriggerWords)
    }

    @Test func decodeGatewayTriggersFromInvalidJSONReturnsNil() {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let triggers = VoiceWakePreferences.decodeGatewayTriggers(from: "not json")
        #expect(triggers == nil)
    }
}
