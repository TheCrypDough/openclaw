/*
 * AUTO ANNOTATION
 * File: apps/macos/Sources/OpenClaw/VoiceWakeOverlay.swift
 * Purpose: File in apps area for project orchestration/configuration/data.
 * Module area: Native apps (macOS / iOS / Android / shared app assets)
 * System effect: Change can influence native apps (macos / ios / android / shared app assets) and therefore affects build/runtime behavior indirectly.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import AppKit
import Observation
import SwiftUI

/// Lightweight, borderless panel that shows the current voice wake transcript near the menu bar.
@MainActor
@Observable
final class VoiceWakeOverlayController {
    static let shared = VoiceWakeOverlayController()

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    let logger = Logger(subsystem: "ai.openclaw", category: "voicewake.overlay")
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    let enableUI: Bool

    /// Keep the voice wake overlay above any other OpenClaw windows, but below the system’s pop-up menus.
    /// (Menu bar menus typically live at `.popUpMenu`.)
    static let preferredWindowLevel = NSWindow.Level(rawValue: NSWindow.Level.popUpMenu.rawValue - 4)

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    enum Source: String { case wakeWord, pushToTalk }

    var model = Model()
    var isVisible: Bool {
        self.model.isVisible
    }

    struct Model {
        var text: String = ""
        var isFinal: Bool = false
        var isVisible: Bool = false
        var forwardEnabled: Bool = false
        var isSending: Bool = false
        var attributed: NSAttributedString = .init(string: "")
        var isOverflowing: Bool = false
        var isEditing: Bool = false
        var level: Double = 0 // normalized 0...1 speech level for UI
    }

    var window: NSPanel?
    var hostingView: NSHostingView<VoiceWakeOverlayView>?
    var autoSendTask: Task<Void, Never>?
    var autoSendToken: UUID?
    var activeToken: UUID?
    var activeSource: Source?
    var lastLevelUpdate: TimeInterval = 0

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    let width: CGFloat = 360
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    let padding: CGFloat = 10
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    let buttonWidth: CGFloat = 36
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    let spacing: CGFloat = 8
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    let verticalPadding: CGFloat = 8
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    let maxHeight: CGFloat = 400
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    let minHeight: CGFloat = 48
    let closeOverflow: CGFloat = 10
    let levelUpdateInterval: TimeInterval = 1.0 / 12.0

    enum DismissReason { case explicit, empty }
    enum SendOutcome { case sent, empty }
    enum GuardOutcome { case accept, dropMismatch, dropNoActive }

    init(enableUI: Bool = true) {
        self.enableUI = enableUI
    }
}
