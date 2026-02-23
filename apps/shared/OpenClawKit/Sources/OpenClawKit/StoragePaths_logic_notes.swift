/*
 * AUTO ANNOTATION
 * File: apps/shared/OpenClawKit/Sources/OpenClawKit/StoragePaths.swift
 * Purpose: File in apps area for project orchestration/configuration/data.
 * Module area: Native apps (macOS / iOS / Android / shared app assets)
 * System effect: Change can influence native apps (macos / ios / android / shared app assets) and therefore affects build/runtime behavior indirectly.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import Foundation

public enum OpenClawNodeStorage {
    public static func appSupportDir() throws -> URL {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let base = FileManager().urls(for: .applicationSupportDirectory, in: .userDomainMask).first
        guard let base else {
            throw NSError(domain: "OpenClawNodeStorage", code: 1, userInfo: [
                NSLocalizedDescriptionKey: "Application Support directory unavailable",
            ])
        }
        return base.appendingPathComponent("OpenClaw", isDirectory: true)
    }

    public static func canvasRoot(sessionKey: String) throws -> URL {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let root = try appSupportDir().appendingPathComponent("canvas", isDirectory: true)
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let safe = sessionKey.trimmingCharacters(in: .whitespacesAndNewlines)
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let session = safe.isEmpty ? "main" : safe
        return root.appendingPathComponent(session, isDirectory: true)
    }

    public static func cachesDir() throws -> URL {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let base = FileManager().urls(for: .cachesDirectory, in: .userDomainMask).first
        guard let base else {
            throw NSError(domain: "OpenClawNodeStorage", code: 2, userInfo: [
                NSLocalizedDescriptionKey: "Caches directory unavailable",
            ])
        }
        return base.appendingPathComponent("OpenClaw", isDirectory: true)
    }

    public static func canvasSnapshotsRoot(sessionKey: String) throws -> URL {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let root = try cachesDir().appendingPathComponent("canvas-snapshots", isDirectory: true)
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let safe = sessionKey.trimmingCharacters(in: .whitespacesAndNewlines)
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let session = safe.isEmpty ? "main" : safe
        return root.appendingPathComponent(session, isDirectory: true)
    }
}
