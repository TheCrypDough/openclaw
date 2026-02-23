/*
 * AUTO ANNOTATION
 * File: apps/macos/Sources/OpenClaw/AnthropicOAuthCodeState.swift
 * Purpose: File in apps area for project orchestration/configuration/data.
 * Module area: Native apps (macOS / iOS / Android / shared app assets)
 * System effect: Change can influence native apps (macos / ios / android / shared app assets) and therefore affects build/runtime behavior indirectly.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import Foundation

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
enum AnthropicOAuthCodeState {
    struct Parsed: Equatable {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let code: String
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let state: String
    }

    /// Extracts a `code#state` payload from arbitrary text.
    ///
    /// Supports:
    /// - raw `code#state`
    /// - OAuth callback URLs containing `code=` and `state=` query params
    /// - surrounding text/backticks from instructions pages
    static func extract(from raw: String) -> String? {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let text = raw.trimmingCharacters(in: .whitespacesAndNewlines)
            .trimmingCharacters(in: CharacterSet(charactersIn: "`"))
        if text.isEmpty { return nil }

        if let fromURL = self.extractFromURL(text) { return fromURL }
        if let fromToken = self.extractFromToken(text) { return fromToken }
        return nil
    }

    static func parse(from raw: String) -> Parsed? {
        guard let extracted = self.extract(from: raw) else { return nil }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let parts = extracted.split(separator: "#", maxSplits: 1).map(String.init)
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let code = parts.first ?? ""
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let state = parts.count > 1 ? parts[1] : ""
        guard !code.isEmpty, !state.isEmpty else { return nil }
        return Parsed(code: code, state: state)
    }

    private static func extractFromURL(_ text: String) -> String? {
        // Users might copy the callback URL from the browser address bar.
        guard let components = URLComponents(string: text),
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
              let items = components.queryItems,
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
              let code = items.first(where: { $0.name == "code" })?.value,
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
              let state = items.first(where: { $0.name == "state" })?.value,
              !code.isEmpty, !state.isEmpty
        else { return nil }

        return "\(code)#\(state)"
    }

    private static func extractFromToken(_ text: String) -> String? {
        // Base64url-ish tokens; keep this fairly strict to avoid false positives.
        let pattern = #"([A-Za-z0-9._~-]{8,})#([A-Za-z0-9._~-]{8,})"#
        guard let re = try? NSRegularExpression(pattern: pattern) else { return nil }

        let range = NSRange(text.startIndex..<text.endIndex, in: text)
        guard let match = re.firstMatch(in: text, range: range),
              match.numberOfRanges == 3,
              let full = Range(match.range(at: 0), in: text)
        else { return nil }

        return String(text[full])
    }
}
