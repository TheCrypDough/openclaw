/*
 * AUTO ANNOTATION
 * File: apps/macos/Tests/OpenClawIPCTests/SemverTests.swift
 * Purpose: File in apps area for project orchestration/configuration/data.
 * Module area: Native apps (macOS / iOS / Android / shared app assets)
 * System effect: Change can influence native apps (macos / ios / android / shared app assets) and therefore affects build/runtime behavior indirectly.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import Testing
@testable import OpenClaw

@Suite struct SemverTests {
    @Test func comparisonOrdersByMajorMinorPatch() {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let a = Semver(major: 1, minor: 0, patch: 0)
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let b = Semver(major: 1, minor: 1, patch: 0)
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let c = Semver(major: 1, minor: 1, patch: 1)
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let d = Semver(major: 2, minor: 0, patch: 0)

        #expect(a < b)
        #expect(b < c)
        #expect(c < d)
        #expect(d > a)
    }

    @Test func descriptionMatchesParts() {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let v = Semver(major: 3, minor: 2, patch: 1)
        #expect(v.description == "3.2.1")
    }
}
