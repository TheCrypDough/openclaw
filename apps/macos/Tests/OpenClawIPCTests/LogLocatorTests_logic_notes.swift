/*
 * AUTO ANNOTATION
 * File: apps/macos/Tests/OpenClawIPCTests/LogLocatorTests.swift
 * Purpose: File in apps area for project orchestration/configuration/data.
 * Module area: Native apps (macOS / iOS / Android / shared app assets)
 * System effect: Change can influence native apps (macos / ios / android / shared app assets) and therefore affects build/runtime behavior indirectly.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import Darwin
import Foundation
import Testing
@testable import OpenClaw

@Suite struct LogLocatorTests {
    @Test func launchdGatewayLogPathEnsuresTmpDirExists() throws {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let fm = FileManager()
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let baseDir = URL(fileURLWithPath: NSTemporaryDirectory(), isDirectory: true)
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let logDir = baseDir.appendingPathComponent("openclaw-tests-\(UUID().uuidString)")

        setenv("OPENCLAW_LOG_DIR", logDir.path, 1)
        defer {
            unsetenv("OPENCLAW_LOG_DIR")
            try? fm.removeItem(at: logDir)
        }

        _ = LogLocator.launchdGatewayLogPath

        var isDir: ObjCBool = false
        #expect(fm.fileExists(atPath: logDir.path, isDirectory: &isDir))
        #expect(isDir.boolValue == true)
    }
}
