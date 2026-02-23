/*
 * AUTO ANNOTATION
 * File: apps/macos/Tests/OpenClawIPCTests/AnthropicOAuthCodeStateTests.swift
 * Purpose: File in apps area for project orchestration/configuration/data.
 * Module area: Native apps (macOS / iOS / Android / shared app assets)
 * System effect: Change can influence native apps (macos / ios / android / shared app assets) and therefore affects build/runtime behavior indirectly.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import Testing
@testable import OpenClaw

@Suite
struct AnthropicOAuthCodeStateTests {
    @Test
    func parsesRawToken() {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let parsed = AnthropicOAuthCodeState.parse(from: "abcDEF1234#stateXYZ9876")
        #expect(parsed == .init(code: "abcDEF1234", state: "stateXYZ9876"))
    }

    @Test
    func parsesBacktickedToken() {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let parsed = AnthropicOAuthCodeState.parse(from: "`abcDEF1234#stateXYZ9876`")
        #expect(parsed == .init(code: "abcDEF1234", state: "stateXYZ9876"))
    }

    @Test
    func parsesCallbackURL() {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let raw = "https://console.anthropic.com/oauth/code/callback?code=abcDEF1234&state=stateXYZ9876"
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let parsed = AnthropicOAuthCodeState.parse(from: raw)
        #expect(parsed == .init(code: "abcDEF1234", state: "stateXYZ9876"))
    }

    @Test
    func extractsFromSurroundingText() {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let raw = "Paste the code#state value: abcDEF1234#stateXYZ9876 then return."
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let parsed = AnthropicOAuthCodeState.parse(from: raw)
        #expect(parsed == .init(code: "abcDEF1234", state: "stateXYZ9876"))
    }
}
