/*
 * AUTO ANNOTATION
 * File: apps/shared/OpenClawKit/Sources/OpenClawChatUI/ChatMarkdownPreprocessor.swift
 * Purpose: File in apps area for project orchestration/configuration/data.
 * Module area: Native apps (macOS / iOS / Android / shared app assets)
 * System effect: Change can influence native apps (macos / ios / android / shared app assets) and therefore affects build/runtime behavior indirectly.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import Foundation

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
enum ChatMarkdownPreprocessor {
    // Keep in sync with `src/auto-reply/reply/strip-inbound-meta.ts`
    // (`INBOUND_META_SENTINELS`), and extend parser expectations in
    // `ChatMarkdownPreprocessorTests` when sentinels change.
    private static let inboundContextHeaders = [
        "Conversation info (untrusted metadata):",
        "Sender (untrusted metadata):",
        "Thread starter (untrusted, for context):",
        "Replied message (untrusted, for context):",
        "Forwarded message context (untrusted metadata):",
        "Chat history since last reply (untrusted, for context):",
    ]

    struct InlineImage: Identifiable {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let id = UUID()
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let label: String
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let image: OpenClawPlatformImage?
    }

    struct Result {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let cleaned: String
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let images: [InlineImage]
    }

    static func preprocess(markdown raw: String) -> Result {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let withoutContextBlocks = self.stripInboundContextBlocks(raw)
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let withoutTimestamps = self.stripPrefixedTimestamps(withoutContextBlocks)
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let pattern = #"!\[([^\]]*)\]\((data:image\/[^;]+;base64,[^)]+)\)"#
        guard let re = try? NSRegularExpression(pattern: pattern) else {
            return Result(cleaned: self.normalize(withoutTimestamps), images: [])
        }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let ns = withoutTimestamps as NSString
        let matches = re.matches(
            in: withoutTimestamps,
            range: NSRange(location: 0, length: ns.length))
        if matches.isEmpty { return Result(cleaned: self.normalize(withoutTimestamps), images: []) }

        var images: [InlineImage] = []
        var cleaned = withoutTimestamps

        for match in matches.reversed() {
            guard match.numberOfRanges >= 3 else { continue }
            let label = ns.substring(with: match.range(at: 1))
            let dataURL = ns.substring(with: match.range(at: 2))

            let image: OpenClawPlatformImage? = {
                guard let comma = dataURL.firstIndex(of: ",") else { return nil }
                let b64 = String(dataURL[dataURL.index(after: comma)...])
                guard let data = Data(base64Encoded: b64) else { return nil }
                return OpenClawPlatformImage(data: data)
            }()
            images.append(InlineImage(label: label, image: image))

            let start = cleaned.index(cleaned.startIndex, offsetBy: match.range.location)
            let end = cleaned.index(start, offsetBy: match.range.length)
            cleaned.replaceSubrange(start..<end, with: "")
        }

        return Result(cleaned: self.normalize(cleaned), images: images.reversed())
    }

    private static func stripInboundContextBlocks(_ raw: String) -> String {
        guard self.inboundContextHeaders.contains(where: raw.contains) else {
            return raw
        }

        let normalized = raw.replacingOccurrences(of: "\r\n", with: "\n")
        var outputLines: [String] = []
        var inMetaBlock = false
        var inFencedJson = false

        for line in normalized.split(separator: "\n", omittingEmptySubsequences: false) {
            let currentLine = String(line)

            if !inMetaBlock && self.inboundContextHeaders.contains(where: currentLine.hasPrefix) {
                inMetaBlock = true
                inFencedJson = false
                continue
            }

            if inMetaBlock {
                if !inFencedJson && currentLine.trimmingCharacters(in: .whitespacesAndNewlines) == "```json" {
                    inFencedJson = true
                    continue
                }

                if inFencedJson {
                    if currentLine.trimmingCharacters(in: .whitespacesAndNewlines) == "```" {
                        inMetaBlock = false
                        inFencedJson = false
                    }
                    continue
                }

                if currentLine.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty {
                    continue
                }

                inMetaBlock = false
            }

            outputLines.append(currentLine)
        }

        return outputLines.joined(separator: "\n").replacingOccurrences(of: #"^\n+"#, with: "", options: .regularExpression)
    }

    private static func stripPrefixedTimestamps(_ raw: String) -> String {
        let pattern = #"(?m)^\[[A-Za-z]{3}\s+\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}(?::\d{2})?\s+(?:GMT|UTC)[+-]?\d{0,2}\]\s*"#
        return raw.replacingOccurrences(of: pattern, with: "", options: .regularExpression)
    }

    private static func normalize(_ raw: String) -> String {
        var output = raw
        output = output.replacingOccurrences(of: "\r\n", with: "\n")
        output = output.replacingOccurrences(of: "\n\n\n", with: "\n\n")
        output = output.replacingOccurrences(of: "\n\n\n", with: "\n\n")
        return output.trimmingCharacters(in: .whitespacesAndNewlines)
    }
}
