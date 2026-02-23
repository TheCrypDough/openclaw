/*
 * AUTO ANNOTATION
 * File: apps/ios/Sources/Voice/VoiceWakePreferences.swift
 * Purpose: File in apps area for project orchestration/configuration/data.
 * Module area: Native apps (macOS / iOS / Android / shared app assets)
 * System effect: Change can influence native apps (macos / ios / android / shared app assets) and therefore affects build/runtime behavior indirectly.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import Foundation

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
enum VoiceWakePreferences {
    static let enabledKey = "voiceWake.enabled"
    static let triggerWordsKey = "voiceWake.triggerWords"

    // Keep defaults aligned with the mac app.
    static let defaultTriggerWords: [String] = ["openclaw", "claude"]
    static let maxWords = 32
    static let maxWordLength = 64

    static func decodeGatewayTriggers(from payloadJSON: String) -> [String]? {
        guard let data = payloadJSON.data(using: .utf8) else { return nil }
        return self.decodeGatewayTriggers(from: data)
    }

    static func decodeGatewayTriggers(from data: Data) -> [String]? {
        struct Payload: Decodable { var triggers: [String] }
        guard let decoded = try? JSONDecoder().decode(Payload.self, from: data) else { return nil }
        return self.sanitizeTriggerWords(decoded.triggers)
    }

    static func loadTriggerWords(defaults: UserDefaults = .standard) -> [String] {
        defaults.stringArray(forKey: self.triggerWordsKey) ?? self.defaultTriggerWords
    }

    static func saveTriggerWords(_ words: [String], defaults: UserDefaults = .standard) {
        defaults.set(words, forKey: self.triggerWordsKey)
    }

    static func sanitizeTriggerWords(_ words: [String]) -> [String] {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let cleaned = words
            .map { $0.trimmingCharacters(in: .whitespacesAndNewlines) }
            .filter { !$0.isEmpty }
            .prefix(Self.maxWords)
            .map { String($0.prefix(Self.maxWordLength)) }
        return cleaned.isEmpty ? Self.defaultTriggerWords : cleaned
    }

    static func displayString(for words: [String]) -> String {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let sanitized = self.sanitizeTriggerWords(words)
        return sanitized.joined(separator: ", ")
    }
}
