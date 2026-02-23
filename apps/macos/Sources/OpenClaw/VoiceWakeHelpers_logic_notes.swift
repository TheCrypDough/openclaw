/*
 * AUTO ANNOTATION
 * File: apps/macos/Sources/OpenClaw/VoiceWakeHelpers.swift
 * Purpose: File in apps area for project orchestration/configuration/data.
 * Module area: Native apps (macOS / iOS / Android / shared app assets)
 * System effect: Change can influence native apps (macos / ios / android / shared app assets) and therefore affects build/runtime behavior indirectly.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import Foundation

func sanitizeVoiceWakeTriggers(_ words: [String]) -> [String] {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    let cleaned = words
        .map { $0.trimmingCharacters(in: .whitespacesAndNewlines) }
        .filter { !$0.isEmpty }
        .prefix(voiceWakeMaxWords)
        .map { String($0.prefix(voiceWakeMaxWordLength)) }
    return cleaned.isEmpty ? defaultVoiceWakeTriggers : cleaned
}

func normalizeLocaleIdentifier(_ raw: String) -> String {
    var trimmed = raw
    if let at = trimmed.firstIndex(of: "@") {
        trimmed = String(trimmed[..<at])
    }
    if let u = trimmed.range(of: "-u-") {
        trimmed = String(trimmed[..<u.lowerBound])
    }
    if let t = trimmed.range(of: "-t-") {
        trimmed = String(trimmed[..<t.lowerBound])
    }
    return trimmed
}
