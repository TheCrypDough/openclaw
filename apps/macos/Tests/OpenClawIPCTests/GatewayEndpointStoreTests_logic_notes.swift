/*
 * AUTO ANNOTATION
 * File: apps/macos/Tests/OpenClawIPCTests/GatewayEndpointStoreTests.swift
 * Purpose: File in apps area for project orchestration/configuration/data.
 * Module area: Native apps (macOS / iOS / Android / shared app assets)
 * System effect: Change can influence native apps (macos / ios / android / shared app assets) and therefore affects build/runtime behavior indirectly.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import Foundation
import Testing
@testable import OpenClaw

@Suite struct GatewayEndpointStoreTests {
    private func makeDefaults() -> UserDefaults {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let suiteName = "GatewayEndpointStoreTests.\(UUID().uuidString)"
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let defaults = UserDefaults(suiteName: suiteName)!
        defaults.removePersistentDomain(forName: suiteName)
        return defaults
    }

    @Test func resolveGatewayTokenPrefersEnvAndFallsBackToLaunchd() {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let snapshot = LaunchAgentPlistSnapshot(
            programArguments: [],
            environment: ["OPENCLAW_GATEWAY_TOKEN": "launchd-token"],
            stdoutPath: nil,
            stderrPath: nil,
            port: nil,
            bind: nil,
            token: "launchd-token",
            password: nil)

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let envToken = GatewayEndpointStore._testResolveGatewayToken(
            isRemote: false,
            root: [:],
            env: ["OPENCLAW_GATEWAY_TOKEN": "env-token"],
            launchdSnapshot: snapshot)
        #expect(envToken == "env-token")

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let fallbackToken = GatewayEndpointStore._testResolveGatewayToken(
            isRemote: false,
            root: [:],
            env: [:],
            launchdSnapshot: snapshot)
        #expect(fallbackToken == "launchd-token")
    }

    @Test func resolveGatewayTokenIgnoresLaunchdInRemoteMode() {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let snapshot = LaunchAgentPlistSnapshot(
            programArguments: [],
            environment: ["OPENCLAW_GATEWAY_TOKEN": "launchd-token"],
            stdoutPath: nil,
            stderrPath: nil,
            port: nil,
            bind: nil,
            token: "launchd-token",
            password: nil)

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let token = GatewayEndpointStore._testResolveGatewayToken(
            isRemote: true,
            root: [:],
            env: [:],
            launchdSnapshot: snapshot)
        #expect(token == nil)
    }

    @Test func resolveGatewayPasswordFallsBackToLaunchd() {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let snapshot = LaunchAgentPlistSnapshot(
            programArguments: [],
            environment: ["OPENCLAW_GATEWAY_PASSWORD": "launchd-pass"],
            stdoutPath: nil,
            stderrPath: nil,
            port: nil,
            bind: nil,
            token: nil,
            password: "launchd-pass")

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let password = GatewayEndpointStore._testResolveGatewayPassword(
            isRemote: false,
            root: [:],
            env: [:],
            launchdSnapshot: snapshot)
        #expect(password == "launchd-pass")
    }

    @Test func connectionModeResolverPrefersConfigModeOverDefaults() {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let defaults = self.makeDefaults()
        defaults.set("remote", forKey: connectionModeKey)

        let root: [String: Any] = [
            "gateway": [
                "mode": " local ",
            ],
        ]

        let resolved = ConnectionModeResolver.resolve(root: root, defaults: defaults)
        #expect(resolved.mode == .local)
    }

    @Test func connectionModeResolverTrimsConfigMode() {
        let defaults = self.makeDefaults()
        defaults.set("local", forKey: connectionModeKey)

        let root: [String: Any] = [
            "gateway": [
                "mode": " remote ",
            ],
        ]

        let resolved = ConnectionModeResolver.resolve(root: root, defaults: defaults)
        #expect(resolved.mode == .remote)
    }

    @Test func connectionModeResolverFallsBackToDefaultsWhenMissingConfig() {
        let defaults = self.makeDefaults()
        defaults.set("remote", forKey: connectionModeKey)

        let resolved = ConnectionModeResolver.resolve(root: [:], defaults: defaults)
        #expect(resolved.mode == .remote)
    }

    @Test func connectionModeResolverFallsBackToDefaultsOnUnknownConfig() {
        let defaults = self.makeDefaults()
        defaults.set("local", forKey: connectionModeKey)

        let root: [String: Any] = [
            "gateway": [
                "mode": "staging",
            ],
        ]

        let resolved = ConnectionModeResolver.resolve(root: root, defaults: defaults)
        #expect(resolved.mode == .local)
    }

    @Test func connectionModeResolverPrefersRemoteURLWhenModeMissing() {
        let defaults = self.makeDefaults()
        defaults.set("local", forKey: connectionModeKey)

        let root: [String: Any] = [
            "gateway": [
                "remote": [
                    "url": " ws://umbrel:18789 ",
                ],
            ],
        ]

        let resolved = ConnectionModeResolver.resolve(root: root, defaults: defaults)
        #expect(resolved.mode == .remote)
    }

    @Test func resolveLocalGatewayHostUsesLoopbackForAutoEvenWithTailnet() {
        let host = GatewayEndpointStore._testResolveLocalGatewayHost(
            bindMode: "auto",
            tailscaleIP: "100.64.1.2")
        #expect(host == "127.0.0.1")
    }

    @Test func resolveLocalGatewayHostUsesLoopbackForAutoWithoutTailnet() {
        let host = GatewayEndpointStore._testResolveLocalGatewayHost(
            bindMode: "auto",
            tailscaleIP: nil)
        #expect(host == "127.0.0.1")
    }

    @Test func resolveLocalGatewayHostPrefersTailnetForTailnetMode() {
        let host = GatewayEndpointStore._testResolveLocalGatewayHost(
            bindMode: "tailnet",
            tailscaleIP: "100.64.1.5")
        #expect(host == "100.64.1.5")
    }

    @Test func resolveLocalGatewayHostFallsBackToLoopbackForTailnetMode() {
        let host = GatewayEndpointStore._testResolveLocalGatewayHost(
            bindMode: "tailnet",
            tailscaleIP: nil)
        #expect(host == "127.0.0.1")
    }

    @Test func resolveLocalGatewayHostUsesCustomBindHost() {
        let host = GatewayEndpointStore._testResolveLocalGatewayHost(
            bindMode: "custom",
            tailscaleIP: "100.64.1.9",
            customBindHost: "192.168.1.10")
        #expect(host == "192.168.1.10")
    }

    @Test func dashboardURLUsesLocalBasePathInLocalMode() throws {
        let config: GatewayConnection.Config = (
            url: try #require(URL(string: "ws://127.0.0.1:18789")),
            token: nil,
            password: nil
        )

        let url = try GatewayEndpointStore.dashboardURL(
            for: config,
            mode: .local,
            localBasePath: " control ")
        #expect(url.absoluteString == "http://127.0.0.1:18789/control/")
    }

    @Test func dashboardURLSkipsLocalBasePathInRemoteMode() throws {
        let config: GatewayConnection.Config = (
            url: try #require(URL(string: "ws://gateway.example:18789")),
            token: nil,
            password: nil
        )

        let url = try GatewayEndpointStore.dashboardURL(
            for: config,
            mode: .remote,
            localBasePath: "/local-ui")
        #expect(url.absoluteString == "http://gateway.example:18789/")
    }

    @Test func dashboardURLPrefersPathFromConfigURL() throws {
        let config: GatewayConnection.Config = (
            url: try #require(URL(string: "wss://gateway.example:443/remote-ui")),
            token: nil,
            password: nil
        )

        let url = try GatewayEndpointStore.dashboardURL(
            for: config,
            mode: .remote,
            localBasePath: "/local-ui")
        #expect(url.absoluteString == "https://gateway.example:443/remote-ui/")
    }

    @Test func normalizeGatewayUrlAddsDefaultPortForLoopbackWs() {
        let url = GatewayRemoteConfig.normalizeGatewayUrl("ws://127.0.0.1")
        #expect(url?.port == 18789)
        #expect(url?.absoluteString == "ws://127.0.0.1:18789")
    }

    @Test func normalizeGatewayUrlRejectsNonLoopbackWs() {
        let url = GatewayRemoteConfig.normalizeGatewayUrl("ws://gateway.example:18789")
        #expect(url == nil)
    }

    @Test func normalizeGatewayUrlRejectsPrefixBypassLoopbackHost() {
        let url = GatewayRemoteConfig.normalizeGatewayUrl("ws://127.attacker.example")
        #expect(url == nil)
    }
}
