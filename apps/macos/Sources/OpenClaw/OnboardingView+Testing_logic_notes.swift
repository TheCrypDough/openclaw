/*
 * AUTO ANNOTATION
 * File: apps/macos/Sources/OpenClaw/OnboardingView+Testing.swift
 * Purpose: File in apps area for project orchestration/configuration/data.
 * Module area: Native apps (macOS / iOS / Android / shared app assets)
 * System effect: Change can influence native apps (macos / ios / android / shared app assets) and therefore affects build/runtime behavior indirectly.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import OpenClawDiscovery
import SwiftUI

#if DEBUG
@MainActor
extension OnboardingView {
    static func exerciseForTesting() {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let state = AppState(preview: true)
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let discovery = GatewayDiscoveryModel(localDisplayName: InstanceIdentity.displayName)
        discovery.statusText = "Searching..."
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let gateway = GatewayDiscoveryModel.DiscoveredGateway(
            displayName: "Test Gateway",
            lanHost: "gateway.local",
            tailnetDns: "gateway.ts.net",
            sshPort: 2222,
            gatewayPort: 18789,
            cliPath: "/usr/local/bin/openclaw",
            stableID: "gateway-1",
            debugID: "gateway-1",
            isLocal: false)
        discovery.gateways = [gateway]

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let view = OnboardingView(
            state: state,
            permissionMonitor: PermissionMonitor.shared,
            discoveryModel: discovery)
        view.needsBootstrap = true
        view.localGatewayProbe = LocalGatewayProbe(
            port: GatewayEnvironment.gatewayPort(),
            pid: 123,
            command: "openclaw-gateway",
            expected: true)
        view.showAdvancedConnection = true
        view.preferredGatewayID = gateway.stableID
        view.cliInstalled = true
        view.cliInstallLocation = "/usr/local/bin/openclaw"
        view.cliStatus = "Installed"
        view.workspacePath = "/tmp/openclaw"
        view.workspaceStatus = "Saved workspace"
        view.anthropicAuthPKCE = AnthropicOAuth.PKCE(verifier: "verifier", challenge: "challenge")
        view.anthropicAuthCode = "code#state"
        view.anthropicAuthStatus = "Connected"
        view.anthropicAuthDetectedStatus = .connected(expiresAtMs: 1_700_000_000_000)
        view.anthropicAuthConnected = true
        view.anthropicAuthAutoDetectClipboard = false
        view.anthropicAuthAutoConnectClipboard = false

        view.state.connectionMode = .local
        _ = view.welcomePage()
        _ = view.connectionPage()
        _ = view.anthropicAuthPage()
        _ = view.wizardPage()
        _ = view.permissionsPage()
        _ = view.cliPage()
        _ = view.workspacePage()
        _ = view.onboardingChatPage()
        _ = view.readyPage()

        view.selectLocalGateway()
        view.selectRemoteGateway(gateway)
        view.selectUnconfiguredGateway()

        view.state.connectionMode = .remote
        _ = view.connectionPage()
        _ = view.workspacePage()

        view.state.connectionMode = .unconfigured
        _ = view.connectionPage()

        view.currentPage = 0
        view.handleNext()
        view.handleBack()

        _ = view.onboardingPage { Text("Test") }
        _ = view.onboardingCard { Text("Card") }
        _ = view.featureRow(title: "Feature", subtitle: "Subtitle", systemImage: "sparkles")
        _ = view.featureActionRow(
            title: "Action",
            subtitle: "Action subtitle",
            systemImage: "gearshape",
            buttonTitle: "Action",
            action: {})
        _ = view.gatewaySubtitle(for: gateway)
        _ = view.isSelectedGateway(gateway)
    }
}
#endif
