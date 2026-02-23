/*
 * AUTO ANNOTATION
 * File: apps/ios/Sources/Settings/SettingsNetworkingHelpers.swift
 * Purpose: File in apps area for project orchestration/configuration/data.
 * Module area: Native apps (macOS / iOS / Android / shared app assets)
 * System effect: Change can influence native apps (macos / ios / android / shared app assets) and therefore affects build/runtime behavior indirectly.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import Foundation

struct SettingsHostPort: Equatable {
    var host: String
    var port: Int
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
enum SettingsNetworkingHelpers {
    static func parseHostPort(from address: String) -> SettingsHostPort? {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let trimmed = address.trimmingCharacters(in: .whitespacesAndNewlines)
        guard !trimmed.isEmpty else { return nil }

        if trimmed.hasPrefix("["),
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
           let close = trimmed.firstIndex(of: "]"),
           close < trimmed.endIndex
        {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
            let host = String(trimmed[trimmed.index(after: trimmed.startIndex)..<close])
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
            let portStart = trimmed.index(after: close)
            guard portStart < trimmed.endIndex, trimmed[portStart] == ":" else { return nil }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
            let portString = String(trimmed[trimmed.index(after: portStart)...])
            guard let port = Int(portString) else { return nil }
            return SettingsHostPort(host: host, port: port)
        }

        guard let colon = trimmed.lastIndex(of: ":") else { return nil }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let host = String(trimmed[..<colon])
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let portString = String(trimmed[trimmed.index(after: colon)...])
        guard !host.isEmpty, let port = Int(portString) else { return nil }
        return SettingsHostPort(host: host, port: port)
    }

    static func httpURLString(host: String?, port: Int?, fallback: String) -> String {
        if let host, let port {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
            let needsBrackets = host.contains(":") && !host.hasPrefix("[") && !host.hasSuffix("]")
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
            let hostPart = needsBrackets ? "[\(host)]" : host
            return "http://\(hostPart):\(port)"
        }
        return "http://\(fallback)"
    }
}
