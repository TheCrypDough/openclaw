/*
 * AUTO ANNOTATION
 * File: apps/shared/OpenClawKit/Sources/OpenClawKit/CanvasA2UIJSONL.swift
 * Purpose: File in apps area for project orchestration/configuration/data.
 * Module area: Native apps (macOS / iOS / Android / shared app assets)
 * System effect: Change can influence native apps (macos / ios / android / shared app assets) and therefore affects build/runtime behavior indirectly.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import Foundation

public enum OpenClawCanvasA2UIJSONL: Sendable {
    public struct ParsedItem: Sendable {
        public var lineNumber: Int
        public var message: AnyCodable

        public init(lineNumber: Int, message: AnyCodable) {
            self.lineNumber = lineNumber
            self.message = message
        }
    }

    public static func parse(_ text: String) throws -> [ParsedItem] {
        var out: [ParsedItem] = []
        var lineNumber = 0
        for rawLine in text.split(omittingEmptySubsequences: false, whereSeparator: \.isNewline) {
            lineNumber += 1
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
            let line = String(rawLine).trimmingCharacters(in: .whitespacesAndNewlines)
            if line.isEmpty { continue }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
            let data = Data(line.utf8)

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
            let decoded = try JSONDecoder().decode(AnyCodable.self, from: data)
            out.append(ParsedItem(lineNumber: lineNumber, message: decoded))
        }
        return out
    }

    public static func validateV0_8(_ items: [ParsedItem]) throws {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let allowed = Set([
            "beginRendering",
            "surfaceUpdate",
            "dataModelUpdate",
            "deleteSurface",
        ])
        for item in items {
            guard let dict = item.message.value as? [String: AnyCodable] else {
                throw NSError(domain: "A2UI", code: 1, userInfo: [
                    NSLocalizedDescriptionKey: "A2UI JSONL line \(item.lineNumber): expected a JSON object",
                ])
            }

            if dict.keys.contains("createSurface") {
                throw NSError(domain: "A2UI", code: 2, userInfo: [
                    NSLocalizedDescriptionKey: """
                    A2UI JSONL line \(item.lineNumber): looks like A2UI v0.9 (`createSurface`).
                    Canvas currently supports A2UI v0.8 server→client messages
                    (`beginRendering`, `surfaceUpdate`, `dataModelUpdate`, `deleteSurface`).
                    """,
                ])
            }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
            let matched = dict.keys.filter { allowed.contains($0) }
            if matched.count != 1 {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
                let found = dict.keys.sorted().joined(separator: ", ")
                throw NSError(domain: "A2UI", code: 3, userInfo: [
                    NSLocalizedDescriptionKey: """
                    A2UI JSONL line \(item.lineNumber): expected exactly one of \(allowed.sorted()
                        .joined(separator: ", ")); found: \(found)
                    """,
                ])
            }
        }
    }

    public static func decodeMessagesFromJSONL(_ text: String) throws -> [AnyCodable] {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let items = try self.parse(text)
        try self.validateV0_8(items)
        return items.map(\.message)
    }

    public static func encodeMessagesJSONArray(_ messages: [AnyCodable]) throws -> String {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let data = try JSONEncoder().encode(messages)
        guard let json = String(data: data, encoding: .utf8) else {
            throw NSError(domain: "A2UI", code: 10, userInfo: [
                NSLocalizedDescriptionKey: "Failed to encode messages payload as UTF-8",
            ])
        }
        return json
    }
}
