/*
 * AUTO ANNOTATION
 * File: apps/macos/Sources/OpenClaw/Process+PipeRead.swift
 * Purpose: File in apps area for project orchestration/configuration/data.
 * Module area: Native apps (macOS / iOS / Android / shared app assets)
 * System effect: Change can influence native apps (macos / ios / android / shared app assets) and therefore affects build/runtime behavior indirectly.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import Foundation

extension Process {
    /// Runs the process and drains the given pipe before waiting to avoid blocking on full buffers.
    func runAndReadToEnd(from pipe: Pipe) throws -> Data {
        try self.run()
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let data = pipe.fileHandleForReading.readToEndSafely()
        self.waitUntilExit()
        return data
    }
}
