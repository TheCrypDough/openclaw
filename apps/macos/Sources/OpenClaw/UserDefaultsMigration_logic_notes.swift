/*
 * AUTO ANNOTATION
 * File: apps/macos/Sources/OpenClaw/UserDefaultsMigration.swift
 * Purpose: File in apps area for project orchestration/configuration/data.
 * Module area: Native apps (macOS / iOS / Android / shared app assets)
 * System effect: Change can influence native apps (macos / ios / android / shared app assets) and therefore affects build/runtime behavior indirectly.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import Foundation

private let legacyDefaultsPrefix = "openclaw."
private let defaultsPrefix = "openclaw."

func migrateLegacyDefaults() {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    let defaults = UserDefaults.standard
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    let snapshot = defaults.dictionaryRepresentation()
    for (key, value) in snapshot where key.hasPrefix(legacyDefaultsPrefix) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let suffix = key.dropFirst(legacyDefaultsPrefix.count)
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let newKey = defaultsPrefix + suffix
        if defaults.object(forKey: newKey) == nil {
            defaults.set(value, forKey: newKey)
        }
    }
}
