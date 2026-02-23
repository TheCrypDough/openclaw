/*
 * AUTO ANNOTATION
 * File: apps/ios/Tests/VoiceWakePreferencesTests.swift
 * Purpose: File in apps area for project orchestration/configuration/data.
 * Module area: Native apps (macOS / iOS / Android / shared app assets)
 * System effect: Change can influence native apps (macos / ios / android / shared app assets) and therefore affects build/runtime behavior indirectly.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import Foundation
import Testing
@testable import OpenClaw

@Suite struct VoiceWakePreferencesTests {
    @Test func sanitizeTriggerWordsTrimsAndDropsEmpty() {
        #expect(VoiceWakePreferences.sanitizeTriggerWords([" openclaw ", "", " \nclaude\t"]) == ["openclaw", "claude"])
    }

    @Test func sanitizeTriggerWordsFallsBackToDefaultsWhenEmpty() {
        #expect(VoiceWakePreferences.sanitizeTriggerWords(["", "  "]) == VoiceWakePreferences.defaultTriggerWords)
    }

    @Test func sanitizeTriggerWordsLimitsWordLength() {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let long = String(repeating: "x", count: VoiceWakePreferences.maxWordLength + 5)
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let cleaned = VoiceWakePreferences.sanitizeTriggerWords(["ok", long])
        #expect(cleaned[1].count == VoiceWakePreferences.maxWordLength)
    }

    @Test func sanitizeTriggerWordsLimitsWordCount() {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let words = (1...VoiceWakePreferences.maxWords + 3).map { "w\($0)" }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let cleaned = VoiceWakePreferences.sanitizeTriggerWords(words)
        #expect(cleaned.count == VoiceWakePreferences.maxWords)
    }

    @Test func displayStringUsesSanitizedWords() {
        #expect(VoiceWakePreferences.displayString(for: ["", " "]) == "openclaw, claude")
    }

    @Test func loadAndSaveTriggerWordsRoundTrip() {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let suiteName = "VoiceWakePreferencesTests.\(UUID().uuidString)"
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let defaults = UserDefaults(suiteName: suiteName)!

        #expect(VoiceWakePreferences.loadTriggerWords(defaults: defaults) == VoiceWakePreferences.defaultTriggerWords)
        VoiceWakePreferences.saveTriggerWords(["computer"], defaults: defaults)
        #expect(VoiceWakePreferences.loadTriggerWords(defaults: defaults) == ["computer"])
    }
}
