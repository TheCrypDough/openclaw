/*
 * AUTO ANNOTATION
 * File: apps/macos/Sources/OpenClaw/CanvasWindowController+Helpers.swift
 * Purpose: File in apps area for project orchestration/configuration/data.
 * Module area: Native apps (macOS / iOS / Android / shared app assets)
 * System effect: Change can influence native apps (macos / ios / android / shared app assets) and therefore affects build/runtime behavior indirectly.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import AppKit
import Foundation

extension CanvasWindowController {
    // MARK: - Helpers

    static func sanitizeSessionKey(_ key: String) -> String {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let trimmed = key.trimmingCharacters(in: .whitespacesAndNewlines)
        if trimmed.isEmpty { return "main" }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let allowed = CharacterSet(charactersIn: "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_-+")
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let scalars = trimmed.unicodeScalars.map { allowed.contains($0) ? Character($0) : "_" }
        return String(scalars)
    }

    static func jsStringLiteral(_ value: String) -> String {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let data = try? JSONEncoder().encode(value)
        return data.flatMap { String(data: $0, encoding: .utf8) } ?? "\"\""
    }

    static func jsOptionalStringLiteral(_ value: String?) -> String {
        guard let value else { return "null" }
        return Self.jsStringLiteral(value)
    }

    static func storedFrameDefaultsKey(sessionKey: String) -> String {
        "openclaw.canvas.frame.\(self.sanitizeSessionKey(sessionKey))"
    }

    static func loadRestoredFrame(sessionKey: String) -> NSRect? {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let key = self.storedFrameDefaultsKey(sessionKey: sessionKey)
        guard let arr = UserDefaults.standard.array(forKey: key) as? [Double], arr.count == 4 else { return nil }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let rect = NSRect(x: arr[0], y: arr[1], width: arr[2], height: arr[3])
        if rect.width < CanvasLayout.minPanelSize.width || rect.height < CanvasLayout.minPanelSize.height { return nil }
        return rect
    }

    static func storeRestoredFrame(_ frame: NSRect, sessionKey: String) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let key = self.storedFrameDefaultsKey(sessionKey: sessionKey)
        UserDefaults.standard.set(
            [Double(frame.origin.x), Double(frame.origin.y), Double(frame.size.width), Double(frame.size.height)],
            forKey: key)
    }
}
