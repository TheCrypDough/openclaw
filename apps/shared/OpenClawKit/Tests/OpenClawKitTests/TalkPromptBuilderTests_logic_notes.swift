/*
 * AUTO ANNOTATION
 * File: apps/shared/OpenClawKit/Tests/OpenClawKitTests/TalkPromptBuilderTests.swift
 * Purpose: File in apps area for project orchestration/configuration/data.
 * Module area: Native apps (macOS / iOS / Android / shared app assets)
 * System effect: Change can influence native apps (macos / ios / android / shared app assets) and therefore affects build/runtime behavior indirectly.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import XCTest
@testable import OpenClawKit

final class TalkPromptBuilderTests: XCTestCase {
    func testBuildIncludesTranscript() {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let prompt = TalkPromptBuilder.build(transcript: "Hello", interruptedAtSeconds: nil)
        XCTAssertTrue(prompt.contains("Talk Mode active."))
        XCTAssertTrue(prompt.hasSuffix("\n\nHello"))
    }

    func testBuildIncludesInterruptionLineWhenProvided() {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let prompt = TalkPromptBuilder.build(transcript: "Hi", interruptedAtSeconds: 1.234)
        XCTAssertTrue(prompt.contains("Assistant speech interrupted at 1.2s."))
    }

    func testBuildIncludesVoiceDirectiveHintByDefault() {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let prompt = TalkPromptBuilder.build(transcript: "Hello", interruptedAtSeconds: nil)
        XCTAssertTrue(prompt.contains("ElevenLabs voice"))
    }

    func testBuildExcludesVoiceDirectiveHintWhenDisabled() {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let prompt = TalkPromptBuilder.build(
            transcript: "Hello",
            interruptedAtSeconds: nil,
            includeVoiceDirectiveHint: false)
        XCTAssertFalse(prompt.contains("ElevenLabs voice"))
        XCTAssertTrue(prompt.contains("Talk Mode active."))
    }
}
