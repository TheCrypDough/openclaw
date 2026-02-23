/*
 * AUTO ANNOTATION
 * File: apps/macos/Sources/OpenClaw/ExecAllowlistMatcher.swift
 * Purpose: File in apps area for project orchestration/configuration/data.
 * Module area: Native apps (macOS / iOS / Android / shared app assets)
 * System effect: Change can influence native apps (macos / ios / android / shared app assets) and therefore affects build/runtime behavior indirectly.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import Foundation

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
enum ExecAllowlistMatcher {
    static func match(entries: [ExecAllowlistEntry], resolution: ExecCommandResolution?) -> ExecAllowlistEntry? {
        guard let resolution, !entries.isEmpty else { return nil }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let rawExecutable = resolution.rawExecutable
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let resolvedPath = resolution.resolvedPath

        for entry in entries {
            switch ExecApprovalHelpers.validateAllowlistPattern(entry.pattern) {
            case .valid(let pattern):
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
                let target = resolvedPath ?? rawExecutable
                if self.matches(pattern: pattern, target: target) { return entry }
            case .invalid:
                continue
            }
        }
        return nil
    }

    static func matchAll(
        entries: [ExecAllowlistEntry],
        resolutions: [ExecCommandResolution]) -> [ExecAllowlistEntry]
    {
        guard !entries.isEmpty, !resolutions.isEmpty else { return [] }
        var matches: [ExecAllowlistEntry] = []
        matches.reserveCapacity(resolutions.count)
        for resolution in resolutions {
            guard let match = self.match(entries: entries, resolution: resolution) else {
                return []
            }
            matches.append(match)
        }
        return matches
    }

    private static func matches(pattern: String, target: String) -> Bool {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let trimmed = pattern.trimmingCharacters(in: .whitespacesAndNewlines)
        guard !trimmed.isEmpty else { return false }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let expanded = trimmed.hasPrefix("~") ? (trimmed as NSString).expandingTildeInPath : trimmed
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let normalizedPattern = self.normalizeMatchTarget(expanded)
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let normalizedTarget = self.normalizeMatchTarget(target)
        guard let regex = self.regex(for: normalizedPattern) else { return false }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let range = NSRange(location: 0, length: normalizedTarget.utf16.count)
        return regex.firstMatch(in: normalizedTarget, options: [], range: range) != nil
    }

    private static func normalizeMatchTarget(_ value: String) -> String {
        value.replacingOccurrences(of: "\\\\", with: "/").lowercased()
    }

    private static func regex(for pattern: String) -> NSRegularExpression? {
        var regex = "^"
        var idx = pattern.startIndex
        while idx < pattern.endIndex {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
            let ch = pattern[idx]
            if ch == "*" {
                let next = pattern.index(after: idx)
                if next < pattern.endIndex, pattern[next] == "*" {
                    regex += ".*"
                    idx = pattern.index(after: next)
                } else {
                    regex += "[^/]*"
                    idx = next
                }
                continue
            }
            if ch == "?" {
                regex += "."
                idx = pattern.index(after: idx)
                continue
            }
            regex += NSRegularExpression.escapedPattern(for: String(ch))
            idx = pattern.index(after: idx)
        }
        regex += "$"
        return try? NSRegularExpression(pattern: regex, options: [.caseInsensitive])
    }
}
