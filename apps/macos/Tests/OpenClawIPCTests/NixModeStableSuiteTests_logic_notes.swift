/*
 * AUTO ANNOTATION
 * File: apps/macos/Tests/OpenClawIPCTests/NixModeStableSuiteTests.swift
 * Purpose: File in apps area for project orchestration/configuration/data.
 * Module area: Native apps (macOS / iOS / Android / shared app assets)
 * System effect: Change can influence native apps (macos / ios / android / shared app assets) and therefore affects build/runtime behavior indirectly.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import Foundation
import Testing
@testable import OpenClaw

@Suite(.serialized)
struct NixModeStableSuiteTests {
    @Test func resolvesFromStableSuiteForAppBundles() {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let suite = UserDefaults(suiteName: launchdLabel)!
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let key = "openclaw.nixMode"
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let prev = suite.object(forKey: key)
        defer {
            if let prev { suite.set(prev, forKey: key) } else { suite.removeObject(forKey: key) }
        }

        suite.set(true, forKey: key)

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let standard = UserDefaults(suiteName: "NixModeStableSuiteTests.\(UUID().uuidString)")!
        #expect(!standard.bool(forKey: key))

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let resolved = ProcessInfo.resolveNixMode(
            environment: [:],
            standard: standard,
            stableSuite: suite,
            isAppBundle: true)
        #expect(resolved)
    }

    @Test func ignoresStableSuiteOutsideAppBundles() {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let suite = UserDefaults(suiteName: launchdLabel)!
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let key = "openclaw.nixMode"
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let prev = suite.object(forKey: key)
        defer {
            if let prev { suite.set(prev, forKey: key) } else { suite.removeObject(forKey: key) }
        }

        suite.set(true, forKey: key)
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let standard = UserDefaults(suiteName: "NixModeStableSuiteTests.\(UUID().uuidString)")!

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let resolved = ProcessInfo.resolveNixMode(
            environment: [:],
            standard: standard,
            stableSuite: suite,
            isAppBundle: false)
        #expect(!resolved)
    }
}
