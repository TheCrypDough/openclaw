/*
 * AUTO ANNOTATION
 * File: apps/macos/Tests/OpenClawIPCTests/AnthropicAuthControlsSmokeTests.swift
 * Purpose: File in apps area for project orchestration/configuration/data.
 * Module area: Native apps (macOS / iOS / Android / shared app assets)
 * System effect: Change can influence native apps (macos / ios / android / shared app assets) and therefore affects build/runtime behavior indirectly.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import Testing
@testable import OpenClaw

@Suite(.serialized)
@MainActor
struct AnthropicAuthControlsSmokeTests {
    @Test func anthropicAuthControlsBuildsBodyLocal() {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let pkce = AnthropicOAuth.PKCE(verifier: "verifier", challenge: "challenge")
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let view = AnthropicAuthControls(
            connectionMode: .local,
            oauthStatus: .connected(expiresAtMs: 1_700_000_000_000),
            pkce: pkce,
            code: "code#state",
            statusText: "Detected code",
            autoDetectClipboard: false,
            autoConnectClipboard: false)
        _ = view.body
    }

    @Test func anthropicAuthControlsBuildsBodyRemote() {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let view = AnthropicAuthControls(
            connectionMode: .remote,
            oauthStatus: .missingFile,
            pkce: nil,
            code: "",
            statusText: nil)
        _ = view.body
    }
}
