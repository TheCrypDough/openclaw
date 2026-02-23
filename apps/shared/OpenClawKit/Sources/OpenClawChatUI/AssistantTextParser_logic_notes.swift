/*
 * AUTO ANNOTATION
 * File: apps/shared/OpenClawKit/Sources/OpenClawChatUI/AssistantTextParser.swift
 * Purpose: File in apps area for project orchestration/configuration/data.
 * Module area: Native apps (macOS / iOS / Android / shared app assets)
 * System effect: Change can influence native apps (macos / ios / android / shared app assets) and therefore affects build/runtime behavior indirectly.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import Foundation

struct AssistantTextSegment: Identifiable {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    enum Kind {
        case thinking
        case response
    }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    let id = UUID()
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    let kind: Kind
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    let text: String
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
enum AssistantTextParser {
    static func segments(from raw: String) -> [AssistantTextSegment] {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let trimmed = raw.trimmingCharacters(in: .whitespacesAndNewlines)
        guard !trimmed.isEmpty else { return [] }
        guard raw.contains("<") else {
            return [AssistantTextSegment(kind: .response, text: trimmed)]
        }

        var segments: [AssistantTextSegment] = []
        var cursor = raw.startIndex
        var currentKind: AssistantTextSegment.Kind = .response
        var matchedTag = false

        while let match = self.nextTag(in: raw, from: cursor) {
            matchedTag = true
            if match.range.lowerBound > cursor {
                self.appendSegment(kind: currentKind, text: raw[cursor..<match.range.lowerBound], to: &segments)
            }

            guard let tagEnd = raw.range(of: ">", range: match.range.upperBound..<raw.endIndex) else {
                cursor = raw.endIndex
                break
            }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
            let isSelfClosing = self.isSelfClosingTag(in: raw, tagEnd: tagEnd)
            cursor = tagEnd.upperBound
            if isSelfClosing { continue }

            if match.closing {
                currentKind = .response
            } else {
                currentKind = match.kind == .think ? .thinking : .response
            }
        }

        if cursor < raw.endIndex {
            self.appendSegment(kind: currentKind, text: raw[cursor..<raw.endIndex], to: &segments)
        }

        guard matchedTag else {
            return [AssistantTextSegment(kind: .response, text: trimmed)]
        }

        return segments
    }

    static func hasVisibleContent(in raw: String) -> Bool {
        !self.segments(from: raw).isEmpty
    }

    private enum TagKind {
        case think
        case final
    }

    private struct TagMatch {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let kind: TagKind
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let closing: Bool
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let range: Range<String.Index>
    }

    private static func nextTag(in text: String, from start: String.Index) -> TagMatch? {
        let candidates: [TagMatch] = [
            self.findTagStart(tag: "think", closing: false, in: text, from: start).map {
                TagMatch(kind: .think, closing: false, range: $0)
            },
            self.findTagStart(tag: "think", closing: true, in: text, from: start).map {
                TagMatch(kind: .think, closing: true, range: $0)
            },
            self.findTagStart(tag: "final", closing: false, in: text, from: start).map {
                TagMatch(kind: .final, closing: false, range: $0)
            },
            self.findTagStart(tag: "final", closing: true, in: text, from: start).map {
                TagMatch(kind: .final, closing: true, range: $0)
            },
        ].compactMap(\.self)

        return candidates.min { $0.range.lowerBound < $1.range.lowerBound }
    }

    private static func findTagStart(
        tag: String,
        closing: Bool,
        in text: String,
        from start: String.Index) -> Range<String.Index>?
    {
        let token = closing ? "</\(tag)" : "<\(tag)"
        var searchRange = start..<text.endIndex
        while let range = text.range(
            of: token,
            options: [.caseInsensitive, .diacriticInsensitive],
            range: searchRange)
        {
            let boundaryIndex = range.upperBound
            guard boundaryIndex < text.endIndex else { return range }
            let boundary = text[boundaryIndex]
            let isBoundary = boundary == ">" || boundary.isWhitespace || (!closing && boundary == "/")
            if isBoundary {
                return range
            }
            searchRange = boundaryIndex..<text.endIndex
        }
        return nil
    }

    private static func isSelfClosingTag(in text: String, tagEnd: Range<String.Index>) -> Bool {
        var cursor = tagEnd.lowerBound
        while cursor > text.startIndex {
            cursor = text.index(before: cursor)
            let char = text[cursor]
            if char.isWhitespace { continue }
            return char == "/"
        }
        return false
    }

    private static func appendSegment(
        kind: AssistantTextSegment.Kind,
        text: Substring,
        to segments: inout [AssistantTextSegment])
    {
        let trimmed = text.trimmingCharacters(in: .whitespacesAndNewlines)
        guard !trimmed.isEmpty else { return }
        segments.append(AssistantTextSegment(kind: kind, text: trimmed))
    }
}
