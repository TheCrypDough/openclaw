/*
 * AUTO ANNOTATION
 * File: Swabble/Sources/SwabbleCore/Support/TranscriptsStore.swift
 * Purpose: File in Swabble area for project orchestration/configuration/data.
 * Module area: Swift package subtree for related mobile tooling
 * System effect: Change can influence swift package subtree for related mobile tooling and therefore affects build/runtime behavior indirectly.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import Foundation

public actor TranscriptsStore {
    public static let shared = TranscriptsStore()

    private var entries: [String] = []
    private let limit = 100
    private let fileURL: URL

    public init() {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let dir = FileManager.default.homeDirectoryForCurrentUser
            .appendingPathComponent("Library/Application Support/swabble", isDirectory: true)
        try? FileManager.default.createDirectory(at: dir, withIntermediateDirectories: true)
        fileURL = dir.appendingPathComponent("transcripts.log")
        if let data = try? Data(contentsOf: fileURL),
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
           let text = String(data: data, encoding: .utf8) {
            entries = text.split(separator: "\n").map(String.init).suffix(limit)
        }
    }

    public func append(text: String) {
        entries.append(text)
        if entries.count > limit {
            entries.removeFirst(entries.count - limit)
        }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let body = entries.joined(separator: "\n")
        try? body.write(to: fileURL, atomically: false, encoding: .utf8)
    }

    public func latest() -> [String] { entries }
}

extension String {
    private func appendLine(to url: URL) throws {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let data = (self + "\n").data(using: .utf8) ?? Data()
        if FileManager.default.fileExists(atPath: url.path) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
            let handle = try FileHandle(forWritingTo: url)
            try handle.seekToEnd()
            try handle.write(contentsOf: data)
            try handle.close()
        } else {
            try data.write(to: url)
        }
    }
}
