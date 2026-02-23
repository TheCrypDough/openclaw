/*
 * AUTO ANNOTATION
 * File: apps/macos/Tests/OpenClawIPCTests/OnboardingViewSmokeTests.swift
 * Purpose: File in apps area for project orchestration/configuration/data.
 * Module area: Native apps (macOS / iOS / Android / shared app assets)
 * System effect: Change can influence native apps (macos / ios / android / shared app assets) and therefore affects build/runtime behavior indirectly.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import Foundation
import OpenClawDiscovery
import SwiftUI
import Testing
@testable import OpenClaw

@Suite(.serialized)
@MainActor
struct OnboardingViewSmokeTests {
    @Test func onboardingViewBuildsBody() {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let state = AppState(preview: true)
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let view = OnboardingView(
            state: state,
            permissionMonitor: PermissionMonitor.shared,
            discoveryModel: GatewayDiscoveryModel(localDisplayName: InstanceIdentity.displayName))
        _ = view.body
    }

    @Test func pageOrderOmitsWorkspaceAndIdentitySteps() {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let order = OnboardingView.pageOrder(for: .local, showOnboardingChat: false)
        #expect(!order.contains(7))
        #expect(order.contains(3))
    }

    @Test func pageOrderOmitsOnboardingChatWhenIdentityKnown() {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let order = OnboardingView.pageOrder(for: .local, showOnboardingChat: false)
        #expect(!order.contains(8))
    }

    @Test func selectRemoteGatewayClearsStaleSshTargetWhenEndpointUnresolved() async {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let override = FileManager().temporaryDirectory
            .appendingPathComponent("openclaw-config-\(UUID().uuidString)")
            .appendingPathComponent("openclaw.json")
            .path

        await TestIsolation.withEnvValues(["OPENCLAW_CONFIG_PATH": override]) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
            let state = AppState(preview: true)
            state.remoteTransport = .ssh
            state.remoteTarget = "user@old-host:2222"
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
            let view = OnboardingView(
                state: state,
                permissionMonitor: PermissionMonitor.shared,
                discoveryModel: GatewayDiscoveryModel(localDisplayName: InstanceIdentity.displayName))
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
            let gateway = GatewayDiscoveryModel.DiscoveredGateway(
                displayName: "Unresolved",
                serviceHost: nil,
                servicePort: nil,
                lanHost: "txt-host.local",
                tailnetDns: "txt-host.ts.net",
                sshPort: 22,
                gatewayPort: 18789,
                cliPath: "/tmp/openclaw",
                stableID: UUID().uuidString,
                debugID: UUID().uuidString,
                isLocal: false)

            view.selectRemoteGateway(gateway)
            #expect(state.remoteTarget.isEmpty)
        }
    }
}
