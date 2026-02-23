/*
 * AUTO ANNOTATION
 * File: apps/macos/Tests/OpenClawIPCTests/VoiceWakeHelpersTests.swift
 * Purpose: File in apps area for project orchestration/configuration/data.
 * Module area: Native apps (macOS / iOS / Android / shared app assets)
 * System effect: Change can influence native apps (macos / ios / android / shared app assets) and therefore affects build/runtime behavior indirectly.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import Testing
@testable import OpenClaw

struct VoiceWakeHelpersTests {
    @Test func sanitizeTriggersTrimsAndDropsEmpty() {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let cleaned = sanitizeVoiceWakeTriggers(["  hi  ", " ", "\n", "there"])
        #expect(cleaned == ["hi", "there"])
    }

    @Test func sanitizeTriggersFallsBackToDefaults() {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let cleaned = sanitizeVoiceWakeTriggers(["   ", ""])
        #expect(cleaned == defaultVoiceWakeTriggers)
    }

    @Test func sanitizeTriggersLimitsWordLength() {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let long = String(repeating: "x", count: voiceWakeMaxWordLength + 5)
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let cleaned = sanitizeVoiceWakeTriggers(["ok", long])
        #expect(cleaned[1].count == voiceWakeMaxWordLength)
    }

    @Test func sanitizeTriggersLimitsWordCount() {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let words = (1...voiceWakeMaxWords + 3).map { "w\($0)" }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let cleaned = sanitizeVoiceWakeTriggers(words)
        #expect(cleaned.count == voiceWakeMaxWords)
    }

    @Test func normalizeLocaleStripsCollation() {
        #expect(normalizeLocaleIdentifier("en_US@collation=phonebook") == "en_US")
    }

    @Test func normalizeLocaleStripsUnicodeExtensions() {
        #expect(normalizeLocaleIdentifier("de-DE-u-co-phonebk") == "de-DE")
        #expect(normalizeLocaleIdentifier("ja-JP-t-ja") == "ja-JP")
    }
}
