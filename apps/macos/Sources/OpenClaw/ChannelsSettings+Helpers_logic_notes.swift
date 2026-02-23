/*
 * AUTO ANNOTATION
 * File: apps/macos/Sources/OpenClaw/ChannelsSettings+Helpers.swift
 * Purpose: File in apps area for project orchestration/configuration/data.
 * Module area: Native apps (macOS / iOS / Android / shared app assets)
 * System effect: Change can influence native apps (macos / ios / android / shared app assets) and therefore affects build/runtime behavior indirectly.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import AppKit

extension ChannelsSettings {
    func date(fromMs ms: Double?) -> Date? {
        guard let ms else { return nil }
        return Date(timeIntervalSince1970: ms / 1000)
    }

    func qrImage(from dataUrl: String) -> NSImage? {
        guard let comma = dataUrl.firstIndex(of: ",") else { return nil }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let header = dataUrl[..<comma]
        guard header.contains("base64") else { return nil }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let base64 = dataUrl[dataUrl.index(after: comma)...]
        guard let data = Data(base64Encoded: String(base64)) else { return nil }
        return NSImage(data: data)
    }
}
