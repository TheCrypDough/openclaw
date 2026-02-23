/*
 * AUTO ANNOTATION
 * File: apps/macos/Tests/OpenClawIPCTests/GatewayDiscoveryHelpersTests.swift
 * Purpose: File in apps area for project orchestration/configuration/data.
 * Module area: Native apps (macOS / iOS / Android / shared app assets)
 * System effect: Change can influence native apps (macos / ios / android / shared app assets) and therefore affects build/runtime behavior indirectly.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import Foundation
import OpenClawDiscovery
import Testing
@testable import OpenClaw

@Suite
struct GatewayDiscoveryHelpersTests {
    private func makeGateway(
        serviceHost: String?,
        servicePort: Int?,
        lanHost: String? = "txt-host.local",
        tailnetDns: String? = "txt-host.ts.net",
        sshPort: Int = 22,
        gatewayPort: Int? = 18789) -> GatewayDiscoveryModel.DiscoveredGateway
    {
        GatewayDiscoveryModel.DiscoveredGateway(
            displayName: "Gateway",
            serviceHost: serviceHost,
            servicePort: servicePort,
            lanHost: lanHost,
            tailnetDns: tailnetDns,
            sshPort: sshPort,
            gatewayPort: gatewayPort,
            cliPath: "/tmp/openclaw",
            stableID: UUID().uuidString,
            debugID: UUID().uuidString,
            isLocal: false)
    }

    @Test func sshTargetUsesResolvedServiceHostOnly() {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let gateway = self.makeGateway(
            serviceHost: "resolved.example.ts.net",
            servicePort: 18789,
            sshPort: 2201)

        guard let target = GatewayDiscoveryHelpers.sshTarget(for: gateway) else {
            Issue.record("expected ssh target")
            return
        }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let parsed = CommandResolver.parseSSHTarget(target)
        #expect(parsed?.host == "resolved.example.ts.net")
        #expect(parsed?.port == 2201)
    }

    @Test func sshTargetAllowsMissingResolvedServicePort() {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let gateway = self.makeGateway(
            serviceHost: "resolved.example.ts.net",
            servicePort: nil,
            sshPort: 2201)

        guard let target = GatewayDiscoveryHelpers.sshTarget(for: gateway) else {
            Issue.record("expected ssh target")
            return
        }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let parsed = CommandResolver.parseSSHTarget(target)
        #expect(parsed?.host == "resolved.example.ts.net")
        #expect(parsed?.port == 2201)
    }

    @Test func sshTargetRejectsTxtOnlyGateways() {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let gateway = self.makeGateway(
            serviceHost: nil,
            servicePort: nil,
            lanHost: "txt-only.local",
            tailnetDns: "txt-only.ts.net",
            sshPort: 2222)

        #expect(GatewayDiscoveryHelpers.sshTarget(for: gateway) == nil)
    }

    @Test func directUrlUsesResolvedServiceEndpointOnly() {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let tlsGateway = self.makeGateway(
            serviceHost: "resolved.example.ts.net",
            servicePort: 443)
        #expect(GatewayDiscoveryHelpers.directUrl(for: tlsGateway) == "wss://resolved.example.ts.net")

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let wsGateway = self.makeGateway(
            serviceHost: "resolved.example.ts.net",
            servicePort: 18789)
        #expect(GatewayDiscoveryHelpers.directUrl(for: wsGateway) == "wss://resolved.example.ts.net:18789")

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let localGateway = self.makeGateway(
            serviceHost: "127.0.0.1",
            servicePort: 18789)
        #expect(GatewayDiscoveryHelpers.directUrl(for: localGateway) == "ws://127.0.0.1:18789")
    }

    @Test func directUrlRejectsTxtOnlyFallback() {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let gateway = self.makeGateway(
            serviceHost: nil,
            servicePort: nil,
            lanHost: "txt-only.local",
            tailnetDns: "txt-only.ts.net",
            gatewayPort: 22222)

        #expect(GatewayDiscoveryHelpers.directUrl(for: gateway) == nil)
    }
}
