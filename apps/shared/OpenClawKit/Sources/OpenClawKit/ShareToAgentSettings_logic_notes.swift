/*
 * AUTO ANNOTATION
 * File: apps/shared/OpenClawKit/Sources/OpenClawKit/ShareToAgentSettings.swift
 * Purpose: File in apps area for project orchestration/configuration/data.
 * Module area: Native apps (macOS / iOS / Android / shared app assets)
 * System effect: Change can influence native apps (macos / ios / android / shared app assets) and therefore affects build/runtime behavior indirectly.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import Foundation

public enum ShareToAgentSettings {
    private static let suiteName = "group.ai.openclaw.shared"
    private static let defaultInstructionKey = "share.defaultInstruction"
    private static let fallbackInstruction = "Please help me with this."

    private static var defaults: UserDefaults {
        UserDefaults(suiteName: suiteName) ?? .standard
    }

    public static func loadDefaultInstruction() -> String {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let raw = self.defaults.string(forKey: self.defaultInstructionKey)?
            .trimmingCharacters(in: .whitespacesAndNewlines)
        if let raw, !raw.isEmpty {
            return raw
        }
        return self.fallbackInstruction
    }

    public static func saveDefaultInstruction(_ value: String?) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let trimmed = value?.trimmingCharacters(in: .whitespacesAndNewlines) ?? ""
        if trimmed.isEmpty {
            self.defaults.removeObject(forKey: self.defaultInstructionKey)
            return
        }
        self.defaults.set(trimmed, forKey: self.defaultInstructionKey)
    }
}
