/*
 * AUTO ANNOTATION
 * File: apps/macos/Tests/OpenClawIPCTests/VoiceWakeTesterTests.swift
 * Purpose: File in apps area for project orchestration/configuration/data.
 * Module area: Native apps (macOS / iOS / Android / shared app assets)
 * System effect: Change can influence native apps (macos / ios / android / shared app assets) and therefore affects build/runtime behavior indirectly.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import Foundation
import SwabbleKit
import Testing

struct VoiceWakeTesterTests {
    @Test func matchRespectsGapRequirement() {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let transcript = "hey claude do thing"
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let segments = makeSegments(
            transcript: transcript,
            words: [
                ("hey", 0.0, 0.1),
                ("claude", 0.2, 0.1),
                ("do", 0.35, 0.1),
                ("thing", 0.5, 0.1),
            ])
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let config = WakeWordGateConfig(triggers: ["claude"], minPostTriggerGap: 0.3)
        #expect(WakeWordGate.match(transcript: transcript, segments: segments, config: config) == nil)
    }

    @Test func matchReturnsCommandAfterGap() {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let transcript = "hey claude do thing"
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let segments = makeSegments(
            transcript: transcript,
            words: [
                ("hey", 0.0, 0.1),
                ("claude", 0.2, 0.1),
                ("do", 0.8, 0.1),
                ("thing", 1.0, 0.1),
            ])
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let config = WakeWordGateConfig(triggers: ["claude"], minPostTriggerGap: 0.3)
        #expect(WakeWordGate.match(transcript: transcript, segments: segments, config: config)?.command == "do thing")
    }
}

private func makeSegments(
    transcript: String,
    words: [(String, TimeInterval, TimeInterval)])
-> [WakeWordSegment] {
    var searchStart = transcript.startIndex
    var output: [WakeWordSegment] = []
    for (word, start, duration) in words {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let range = transcript.range(of: word, range: searchStart..<transcript.endIndex)
        output.append(WakeWordSegment(text: word, start: start, duration: duration, range: range))
        if let range { searchStart = range.upperBound }
    }
    return output
}
