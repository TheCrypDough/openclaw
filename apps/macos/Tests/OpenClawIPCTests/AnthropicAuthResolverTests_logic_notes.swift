/*
 * AUTO ANNOTATION
 * File: apps/macos/Tests/OpenClawIPCTests/AnthropicAuthResolverTests.swift
 * Purpose: File in apps area for project orchestration/configuration/data.
 * Module area: Native apps (macOS / iOS / Android / shared app assets)
 * System effect: Change can influence native apps (macos / ios / android / shared app assets) and therefore affects build/runtime behavior indirectly.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import Foundation
import Testing
@testable import OpenClaw

@Suite
struct AnthropicAuthResolverTests {
    @Test
    func prefersOAuthFileOverEnv() throws {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let dir = FileManager().temporaryDirectory
            .appendingPathComponent("openclaw-oauth-\(UUID().uuidString)", isDirectory: true)
        try FileManager().createDirectory(at: dir, withIntermediateDirectories: true)
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let oauthFile = dir.appendingPathComponent("oauth.json")
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let payload = [
            "anthropic": [
                "type": "oauth",
                "refresh": "r1",
                "access": "a1",
                "expires": 1_234_567_890,
            ],
        ]
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let data = try JSONSerialization.data(withJSONObject: payload, options: [.prettyPrinted, .sortedKeys])
        try data.write(to: oauthFile, options: [.atomic])

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let status = OpenClawOAuthStore.anthropicOAuthStatus(at: oauthFile)
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let mode = AnthropicAuthResolver.resolve(environment: [
            "ANTHROPIC_API_KEY": "sk-ant-ignored",
        ], oauthStatus: status)
        #expect(mode == .oauthFile)
    }

    @Test
    func reportsOAuthEnvWhenPresent() {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let mode = AnthropicAuthResolver.resolve(environment: [
            "ANTHROPIC_OAUTH_TOKEN": "token",
        ], oauthStatus: .missingFile)
        #expect(mode == .oauthEnv)
    }

    @Test
    func reportsAPIKeyEnvWhenPresent() {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let mode = AnthropicAuthResolver.resolve(environment: [
            "ANTHROPIC_API_KEY": "sk-ant-key",
        ], oauthStatus: .missingFile)
        #expect(mode == .apiKeyEnv)
    }

    @Test
    func reportsMissingWhenNothingConfigured() {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let mode = AnthropicAuthResolver.resolve(environment: [:], oauthStatus: .missingFile)
        #expect(mode == .missing)
    }
}
