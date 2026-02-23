/*
 * AUTO ANNOTATION
 * File: apps/ios/Tests/OnboardingStateStoreTests.swift
 * Purpose: File in apps area for project orchestration/configuration/data.
 * Module area: Native apps (macOS / iOS / Android / shared app assets)
 * System effect: Change can influence native apps (macos / ios / android / shared app assets) and therefore affects build/runtime behavior indirectly.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import Foundation
import Testing
@testable import OpenClaw

@Suite(.serialized) struct OnboardingStateStoreTests {
    @Test @MainActor func shouldPresentWhenFreshAndDisconnected() {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let testDefaults = self.makeDefaults()
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let defaults = testDefaults.defaults
        defer { self.reset(testDefaults) }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let appModel = NodeAppModel()
        appModel.gatewayServerName = nil
        #expect(OnboardingStateStore.shouldPresentOnLaunch(appModel: appModel, defaults: defaults))
    }

    @Test @MainActor func doesNotPresentWhenConnected() {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let testDefaults = self.makeDefaults()
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let defaults = testDefaults.defaults
        defer { self.reset(testDefaults) }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let appModel = NodeAppModel()
        appModel.gatewayServerName = "gateway"
        #expect(!OnboardingStateStore.shouldPresentOnLaunch(appModel: appModel, defaults: defaults))
    }

    @Test @MainActor func markCompletedPersistsMode() {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let testDefaults = self.makeDefaults()
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let defaults = testDefaults.defaults
        defer { self.reset(testDefaults) }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let appModel = NodeAppModel()
        appModel.gatewayServerName = nil

        OnboardingStateStore.markCompleted(mode: .remoteDomain, defaults: defaults)
        #expect(OnboardingStateStore.lastMode(defaults: defaults) == .remoteDomain)
        #expect(!OnboardingStateStore.shouldPresentOnLaunch(appModel: appModel, defaults: defaults))

        OnboardingStateStore.markIncomplete(defaults: defaults)
        #expect(OnboardingStateStore.shouldPresentOnLaunch(appModel: appModel, defaults: defaults))
    }

    private struct TestDefaults {
        var suiteName: String
        var defaults: UserDefaults
    }

    private func makeDefaults() -> TestDefaults {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let suiteName = "OnboardingStateStoreTests.\(UUID().uuidString)"
        return TestDefaults(
            suiteName: suiteName,
            defaults: UserDefaults(suiteName: suiteName) ?? .standard)
    }

    private func reset(_ defaults: TestDefaults) {
        defaults.defaults.removePersistentDomain(forName: defaults.suiteName)
    }
}
