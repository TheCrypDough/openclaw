/*
 * AUTO ANNOTATION
 * File: apps/ios/Tests/KeychainStoreTests.swift
 * Purpose: File in apps area for project orchestration/configuration/data.
 * Module area: Native apps (macOS / iOS / Android / shared app assets)
 * System effect: Change can influence native apps (macos / ios / android / shared app assets) and therefore affects build/runtime behavior indirectly.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import Foundation
import Testing
@testable import OpenClaw

@Suite struct KeychainStoreTests {
    @Test func saveLoadUpdateDeleteRoundTrip() {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let service = "bot.molt.tests.\(UUID().uuidString)"
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let account = "value"

        #expect(KeychainStore.delete(service: service, account: account))
        #expect(KeychainStore.loadString(service: service, account: account) == nil)

        #expect(KeychainStore.saveString("first", service: service, account: account))
        #expect(KeychainStore.loadString(service: service, account: account) == "first")

        #expect(KeychainStore.saveString("second", service: service, account: account))
        #expect(KeychainStore.loadString(service: service, account: account) == "second")

        #expect(KeychainStore.delete(service: service, account: account))
        #expect(KeychainStore.loadString(service: service, account: account) == nil)
    }
}
