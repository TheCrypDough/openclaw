/*
 * AUTO ANNOTATION
 * File: apps/macos/Tests/OpenClawIPCTests/MasterDiscoveryMenuSmokeTests.swift
 * Purpose: File in apps area for project orchestration/configuration/data.
 * Module area: Native apps (macOS / iOS / Android / shared app assets)
 * System effect: Change can influence native apps (macos / ios / android / shared app assets) and therefore affects build/runtime behavior indirectly.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import OpenClawDiscovery
import SwiftUI
import Testing
@testable import OpenClaw

@Suite(.serialized)
@MainActor
struct MasterDiscoveryMenuSmokeTests {
    @Test func inlineListBuildsBodyWhenEmpty() {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let discovery = GatewayDiscoveryModel(localDisplayName: InstanceIdentity.displayName)
        discovery.statusText = "Searching…"
        discovery.gateways = []

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let view = GatewayDiscoveryInlineList(
            discovery: discovery,
            currentTarget: nil,
            currentUrl: nil,
            transport: .ssh,
            onSelect: { _ in })
        _ = view.body
    }

    @Test func inlineListBuildsBodyWithMasterAndSelection() {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let discovery = GatewayDiscoveryModel(localDisplayName: InstanceIdentity.displayName)
        discovery.statusText = "Found 1"
        discovery.gateways = [
            GatewayDiscoveryModel.DiscoveredGateway(
                displayName: "Office Mac",
                lanHost: "office.local",
                tailnetDns: "office.tailnet-123.ts.net",
                sshPort: 2222,
                gatewayPort: nil,
                cliPath: nil,
                stableID: "office",
                debugID: "office",
                isLocal: false),
        ]

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let currentTarget = "\(NSUserName())@office.tailnet-123.ts.net:2222"
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let view = GatewayDiscoveryInlineList(
            discovery: discovery,
            currentTarget: currentTarget,
            currentUrl: nil,
            transport: .ssh,
            onSelect: { _ in })
        _ = view.body
    }

    @Test func menuBuildsBodyWithMasters() {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let discovery = GatewayDiscoveryModel(localDisplayName: InstanceIdentity.displayName)
        discovery.statusText = "Found 2"
        discovery.gateways = [
            GatewayDiscoveryModel.DiscoveredGateway(
                displayName: "A",
                lanHost: "a.local",
                tailnetDns: nil,
                sshPort: 22,
                gatewayPort: nil,
                cliPath: nil,
                stableID: "a",
                debugID: "a",
                isLocal: false),
            GatewayDiscoveryModel.DiscoveredGateway(
                displayName: "B",
                lanHost: nil,
                tailnetDns: "b.ts.net",
                sshPort: 22,
                gatewayPort: nil,
                cliPath: nil,
                stableID: "b",
                debugID: "b",
                isLocal: false),
        ]

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let view = GatewayDiscoveryMenu(discovery: discovery, onSelect: { _ in })
        _ = view.body
    }
}
