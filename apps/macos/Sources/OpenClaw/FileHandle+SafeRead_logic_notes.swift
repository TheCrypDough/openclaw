/*
 * AUTO ANNOTATION
 * File: apps/macos/Sources/OpenClaw/FileHandle+SafeRead.swift
 * Purpose: File in apps area for project orchestration/configuration/data.
 * Module area: Native apps (macOS / iOS / Android / shared app assets)
 * System effect: Change can influence native apps (macos / ios / android / shared app assets) and therefore affects build/runtime behavior indirectly.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import Foundation

extension FileHandle {
    /// Reads until EOF using the throwing FileHandle API and returns empty `Data` on failure.
    ///
    /// Important: Avoid legacy, non-throwing FileHandle read APIs (e.g. `readDataToEndOfFile()` and
    /// `availableData`). They can raise Objective-C exceptions when the handle is closed/invalid, which
    /// will abort the process.
    func readToEndSafely() -> Data {
        do {
            return try self.readToEnd() ?? Data()
        } catch {
            return Data()
        }
    }

    /// Reads up to `count` bytes using the throwing FileHandle API and returns empty `Data` on failure/EOF.
    ///
    /// Important: Use this instead of `availableData` in callbacks like `readabilityHandler` to avoid
    /// Objective-C exceptions terminating the process.
    func readSafely(upToCount count: Int) -> Data {
        do {
            return try self.read(upToCount: count) ?? Data()
        } catch {
            return Data()
        }
    }
}
