/*
 * AUTO ANNOTATION
 * File: apps/macos/Tests/OpenClawIPCTests/HealthDecodeTests.swift
 * Purpose: File in apps area for project orchestration/configuration/data.
 * Module area: Native apps (macOS / iOS / Android / shared app assets)
 * System effect: Change can influence native apps (macos / ios / android / shared app assets) and therefore affects build/runtime behavior indirectly.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import Foundation
import Testing
@testable import OpenClaw

@Suite struct HealthDecodeTests {
    private let sampleJSON: String = // minimal but complete payload
        """
        {"ts":1733622000,"durationMs":420,"channels":{"whatsapp":{"linked":true,"authAgeMs":120000},"telegram":{"configured":true,"probe":{"ok":true,"elapsedMs":800}}},"channelOrder":["whatsapp","telegram"],"heartbeatSeconds":60,"sessions":{"path":"/tmp/sessions.json","count":1,"recent":[{"key":"abc","updatedAt":1733621900,"age":120000}]}}
        """

    @Test func decodesCleanJSON() async throws {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let data = Data(sampleJSON.utf8)
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let snap = decodeHealthSnapshot(from: data)

        #expect(snap?.channels["whatsapp"]?.linked == true)
        #expect(snap?.sessions.count == 1)
    }

    @Test func decodesWithLeadingNoise() async throws {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let noisy = "debug: something logged\n" + self.sampleJSON + "\ntrailer"
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let snap = decodeHealthSnapshot(from: Data(noisy.utf8))

        #expect(snap?.channels["telegram"]?.probe?.elapsedMs == 800)
    }

    @Test func failsWithoutBraces() async throws {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let data = Data("no json here".utf8)
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let snap = decodeHealthSnapshot(from: data)

        #expect(snap == nil)
    }
}
