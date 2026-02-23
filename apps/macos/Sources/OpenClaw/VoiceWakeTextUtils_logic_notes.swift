/*
 * AUTO ANNOTATION
 * File: apps/macos/Sources/OpenClaw/VoiceWakeTextUtils.swift
 * Purpose: File in apps area for project orchestration/configuration/data.
 * Module area: Native apps (macOS / iOS / Android / shared app assets)
 * System effect: Change can influence native apps (macos / ios / android / shared app assets) and therefore affects build/runtime behavior indirectly.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import Foundation
import SwabbleKit

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
enum VoiceWakeTextUtils {
    private static let whitespaceAndPunctuation = CharacterSet.whitespacesAndNewlines
        .union(.punctuationCharacters)
    typealias TrimWake = (String, [String]) -> String

    static func normalizeToken(_ token: String) -> String {
        token
            .trimmingCharacters(in: self.whitespaceAndPunctuation)
            .lowercased()
    }

    static func startsWithTrigger(transcript: String, triggers: [String]) -> Bool {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let tokens = transcript
            .split(whereSeparator: { $0.isWhitespace })
            .map { self.normalizeToken(String($0)) }
            .filter { !$0.isEmpty }
        guard !tokens.isEmpty else { return false }
        for trigger in triggers {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
            let triggerTokens = trigger
                .split(whereSeparator: { $0.isWhitespace })
                .map { self.normalizeToken(String($0)) }
                .filter { !$0.isEmpty }
            guard !triggerTokens.isEmpty, tokens.count >= triggerTokens.count else { continue }
            if zip(triggerTokens, tokens.prefix(triggerTokens.count)).allSatisfy({ $0 == $1 }) {
                return true
            }
        }
        return false
    }

    static func textOnlyCommand(
        transcript: String,
        triggers: [String],
        minCommandLength: Int,
        trimWake: TrimWake) -> String?
    {
        guard !transcript.isEmpty else { return nil }
        guard !self.normalizeToken(transcript).isEmpty else { return nil }
        guard WakeWordGate.matchesTextOnly(text: transcript, triggers: triggers) else { return nil }
        guard self.startsWithTrigger(transcript: transcript, triggers: triggers) else { return nil }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let trimmed = trimWake(transcript, triggers)
        guard trimmed.count >= minCommandLength else { return nil }
        return trimmed
    }
}
