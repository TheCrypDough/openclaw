/*
 * AUTO ANNOTATION
 * File: apps/macos/Tests/OpenClawIPCTests/LowCoverageViewSmokeTests.swift
 * Purpose: File in apps area for project orchestration/configuration/data.
 * Module area: Native apps (macOS / iOS / Android / shared app assets)
 * System effect: Change can influence native apps (macos / ios / android / shared app assets) and therefore affects build/runtime behavior indirectly.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import AppKit
import OpenClawProtocol
import SwiftUI
import Testing

@testable import OpenClaw

@Suite(.serialized)
@MainActor
struct LowCoverageViewSmokeTests {
    @Test func contextMenuCardBuildsBody() {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let loading = ContextMenuCardView(rows: [], statusText: "Loading…", isLoading: true)
        _ = loading.body

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let empty = ContextMenuCardView(rows: [], statusText: nil, isLoading: false)
        _ = empty.body

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let withRows = ContextMenuCardView(rows: SessionRow.previewRows, statusText: nil, isLoading: false)
        _ = withRows.body
    }

    @Test func settingsToggleRowBuildsBody() {
        var flag = false
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let binding = Binding(get: { flag }, set: { flag = $0 })
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let view = SettingsToggleRow(title: "Enable", subtitle: "Detail", binding: binding)
        _ = view.body
    }

    @Test func voiceWakeTestCardBuildsBodyAcrossStates() {
        var state = VoiceWakeTestState.idle
        var isTesting = false
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let stateBinding = Binding(get: { state }, set: { state = $0 })
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let testingBinding = Binding(get: { isTesting }, set: { isTesting = $0 })

        _ = VoiceWakeTestCard(testState: stateBinding, isTesting: testingBinding, onToggle: {}).body

        state = .hearing("hello")
        _ = VoiceWakeTestCard(testState: stateBinding, isTesting: testingBinding, onToggle: {}).body

        state = .detected("command")
        isTesting = true
        _ = VoiceWakeTestCard(testState: stateBinding, isTesting: testingBinding, onToggle: {}).body

        state = .failed("No mic")
        _ = VoiceWakeTestCard(testState: stateBinding, isTesting: testingBinding, onToggle: {}).body
    }

    @Test func agentEventsWindowBuildsBodyWithEvent() {
        AgentEventStore.shared.clear()
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let sample = ControlAgentEvent(
            runId: "run-1",
            seq: 1,
            stream: "tool",
            ts: Date().timeIntervalSince1970 * 1000,
            data: ["phase": AnyCodable("start"), "name": AnyCodable("test")],
            summary: nil)
        AgentEventStore.shared.append(sample)
        _ = AgentEventsWindow().body
        AgentEventStore.shared.clear()
    }

    @Test func notifyOverlayPresentsAndDismisses() async {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let controller = NotifyOverlayController()
        controller.present(title: "Hello", body: "World", autoDismissAfter: 0)
        controller.present(title: "Updated", body: "Again", autoDismissAfter: 0)
        controller.dismiss()
        try? await Task.sleep(nanoseconds: 250_000_000)
    }

    @Test func visualEffectViewHostsInNSHostingView() {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let hosting = NSHostingView(rootView: VisualEffectView(material: .sidebar))
        _ = hosting.fittingSize
        hosting.rootView = VisualEffectView(material: .popover, emphasized: true)
        _ = hosting.fittingSize
    }

    @Test func menuHostedItemHostsContent() {
        let view = MenuHostedItem(width: 240, rootView: AnyView(Text("Menu")))
        let hosting = NSHostingView(rootView: view)
        _ = hosting.fittingSize
        hosting.rootView = MenuHostedItem(width: 320, rootView: AnyView(Text("Updated")))
        _ = hosting.fittingSize
    }

    @Test func dockIconManagerUpdatesVisibility() {
        _ = NSApplication.shared
        UserDefaults.standard.set(false, forKey: showDockIconKey)
        DockIconManager.shared.updateDockVisibility()
        DockIconManager.shared.temporarilyShowDock()
    }

    @Test func voiceWakeSettingsExercisesHelpers() {
        VoiceWakeSettings.exerciseForTesting()
    }

    @Test func debugSettingsExercisesHelpers() async {
        await DebugSettings.exerciseForTesting()
    }
}
