/*
 * AUTO ANNOTATION
 * File: apps/ios/Sources/SessionKey.swift
 * Purpose: File in apps area for project orchestration/configuration/data.
 * Module area: Native apps (macOS / iOS / Android / shared app assets)
 * System effect: Change can influence native apps (macos / ios / android / shared app assets) and therefore affects build/runtime behavior indirectly.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import Foundation

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
enum SessionKey {
    static func normalizeMainKey(_ raw: String?) -> String {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let trimmed = (raw ?? "").trimmingCharacters(in: .whitespacesAndNewlines)
        return trimmed.isEmpty ? "main" : trimmed
    }

    static func makeAgentSessionKey(agentId: String, baseKey: String) -> String {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let trimmedAgent = agentId.trimmingCharacters(in: .whitespacesAndNewlines)
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let trimmedBase = baseKey.trimmingCharacters(in: .whitespacesAndNewlines)
        if trimmedAgent.isEmpty { return trimmedBase.isEmpty ? "main" : trimmedBase }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let normalizedBase = trimmedBase.isEmpty ? "main" : trimmedBase
        return "agent:\(trimmedAgent):\(normalizedBase)"
    }

    static func isCanonicalMainSessionKey(_ value: String?) -> Bool {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let trimmed = (value ?? "").trimmingCharacters(in: .whitespacesAndNewlines)
        if trimmed.isEmpty { return false }
        if trimmed == "global" { return true }
        return trimmed.hasPrefix("agent:")
    }
}
