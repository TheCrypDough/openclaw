/*
 * AUTO ANNOTATION
 * File: apps/ios/Tests/SwiftUIRenderSmokeTests.swift
 * Purpose: File in apps area for project orchestration/configuration/data.
 * Module area: Native apps (macOS / iOS / Android / shared app assets)
 * System effect: Change can influence native apps (macos / ios / android / shared app assets) and therefore affects build/runtime behavior indirectly.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import OpenClawKit
import SwiftUI
import Testing
import UIKit
@testable import OpenClaw

@Suite struct SwiftUIRenderSmokeTests {
    @MainActor private static func host(_ view: some View) -> UIWindow {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let window = UIWindow(frame: UIScreen.main.bounds)
        window.rootViewController = UIHostingController(rootView: view)
        window.makeKeyAndVisible()
        window.rootViewController?.view.setNeedsLayout()
        window.rootViewController?.view.layoutIfNeeded()
        return window
    }

    @Test @MainActor func statusPillConnectingBuildsAViewHierarchy() {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let root = StatusPill(gateway: .connecting, voiceWakeEnabled: true, brighten: true) {}
        _ = Self.host(root)
    }

    @Test @MainActor func statusPillDisconnectedBuildsAViewHierarchy() {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let root = StatusPill(gateway: .disconnected, voiceWakeEnabled: false) {}
        _ = Self.host(root)
    }

    @Test @MainActor func settingsTabBuildsAViewHierarchy() {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let appModel = NodeAppModel()
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let gatewayController = GatewayConnectionController(appModel: appModel, startDiscovery: false)

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let root = SettingsTab()
            .environment(appModel)
            .environment(appModel.voiceWake)
            .environment(gatewayController)

        _ = Self.host(root)
    }

    @Test @MainActor func rootTabsBuildAViewHierarchy() {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let appModel = NodeAppModel()
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let gatewayController = GatewayConnectionController(appModel: appModel, startDiscovery: false)

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let root = RootTabs()
            .environment(appModel)
            .environment(appModel.voiceWake)
            .environment(gatewayController)

        _ = Self.host(root)
    }

    @Test @MainActor func voiceTabBuildsAViewHierarchy() {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let appModel = NodeAppModel()

        let root = VoiceTab()
            .environment(appModel)
            .environment(appModel.voiceWake)

        _ = Self.host(root)
    }

    @Test @MainActor func voiceWakeWordsViewBuildsAViewHierarchy() {
        let appModel = NodeAppModel()
        let root = NavigationStack { VoiceWakeWordsSettingsView() }
            .environment(appModel)
        _ = Self.host(root)
    }

    @Test @MainActor func chatSheetBuildsAViewHierarchy() {
        let appModel = NodeAppModel()
        let gateway = GatewayNodeSession()
        let root = ChatSheet(gateway: gateway, sessionKey: "test")
            .environment(appModel)
            .environment(appModel.voiceWake)
        _ = Self.host(root)
    }

    @Test @MainActor func voiceWakeToastBuildsAViewHierarchy() {
        let root = VoiceWakeToast(command: "openclaw: do something")
        _ = Self.host(root)
    }
}
