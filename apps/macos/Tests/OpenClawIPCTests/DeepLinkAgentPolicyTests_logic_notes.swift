/*
 * AUTO ANNOTATION
 * File: apps/macos/Tests/OpenClawIPCTests/DeepLinkAgentPolicyTests.swift
 * Purpose: File in apps area for project orchestration/configuration/data.
 * Module area: Native apps (macOS / iOS / Android / shared app assets)
 * System effect: Change can influence native apps (macos / ios / android / shared app assets) and therefore affects build/runtime behavior indirectly.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import OpenClawKit
import Testing
@testable import OpenClaw

@Suite struct DeepLinkAgentPolicyTests {
    @Test func validateMessageForHandleRejectsTooLongWhenUnkeyed() {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let msg = String(repeating: "a", count: DeepLinkAgentPolicy.maxUnkeyedConfirmChars + 1)
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let res = DeepLinkAgentPolicy.validateMessageForHandle(message: msg, allowUnattended: false)
        switch res {
        case let .failure(error):
            #expect(
                error == .messageTooLongForConfirmation(
                    max: DeepLinkAgentPolicy.maxUnkeyedConfirmChars,
                    actual: DeepLinkAgentPolicy.maxUnkeyedConfirmChars + 1))
        case .success:
            Issue.record("expected failure, got success")
        }
    }

    @Test func validateMessageForHandleAllowsTooLongWhenKeyed() {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let msg = String(repeating: "a", count: DeepLinkAgentPolicy.maxUnkeyedConfirmChars + 1)
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let res = DeepLinkAgentPolicy.validateMessageForHandle(message: msg, allowUnattended: true)
        switch res {
        case .success:
            break
        case let .failure(error):
            Issue.record("expected success, got failure: \(error)")
        }
    }

    @Test func effectiveDeliveryIgnoresDeliveryFieldsWhenUnkeyed() {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let link = AgentDeepLink(
            message: "Hello",
            sessionKey: "s",
            thinking: "low",
            deliver: true,
            to: "+15551234567",
            channel: "whatsapp",
            timeoutSeconds: 10,
            key: nil)
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let res = DeepLinkAgentPolicy.effectiveDelivery(link: link, allowUnattended: false)
        #expect(res.deliver == false)
        #expect(res.to == nil)
        #expect(res.channel == .last)
    }

    @Test func effectiveDeliveryHonorsDeliverForDeliverableChannelsWhenKeyed() {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let link = AgentDeepLink(
            message: "Hello",
            sessionKey: "s",
            thinking: "low",
            deliver: true,
            to: "  +15551234567 ",
            channel: "whatsapp",
            timeoutSeconds: 10,
            key: "secret")
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let res = DeepLinkAgentPolicy.effectiveDelivery(link: link, allowUnattended: true)
        #expect(res.deliver == true)
        #expect(res.to == "+15551234567")
        #expect(res.channel == .whatsapp)
    }

    @Test func effectiveDeliveryStillBlocksWebChatDeliveryWhenKeyed() {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let link = AgentDeepLink(
            message: "Hello",
            sessionKey: "s",
            thinking: "low",
            deliver: true,
            to: "+15551234567",
            channel: "webchat",
            timeoutSeconds: 10,
            key: "secret")
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let res = DeepLinkAgentPolicy.effectiveDelivery(link: link, allowUnattended: true)
        #expect(res.deliver == false)
        #expect(res.channel == .webchat)
    }
}
