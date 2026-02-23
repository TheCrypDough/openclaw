/*
 * AUTO ANNOTATION
 * File: apps/macos/Sources/OpenClaw/NodeMode/MacNodeScreenCommands.swift
 * Purpose: File in apps area for project orchestration/configuration/data.
 * Module area: Native apps (macOS / iOS / Android / shared app assets)
 * System effect: Change can influence native apps (macos / ios / android / shared app assets) and therefore affects build/runtime behavior indirectly.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import Foundation

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
enum MacNodeScreenCommand: String, Codable, Sendable {
    case record = "screen.record"
}

struct MacNodeScreenRecordParams: Codable, Sendable, Equatable {
    var screenIndex: Int?
    var durationMs: Int?
    var fps: Double?
    var format: String?
    var includeAudio: Bool?
}
