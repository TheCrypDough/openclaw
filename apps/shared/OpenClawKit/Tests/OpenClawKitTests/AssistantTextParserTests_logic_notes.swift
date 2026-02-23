/*
 * AUTO ANNOTATION
 * File: apps/shared/OpenClawKit/Tests/OpenClawKitTests/AssistantTextParserTests.swift
 * Purpose: File in apps area for project orchestration/configuration/data.
 * Module area: Native apps (macOS / iOS / Android / shared app assets)
 * System effect: Change can influence native apps (macos / ios / android / shared app assets) and therefore affects build/runtime behavior indirectly.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import Testing
@testable import OpenClawChatUI

@Suite struct AssistantTextParserTests {
    @Test func splitsThinkAndFinalSegments() {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let segments = AssistantTextParser.segments(
            from: "<think>internal</think>\n\n<final>Hello there</final>")

        #expect(segments.count == 2)
        #expect(segments[0].kind == .thinking)
        #expect(segments[0].text == "internal")
        #expect(segments[1].kind == .response)
        #expect(segments[1].text == "Hello there")
    }

    @Test func keepsTextWithoutTags() {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let segments = AssistantTextParser.segments(from: "Just text.")

        #expect(segments.count == 1)
        #expect(segments[0].kind == .response)
        #expect(segments[0].text == "Just text.")
    }

    @Test func ignoresThinkingLikeTags() {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let raw = "<thinking>example</thinking>\nKeep this."
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let segments = AssistantTextParser.segments(from: raw)

        #expect(segments.count == 1)
        #expect(segments[0].kind == .response)
        #expect(segments[0].text == raw.trimmingCharacters(in: .whitespacesAndNewlines))
    }

    @Test func dropsEmptyTaggedContent() {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let segments = AssistantTextParser.segments(from: "<think></think>")
        #expect(segments.isEmpty)
    }
}
