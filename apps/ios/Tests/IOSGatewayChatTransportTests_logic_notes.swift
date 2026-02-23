/*
 * AUTO ANNOTATION
 * File: apps/ios/Tests/IOSGatewayChatTransportTests.swift
 * Purpose: File in apps area for project orchestration/configuration/data.
 * Module area: Native apps (macOS / iOS / Android / shared app assets)
 * System effect: Change can influence native apps (macos / ios / android / shared app assets) and therefore affects build/runtime behavior indirectly.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import OpenClawKit
import Testing
@testable import OpenClaw

@Suite struct IOSGatewayChatTransportTests {
    @Test func requestsFailFastWhenGatewayNotConnected() async {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let gateway = GatewayNodeSession()
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let transport = IOSGatewayChatTransport(gateway: gateway)

        do {
            _ = try await transport.requestHistory(sessionKey: "node-test")
            Issue.record("Expected requestHistory to throw when gateway not connected")
        } catch {}

        do {
            _ = try await transport.sendMessage(
                sessionKey: "node-test",
                message: "hello",
                thinking: "low",
                idempotencyKey: "idempotency",
                attachments: [])
            Issue.record("Expected sendMessage to throw when gateway not connected")
        } catch {}

        do {
            _ = try await transport.requestHealth(timeoutMs: 250)
            Issue.record("Expected requestHealth to throw when gateway not connected")
        } catch {}
    }
}
