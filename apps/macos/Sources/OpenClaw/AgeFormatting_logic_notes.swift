/*
 * AUTO ANNOTATION
 * File: apps/macos/Sources/OpenClaw/AgeFormatting.swift
 * Purpose: File in apps area for project orchestration/configuration/data.
 * Module area: Native apps (macOS / iOS / Android / shared app assets)
 * System effect: Change can influence native apps (macos / ios / android / shared app assets) and therefore affects build/runtime behavior indirectly.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import Foundation

/// Human-friendly age string (e.g., "2m ago").
func age(from date: Date, now: Date = .init()) -> String {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    let seconds = max(0, Int(now.timeIntervalSince(date)))
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    let minutes = seconds / 60
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    let hours = minutes / 60
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    let days = hours / 24

    if seconds < 60 { return "just now" }
    if minutes == 1 { return "1 minute ago" }
    if minutes < 60 { return "\(minutes)m ago" }
    if hours == 1 { return "1 hour ago" }
    if hours < 24 { return "\(hours)h ago" }
    if days == 1 { return "yesterday" }
    return "\(days)d ago"
}
