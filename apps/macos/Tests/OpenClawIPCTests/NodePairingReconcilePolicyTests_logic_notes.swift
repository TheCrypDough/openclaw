/*
 * AUTO ANNOTATION
 * File: apps/macos/Tests/OpenClawIPCTests/NodePairingReconcilePolicyTests.swift
 * Purpose: File in apps area for project orchestration/configuration/data.
 * Module area: Native apps (macOS / iOS / Android / shared app assets)
 * System effect: Change can influence native apps (macos / ios / android / shared app assets) and therefore affects build/runtime behavior indirectly.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import Testing
@testable import OpenClaw

@Suite struct NodePairingReconcilePolicyTests {
    @Test func policyPollsOnlyWhenActive() {
        #expect(NodePairingReconcilePolicy.shouldPoll(pendingCount: 0, isPresenting: false) == false)
        #expect(NodePairingReconcilePolicy.shouldPoll(pendingCount: 1, isPresenting: false))
        #expect(NodePairingReconcilePolicy.shouldPoll(pendingCount: 0, isPresenting: true))
    }

    @Test func policyUsesSlowSafetyInterval() {
        #expect(NodePairingReconcilePolicy.activeIntervalMs >= 10000)
    }
}
