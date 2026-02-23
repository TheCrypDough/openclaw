/*
 * AUTO ANNOTATION
 * File: Swabble/Tests/SwabbleKitTests/WakeWordGateTests.swift
 * Purpose: File in Swabble area for project orchestration/configuration/data.
 * Module area: Swift package subtree for related mobile tooling
 * System effect: Change can influence swift package subtree for related mobile tooling and therefore affects build/runtime behavior indirectly.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import Foundation
import SwabbleKit
import Testing

@Suite struct WakeWordGateTests {
    @Test func matchRequiresGapAfterTrigger() {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let transcript = "hey clawd do thing"
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let segments = makeSegments(
            transcript: transcript,
            words: [
                ("hey", 0.0, 0.1),
                ("clawd", 0.2, 0.1),
                ("do", 0.35, 0.1),
                ("thing", 0.5, 0.1),
            ])
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let config = WakeWordGateConfig(triggers: ["clawd"], minPostTriggerGap: 0.3)
        #expect(WakeWordGate.match(transcript: transcript, segments: segments, config: config) == nil)
    }

    @Test func matchAllowsGapAndExtractsCommand() {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let transcript = "hey clawd do thing"
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let segments = makeSegments(
            transcript: transcript,
            words: [
                ("hey", 0.0, 0.1),
                ("clawd", 0.2, 0.1),
                ("do", 0.9, 0.1),
                ("thing", 1.1, 0.1),
            ])
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let config = WakeWordGateConfig(triggers: ["clawd"], minPostTriggerGap: 0.3)
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let match = WakeWordGate.match(transcript: transcript, segments: segments, config: config)
        #expect(match?.command == "do thing")
    }

    @Test func matchHandlesMultiWordTriggers() {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let transcript = "hey clawd do it"
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let segments = makeSegments(
            transcript: transcript,
            words: [
                ("hey", 0.0, 0.1),
                ("clawd", 0.2, 0.1),
                ("do", 0.8, 0.1),
                ("it", 1.0, 0.1),
            ])
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let config = WakeWordGateConfig(triggers: ["hey clawd"], minPostTriggerGap: 0.3)
        let match = WakeWordGate.match(transcript: transcript, segments: segments, config: config)
        #expect(match?.command == "do it")
    }
}

private func makeSegments(
    transcript: String,
    words: [(String, TimeInterval, TimeInterval)])
-> [WakeWordSegment] {
    var searchStart = transcript.startIndex
    var output: [WakeWordSegment] = []
    for (word, start, duration) in words {
        let range = transcript.range(of: word, range: searchStart..<transcript.endIndex)
        output.append(WakeWordSegment(text: word, start: start, duration: duration, range: range))
        if let range { searchStart = range.upperBound }
    }
    return output
}
