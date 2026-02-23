/*
 * AUTO ANNOTATION
 * File: apps/macos/Sources/OpenClaw/CanvasWindow.swift
 * Purpose: File in apps area for project orchestration/configuration/data.
 * Module area: Native apps (macOS / iOS / Android / shared app assets)
 * System effect: Change can influence native apps (macos / ios / android / shared app assets) and therefore affects build/runtime behavior indirectly.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import AppKit

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
let canvasWindowLogger = Logger(subsystem: "ai.openclaw", category: "Canvas")

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
enum CanvasLayout {
    static let panelSize = NSSize(width: 520, height: 680)
    static let windowSize = NSSize(width: 1120, height: 840)
    static let anchorPadding: CGFloat = 8
    static let defaultPadding: CGFloat = 10
    static let minPanelSize = NSSize(width: 360, height: 360)
}

final class CanvasPanel: NSPanel {
    override var canBecomeKey: Bool {
        true
    }

    override var canBecomeMain: Bool {
        true
    }
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
enum CanvasPresentation {
    case window
    case panel(anchorProvider: () -> NSRect?)

    var isPanel: Bool {
        if case .panel = self { return true }
        return false
    }
}
