/*
 * AUTO ANNOTATION
 * File: apps/ios/Tests/ShareToAgentDeepLinkTests.swift
 * Purpose: File in apps area for project orchestration/configuration/data.
 * Module area: Native apps (macOS / iOS / Android / shared app assets)
 * System effect: Change can influence native apps (macos / ios / android / shared app assets) and therefore affects build/runtime behavior indirectly.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import OpenClawKit
import Foundation
import Testing

@Suite struct ShareToAgentDeepLinkTests {
    @Test func buildMessageIncludesSharedFields() {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let payload = SharedContentPayload(
            title: "Article",
            url: URL(string: "https://example.com/post")!,
            text: "Read this")

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let message = ShareToAgentDeepLink.buildMessage(
            from: payload,
            instruction: "Summarize and give next steps.")
        #expect(message.contains("Shared from iOS."))
        #expect(message.contains("Title: Article"))
        #expect(message.contains("URL: https://example.com/post"))
        #expect(message.contains("Text:\nRead this"))
        #expect(message.contains("Summarize and give next steps."))
    }

    @Test func buildURLEncodesAgentRoute() {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let payload = SharedContentPayload(
            title: "",
            url: URL(string: "https://example.com")!,
            text: nil)

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let url = ShareToAgentDeepLink.buildURL(from: payload)
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let parsed = url.flatMap { DeepLinkParser.parse($0) }
        guard case let .agent(agent)? = parsed else {
            Issue.record("Expected openclaw://agent deep link")
            return
        }

        #expect(agent.thinking == "low")
        #expect(agent.message.contains("https://example.com"))
    }

    @Test func buildURLReturnsNilWhenPayloadEmpty() {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let payload = SharedContentPayload(title: nil, url: nil, text: nil)
        #expect(ShareToAgentDeepLink.buildURL(from: payload) == nil)
    }

    @Test func shareInstructionSettingsRoundTrip() {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let value = "Focus on booking constraints and alternatives."
        ShareToAgentSettings.saveDefaultInstruction(value)
        defer { ShareToAgentSettings.saveDefaultInstruction(nil) }

        #expect(ShareToAgentSettings.loadDefaultInstruction() == value)
    }
}
