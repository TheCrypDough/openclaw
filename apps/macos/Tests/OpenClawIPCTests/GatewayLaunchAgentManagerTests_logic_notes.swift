/*
 * AUTO ANNOTATION
 * File: apps/macos/Tests/OpenClawIPCTests/GatewayLaunchAgentManagerTests.swift
 * Purpose: File in apps area for project orchestration/configuration/data.
 * Module area: Native apps (macOS / iOS / Android / shared app assets)
 * System effect: Change can influence native apps (macos / ios / android / shared app assets) and therefore affects build/runtime behavior indirectly.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import Foundation
import Testing
@testable import OpenClaw

@Suite struct GatewayLaunchAgentManagerTests {
    @Test func launchAgentPlistSnapshotParsesArgsAndEnv() throws {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let url = FileManager().temporaryDirectory
            .appendingPathComponent("openclaw-launchd-\(UUID().uuidString).plist")
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let plist: [String: Any] = [
            "ProgramArguments": ["openclaw", "gateway-daemon", "--port", "18789", "--bind", "loopback"],
            "EnvironmentVariables": [
                "OPENCLAW_GATEWAY_TOKEN": " secret ",
                "OPENCLAW_GATEWAY_PASSWORD": "pw",
            ],
        ]
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let data = try PropertyListSerialization.data(fromPropertyList: plist, format: .xml, options: 0)
        try data.write(to: url, options: [.atomic])
        defer { try? FileManager().removeItem(at: url) }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let snapshot = try #require(LaunchAgentPlist.snapshot(url: url))
        #expect(snapshot.port == 18789)
        #expect(snapshot.bind == "loopback")
        #expect(snapshot.token == "secret")
        #expect(snapshot.password == "pw")
    }

    @Test func launchAgentPlistSnapshotAllowsMissingBind() throws {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let url = FileManager().temporaryDirectory
            .appendingPathComponent("openclaw-launchd-\(UUID().uuidString).plist")
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let plist: [String: Any] = [
            "ProgramArguments": ["openclaw", "gateway-daemon", "--port", "18789"],
        ]
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let data = try PropertyListSerialization.data(fromPropertyList: plist, format: .xml, options: 0)
        try data.write(to: url, options: [.atomic])
        defer { try? FileManager().removeItem(at: url) }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let snapshot = try #require(LaunchAgentPlist.snapshot(url: url))
        #expect(snapshot.port == 18789)
        #expect(snapshot.bind == nil)
    }
}
