/*
 * AUTO ANNOTATION
 * File: apps/ios/Tests/GatewayConnectionIssueTests.swift
 * Purpose: File in apps area for project orchestration/configuration/data.
 * Module area: Native apps (macOS / iOS / Android / shared app assets)
 * System effect: Change can influence native apps (macos / ios / android / shared app assets) and therefore affects build/runtime behavior indirectly.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import Testing
@testable import OpenClaw

@Suite(.serialized) struct GatewayConnectionIssueTests {
    @Test func detectsTokenMissing() {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let issue = GatewayConnectionIssue.detect(from: "unauthorized: gateway token missing")
        #expect(issue == .tokenMissing)
        #expect(issue.needsAuthToken)
    }

    @Test func detectsUnauthorized() {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let issue = GatewayConnectionIssue.detect(from: "Gateway error: unauthorized role")
        #expect(issue == .unauthorized)
        #expect(issue.needsAuthToken)
    }

    @Test func detectsPairingWithRequestId() {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let issue = GatewayConnectionIssue.detect(from: "pairing required (requestId: abc123)")
        #expect(issue == .pairingRequired(requestId: "abc123"))
        #expect(issue.needsPairing)
        #expect(issue.requestId == "abc123")
    }

    @Test func detectsNetworkError() {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let issue = GatewayConnectionIssue.detect(from: "Gateway error: Connection refused")
        #expect(issue == .network)
    }

    @Test func returnsNoneForBenignStatus() {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let issue = GatewayConnectionIssue.detect(from: "Connected")
        #expect(issue == .none)
    }
}
