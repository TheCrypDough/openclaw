/*
 * AUTO ANNOTATION
 * File: apps/macos/Tests/OpenClawIPCTests/OpenClawOAuthStoreTests.swift
 * Purpose: File in apps area for project orchestration/configuration/data.
 * Module area: Native apps (macOS / iOS / Android / shared app assets)
 * System effect: Change can influence native apps (macos / ios / android / shared app assets) and therefore affects build/runtime behavior indirectly.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import Foundation
import Testing
@testable import OpenClaw

@Suite
struct OpenClawOAuthStoreTests {
    @Test
    func returnsMissingWhenFileAbsent() {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let url = FileManager().temporaryDirectory
            .appendingPathComponent("openclaw-oauth-\(UUID().uuidString)")
            .appendingPathComponent("oauth.json")
        #expect(OpenClawOAuthStore.anthropicOAuthStatus(at: url) == .missingFile)
    }

    @Test
    func usesEnvOverrideForOpenClawOAuthDir() throws {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let key = "OPENCLAW_OAUTH_DIR"
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let previous = ProcessInfo.processInfo.environment[key]
        defer {
            if let previous {
                setenv(key, previous, 1)
            } else {
                unsetenv(key)
            }
        }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let dir = FileManager().temporaryDirectory
            .appendingPathComponent("openclaw-oauth-\(UUID().uuidString)", isDirectory: true)
        setenv(key, dir.path, 1)

        #expect(OpenClawOAuthStore.oauthDir().standardizedFileURL == dir.standardizedFileURL)
    }

    @Test
    func acceptsPiFormatTokens() throws {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let url = try self.writeOAuthFile([
            "anthropic": [
                "type": "oauth",
                "refresh": "r1",
                "access": "a1",
                "expires": 1_234_567_890,
            ],
        ])

        #expect(OpenClawOAuthStore.anthropicOAuthStatus(at: url).isConnected)
    }

    @Test
    func acceptsTokenKeyVariants() throws {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let url = try self.writeOAuthFile([
            "anthropic": [
                "type": "oauth",
                "refresh_token": "r1",
                "access_token": "a1",
            ],
        ])

        #expect(OpenClawOAuthStore.anthropicOAuthStatus(at: url).isConnected)
    }

    @Test
    func reportsMissingProviderEntry() throws {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let url = try self.writeOAuthFile([
            "other": [
                "type": "oauth",
                "refresh": "r1",
                "access": "a1",
            ],
        ])

        #expect(OpenClawOAuthStore.anthropicOAuthStatus(at: url) == .missingProviderEntry)
    }

    @Test
    func reportsMissingTokens() throws {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let url = try self.writeOAuthFile([
            "anthropic": [
                "type": "oauth",
                "refresh": "",
                "access": "a1",
            ],
        ])

        #expect(OpenClawOAuthStore.anthropicOAuthStatus(at: url) == .missingTokens)
    }

    private func writeOAuthFile(_ json: [String: Any]) throws -> URL {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let dir = FileManager().temporaryDirectory
            .appendingPathComponent("openclaw-oauth-\(UUID().uuidString)", isDirectory: true)
        try FileManager().createDirectory(at: dir, withIntermediateDirectories: true)

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let url = dir.appendingPathComponent("oauth.json")
        let data = try JSONSerialization.data(withJSONObject: json, options: [.prettyPrinted, .sortedKeys])
        try data.write(to: url, options: [.atomic])
        return url
    }
}
