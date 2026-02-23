/*
 * AUTO ANNOTATION
 * File: apps/macos/Sources/OpenClaw/String+NonEmpty.swift
 * Purpose: File in apps area for project orchestration/configuration/data.
 * Module area: Native apps (macOS / iOS / Android / shared app assets)
 * System effect: Change can influence native apps (macos / ios / android / shared app assets) and therefore affects build/runtime behavior indirectly.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import Foundation

extension String {
    var nonEmpty: String? {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let trimmed = self.trimmingCharacters(in: .whitespacesAndNewlines)
        return trimmed.isEmpty ? nil : trimmed
    }
}
