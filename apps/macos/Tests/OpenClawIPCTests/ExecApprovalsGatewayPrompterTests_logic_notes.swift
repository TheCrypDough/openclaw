/*
 * AUTO ANNOTATION
 * File: apps/macos/Tests/OpenClawIPCTests/ExecApprovalsGatewayPrompterTests.swift
 * Purpose: File in apps area for project orchestration/configuration/data.
 * Module area: Native apps (macOS / iOS / Android / shared app assets)
 * System effect: Change can influence native apps (macos / ios / android / shared app assets) and therefore affects build/runtime behavior indirectly.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import Testing
@testable import OpenClaw

@Suite
@MainActor
struct ExecApprovalsGatewayPrompterTests {
    @Test func sessionMatchPrefersActiveSession() {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let matches = ExecApprovalsGatewayPrompter._testShouldPresent(
            mode: .remote,
            activeSession: " main ",
            requestSession: "main",
            lastInputSeconds: nil)
        #expect(matches)

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let mismatched = ExecApprovalsGatewayPrompter._testShouldPresent(
            mode: .remote,
            activeSession: "other",
            requestSession: "main",
            lastInputSeconds: 0)
        #expect(!mismatched)
    }

    @Test func sessionFallbackUsesRecentActivity() {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let recent = ExecApprovalsGatewayPrompter._testShouldPresent(
            mode: .remote,
            activeSession: nil,
            requestSession: "main",
            lastInputSeconds: 10,
            thresholdSeconds: 120)
        #expect(recent)

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let stale = ExecApprovalsGatewayPrompter._testShouldPresent(
            mode: .remote,
            activeSession: nil,
            requestSession: "main",
            lastInputSeconds: 200,
            thresholdSeconds: 120)
        #expect(!stale)
    }

    @Test func defaultBehaviorMatchesMode() {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let local = ExecApprovalsGatewayPrompter._testShouldPresent(
            mode: .local,
            activeSession: nil,
            requestSession: nil,
            lastInputSeconds: 400)
        #expect(local)

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let remote = ExecApprovalsGatewayPrompter._testShouldPresent(
            mode: .remote,
            activeSession: nil,
            requestSession: nil,
            lastInputSeconds: 400)
        #expect(!remote)
    }
}
