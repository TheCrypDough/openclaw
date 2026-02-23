/*
 * AUTO ANNOTATION
 * File: apps/macos/Sources/OpenClaw/GatewayDiscoveryPreferences.swift
 * Purpose: File in apps area for project orchestration/configuration/data.
 * Module area: Native apps (macOS / iOS / Android / shared app assets)
 * System effect: Change can influence native apps (macos / ios / android / shared app assets) and therefore affects build/runtime behavior indirectly.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import Foundation

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
enum GatewayDiscoveryPreferences {
    private static let preferredStableIDKey = "gateway.preferredStableID"
    private static let legacyPreferredStableIDKey = "bridge.preferredStableID"

    static func preferredStableID() -> String? {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let defaults = UserDefaults.standard
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let raw = defaults.string(forKey: self.preferredStableIDKey)
            ?? defaults.string(forKey: self.legacyPreferredStableIDKey)
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let trimmed = raw?.trimmingCharacters(in: .whitespacesAndNewlines)
        return trimmed?.isEmpty == false ? trimmed : nil
    }

    static func setPreferredStableID(_ stableID: String?) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let trimmed = stableID?.trimmingCharacters(in: .whitespacesAndNewlines)
        if let trimmed, !trimmed.isEmpty {
            UserDefaults.standard.set(trimmed, forKey: self.preferredStableIDKey)
            UserDefaults.standard.removeObject(forKey: self.legacyPreferredStableIDKey)
        } else {
            UserDefaults.standard.removeObject(forKey: self.preferredStableIDKey)
            UserDefaults.standard.removeObject(forKey: self.legacyPreferredStableIDKey)
        }
    }
}
