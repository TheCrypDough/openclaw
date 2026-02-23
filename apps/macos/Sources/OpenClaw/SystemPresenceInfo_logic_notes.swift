/*
 * AUTO ANNOTATION
 * File: apps/macos/Sources/OpenClaw/SystemPresenceInfo.swift
 * Purpose: File in apps area for project orchestration/configuration/data.
 * Module area: Native apps (macOS / iOS / Android / shared app assets)
 * System effect: Change can influence native apps (macos / ios / android / shared app assets) and therefore affects build/runtime behavior indirectly.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import CoreGraphics
import Foundation
import OpenClawKit

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
enum SystemPresenceInfo {
    static func lastInputSeconds() -> Int? {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let anyEvent = CGEventType(rawValue: UInt32.max) ?? .null
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let seconds = CGEventSource.secondsSinceLastEventType(.combinedSessionState, eventType: anyEvent)
        if seconds.isNaN || seconds.isInfinite || seconds < 0 { return nil }
        return Int(seconds.rounded())
    }

    static func primaryIPv4Address() -> String? {
        NetworkInterfaces.primaryIPv4Address()
    }
}
