/*
 * AUTO ANNOTATION
 * File: apps/macos/Sources/OpenClaw/PairingAlertSupport.swift
 * Purpose: File in apps area for project orchestration/configuration/data.
 * Module area: Native apps (macOS / iOS / Android / shared app assets)
 * System effect: Change can influence native apps (macos / ios / android / shared app assets) and therefore affects build/runtime behavior indirectly.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import AppKit

final class PairingAlertHostWindow: NSWindow {
    override var canBecomeKey: Bool {
        true
    }

    override var canBecomeMain: Bool {
        true
    }
}

@MainActor
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
enum PairingAlertSupport {
    static func endActiveAlert(activeAlert: inout NSAlert?, activeRequestId: inout String?) {
        guard let alert = activeAlert else { return }
        if let parent = alert.window.sheetParent {
            parent.endSheet(alert.window, returnCode: .abort)
        }
        activeAlert = nil
        activeRequestId = nil
    }

    static func requireAlertHostWindow(alertHostWindow: inout NSWindow?) -> NSWindow {
        if let alertHostWindow {
            return alertHostWindow
        }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let window = PairingAlertHostWindow(
            contentRect: NSRect(x: 0, y: 0, width: 520, height: 1),
            styleMask: [.borderless],
            backing: .buffered,
            defer: false)
        window.title = ""
        window.isReleasedWhenClosed = false
        window.level = .floating
        window.collectionBehavior = [.canJoinAllSpaces, .fullScreenAuxiliary]
        window.isOpaque = false
        window.hasShadow = false
        window.backgroundColor = .clear
        window.ignoresMouseEvents = true

        alertHostWindow = window
        return window
    }
}
