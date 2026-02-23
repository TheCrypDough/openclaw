/*
 * AUTO ANNOTATION
 * File: apps/macos/Tests/OpenClawIPCTests/FileHandleLegacyAPIGuardTests.swift
 * Purpose: File in apps area for project orchestration/configuration/data.
 * Module area: Native apps (macOS / iOS / Android / shared app assets)
 * System effect: Change can influence native apps (macos / ios / android / shared app assets) and therefore affects build/runtime behavior indirectly.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import Foundation
import Testing

@Suite struct FileHandleLegacyAPIGuardTests {
    @Test func sourcesAvoidLegacyNonThrowingFileHandleReadAPIs() throws {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let testFile = URL(fileURLWithPath: #filePath)
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let packageRoot = testFile
            .deletingLastPathComponent() // OpenClawIPCTests
            .deletingLastPathComponent() // Tests
            .deletingLastPathComponent() // apps/macos

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let sourcesRoot = packageRoot.appendingPathComponent("Sources")
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let swiftFiles = try Self.swiftFiles(under: sourcesRoot)

        var offenders: [String] = []
        for file in swiftFiles {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
            let raw = try String(contentsOf: file, encoding: .utf8)
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
            let stripped = Self.stripCommentsAndStrings(from: raw)

            if stripped.contains("readDataToEndOfFile(") || stripped.contains(".availableData") {
                offenders.append(file.path)
            }
        }

        if !offenders.isEmpty {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
            let message = "Found legacy FileHandle reads in:\n" + offenders.joined(separator: "\n")
            throw NSError(
                domain: "FileHandleLegacyAPIGuardTests",
                code: 1,
                userInfo: [NSLocalizedDescriptionKey: message])
        }
    }

    private static func swiftFiles(under root: URL) throws -> [URL] {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let fm = FileManager()
        guard let enumerator = fm.enumerator(at: root, includingPropertiesForKeys: [.isRegularFileKey]) else {
            return []
        }

        var files: [URL] = []
        for case let url as URL in enumerator {
            guard url.pathExtension == "swift" else { continue }
            files.append(url)
        }
        return files
    }

    private static func stripCommentsAndStrings(from source: String) -> String {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        enum Mode {
            case code
            case lineComment
            case blockComment(depth: Int)
            case string(quoteCount: Int) // 1 = ", 3 = """
        }

        var mode: Mode = .code
        var out = ""
        out.reserveCapacity(source.count)

        var index = source.startIndex
        func peek(_ offset: Int) -> Character? {
            guard
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
                let i = source.index(index, offsetBy: offset, limitedBy: source.endIndex),
                i < source.endIndex
            else { return nil }
            return source[i]
        }

        while index < source.endIndex {
            let ch = source[index]

            switch mode {
            case .code:
                if ch == "/", peek(1) == "/" {
                    out.append("  ")
                    index = source.index(index, offsetBy: 2)
                    mode = .lineComment
                    continue
                }
                if ch == "/", peek(1) == "*" {
                    out.append("  ")
                    index = source.index(index, offsetBy: 2)
                    mode = .blockComment(depth: 1)
                    continue
                }
                if ch == "\"" {
                    let triple = (peek(1) == "\"") && (peek(2) == "\"")
                    out.append(triple ? "   " : " ")
                    index = source.index(index, offsetBy: triple ? 3 : 1)
                    mode = .string(quoteCount: triple ? 3 : 1)
                    continue
                }
                out.append(ch)
                index = source.index(after: index)

            case .lineComment:
                if ch == "\n" {
                    out.append(ch)
                    index = source.index(after: index)
                    mode = .code
                } else {
                    out.append(" ")
                    index = source.index(after: index)
                }

            case let .blockComment(depth):
                if ch == "/", peek(1) == "*" {
                    out.append("  ")
                    index = source.index(index, offsetBy: 2)
                    mode = .blockComment(depth: depth + 1)
                    continue
                }
                if ch == "*", peek(1) == "/" {
                    out.append("  ")
                    index = source.index(index, offsetBy: 2)
                    let newDepth = depth - 1
                    mode = newDepth > 0 ? .blockComment(depth: newDepth) : .code
                    continue
                }
                out.append(ch == "\n" ? "\n" : " ")
                index = source.index(after: index)

            case let .string(quoteCount):
                if ch == "\\", quoteCount == 1 {
                    // Skip escaped character in normal strings.
                    out.append(" ")
                    index = source.index(after: index)
                    if index < source.endIndex {
                        out.append(" ")
                        index = source.index(after: index)
                    }
                    continue
                }
                if ch == "\"" {
                    if quoteCount == 3, peek(1) == "\"", peek(2) == "\"" {
                        out.append("   ")
                        index = source.index(index, offsetBy: 3)
                        mode = .code
                        continue
                    }
                    if quoteCount == 1 {
                        out.append(" ")
                        index = source.index(after: index)
                        mode = .code
                        continue
                    }
                }
                out.append(ch == "\n" ? "\n" : " ")
                index = source.index(after: index)
            }
        }

        return out
    }
}
