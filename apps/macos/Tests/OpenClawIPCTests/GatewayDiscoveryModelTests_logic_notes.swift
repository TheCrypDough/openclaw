/*
 * AUTO ANNOTATION
 * File: apps/macos/Tests/OpenClawIPCTests/GatewayDiscoveryModelTests.swift
 * Purpose: File in apps area for project orchestration/configuration/data.
 * Module area: Native apps (macOS / iOS / Android / shared app assets)
 * System effect: Change can influence native apps (macos / ios / android / shared app assets) and therefore affects build/runtime behavior indirectly.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import OpenClawDiscovery
import Testing

@Suite
@MainActor
struct GatewayDiscoveryModelTests {
    @Test func localGatewayMatchesLanHost() {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let local = GatewayDiscoveryModel.LocalIdentity(
            hostTokens: ["studio"],
            displayTokens: [])
        #expect(GatewayDiscoveryModel.isLocalGateway(
            lanHost: "studio.local",
            tailnetDns: nil,
            displayName: nil,
            serviceName: nil,
            local: local))
    }

    @Test func localGatewayMatchesTailnetDns() {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let local = GatewayDiscoveryModel.LocalIdentity(
            hostTokens: ["studio"],
            displayTokens: [])
        #expect(GatewayDiscoveryModel.isLocalGateway(
            lanHost: nil,
            tailnetDns: "studio.tailnet.example",
            displayName: nil,
            serviceName: nil,
            local: local))
    }

    @Test func localGatewayMatchesDisplayName() {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let local = GatewayDiscoveryModel.LocalIdentity(
            hostTokens: [],
            displayTokens: ["peter's mac studio"])
        #expect(GatewayDiscoveryModel.isLocalGateway(
            lanHost: nil,
            tailnetDns: nil,
            displayName: "Peter's Mac Studio (OpenClaw)",
            serviceName: nil,
            local: local))
    }

    @Test func remoteGatewayDoesNotMatch() {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let local = GatewayDiscoveryModel.LocalIdentity(
            hostTokens: ["studio"],
            displayTokens: ["peter's mac studio"])
        #expect(!GatewayDiscoveryModel.isLocalGateway(
            lanHost: "other.local",
            tailnetDns: "other.tailnet.example",
            displayName: "Other Mac",
            serviceName: "other-gateway",
            local: local))
    }

    @Test func localGatewayMatchesServiceName() {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let local = GatewayDiscoveryModel.LocalIdentity(
            hostTokens: ["studio"],
            displayTokens: [])
        #expect(GatewayDiscoveryModel.isLocalGateway(
            lanHost: nil,
            tailnetDns: nil,
            displayName: nil,
            serviceName: "studio-gateway",
            local: local))
    }

    @Test func serviceNameDoesNotFalsePositiveOnSubstringHostToken() {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let local = GatewayDiscoveryModel.LocalIdentity(
            hostTokens: ["steipete"],
            displayTokens: [])
        #expect(!GatewayDiscoveryModel.isLocalGateway(
            lanHost: nil,
            tailnetDns: nil,
            displayName: nil,
            serviceName: "steipetacstudio (OpenClaw)",
            local: local))
        #expect(GatewayDiscoveryModel.isLocalGateway(
            lanHost: nil,
            tailnetDns: nil,
            displayName: nil,
            serviceName: "steipete (OpenClaw)",
            local: local))
    }

    @Test func parsesGatewayTXTFields() {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let parsed = GatewayDiscoveryModel.parseGatewayTXT([
            "lanHost": "  studio.local  ",
            "tailnetDns": "  peters-mac-studio-1.ts.net  ",
            "sshPort": " 2222 ",
            "gatewayPort": " 18799 ",
            "cliPath": " /opt/openclaw ",
        ])
        #expect(parsed.lanHost == "studio.local")
        #expect(parsed.tailnetDns == "peters-mac-studio-1.ts.net")
        #expect(parsed.sshPort == 2222)
        #expect(parsed.gatewayPort == 18799)
        #expect(parsed.cliPath == "/opt/openclaw")
    }

    @Test func parsesGatewayTXTDefaults() {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let parsed = GatewayDiscoveryModel.parseGatewayTXT([
            "lanHost": "  ",
            "tailnetDns": "\n",
            "gatewayPort": "nope",
            "sshPort": "nope",
        ])
        #expect(parsed.lanHost == nil)
        #expect(parsed.tailnetDns == nil)
        #expect(parsed.sshPort == 22)
        #expect(parsed.gatewayPort == nil)
        #expect(parsed.cliPath == nil)
    }

    @Test func buildsSSHTarget() {
        #expect(GatewayDiscoveryModel.buildSSHTarget(
            user: "peter",
            host: "studio.local",
            port: 22) == "peter@studio.local")
        #expect(GatewayDiscoveryModel.buildSSHTarget(
            user: "peter",
            host: "studio.local",
            port: 2201) == "peter@studio.local:2201")
    }
}
