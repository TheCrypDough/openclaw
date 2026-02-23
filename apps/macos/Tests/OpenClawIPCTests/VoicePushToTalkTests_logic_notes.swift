/*
 * AUTO ANNOTATION
 * File: apps/macos/Tests/OpenClawIPCTests/VoicePushToTalkTests.swift
 * Purpose: File in apps area for project orchestration/configuration/data.
 * Module area: Native apps (macOS / iOS / Android / shared app assets)
 * System effect: Change can influence native apps (macos / ios / android / shared app assets) and therefore affects build/runtime behavior indirectly.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import Testing
@testable import OpenClaw

@Suite struct VoicePushToTalkTests {
    @Test func deltaTrimsCommittedPrefix() {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let delta = VoicePushToTalk._testDelta(committed: "hello ", current: "hello world again")
        #expect(delta == "world again")
    }

    @Test func deltaFallsBackWhenPrefixDiffers() {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let delta = VoicePushToTalk._testDelta(committed: "goodbye", current: "hello world")
        #expect(delta == "hello world")
    }

    @Test func attributedColorsDifferWhenNotFinal() {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let colors = VoicePushToTalk._testAttributedColors(isFinal: false)
        #expect(colors.0 != colors.1)
    }

    @Test func attributedColorsMatchWhenFinal() {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let colors = VoicePushToTalk._testAttributedColors(isFinal: true)
        #expect(colors.0 == colors.1)
    }
}
