/*
 * AUTO ANNOTATION
 * File: apps/shared/OpenClawKit/Sources/OpenClawKit/TalkHistoryTimestamp.swift
 * Purpose: File in apps area for project orchestration/configuration/data.
 * Module area: Native apps (macOS / iOS / Android / shared app assets)
 * System effect: Change can influence native apps (macos / ios / android / shared app assets) and therefore affects build/runtime behavior indirectly.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
public enum TalkHistoryTimestamp: Sendable {
    /// Gateway history timestamps have historically been emitted as either seconds (Double, epoch seconds)
    /// or milliseconds (Double, epoch ms). This helper accepts either.
    public static func isAfter(_ timestamp: Double, sinceSeconds: Double) -> Bool {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let sinceMs = sinceSeconds * 1000
        // ~2286-11-20 in epoch seconds. Anything bigger is almost certainly epoch milliseconds.
        if timestamp > 10_000_000_000 {
            return timestamp >= sinceMs - 500
        }
        return timestamp >= sinceSeconds - 0.5
    }
}
