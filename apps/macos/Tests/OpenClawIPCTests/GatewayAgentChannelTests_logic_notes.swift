/*
 * AUTO ANNOTATION
 * File: apps/macos/Tests/OpenClawIPCTests/GatewayAgentChannelTests.swift
 * Purpose: File in apps area for project orchestration/configuration/data.
 * Module area: Native apps (macOS / iOS / Android / shared app assets)
 * System effect: Change can influence native apps (macos / ios / android / shared app assets) and therefore affects build/runtime behavior indirectly.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import Testing
@testable import OpenClaw

@Suite struct GatewayAgentChannelTests {
    @Test func shouldDeliverBlocksWebChat() {
        #expect(GatewayAgentChannel.webchat.shouldDeliver(true) == false)
        #expect(GatewayAgentChannel.webchat.shouldDeliver(false) == false)
    }

    @Test func shouldDeliverAllowsLastAndProviderChannels() {
        #expect(GatewayAgentChannel.last.shouldDeliver(true) == true)
        #expect(GatewayAgentChannel.whatsapp.shouldDeliver(true) == true)
        #expect(GatewayAgentChannel.telegram.shouldDeliver(true) == true)
        #expect(GatewayAgentChannel.googlechat.shouldDeliver(true) == true)
        #expect(GatewayAgentChannel.bluebubbles.shouldDeliver(true) == true)
        #expect(GatewayAgentChannel.last.shouldDeliver(false) == false)
    }

    @Test func initRawNormalizesAndFallsBackToLast() {
        #expect(GatewayAgentChannel(raw: nil) == .last)
        #expect(GatewayAgentChannel(raw: "  ") == .last)
        #expect(GatewayAgentChannel(raw: "WEBCHAT") == .webchat)
        #expect(GatewayAgentChannel(raw: "googlechat") == .googlechat)
        #expect(GatewayAgentChannel(raw: "BLUEBUBBLES") == .bluebubbles)
        #expect(GatewayAgentChannel(raw: "unknown") == .last)
    }
}
