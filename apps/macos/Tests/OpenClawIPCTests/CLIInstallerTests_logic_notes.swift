/*
 * AUTO ANNOTATION
 * File: apps/macos/Tests/OpenClawIPCTests/CLIInstallerTests.swift
 * Purpose: File in apps area for project orchestration/configuration/data.
 * Module area: Native apps (macOS / iOS / Android / shared app assets)
 * System effect: Change can influence native apps (macos / ios / android / shared app assets) and therefore affects build/runtime behavior indirectly.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import Foundation
import Testing
@testable import OpenClaw

@Suite(.serialized)
@MainActor
struct CLIInstallerTests {
    @Test func installedLocationFindsExecutable() throws {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let fm = FileManager()
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let root = fm.temporaryDirectory.appendingPathComponent(
            "openclaw-cli-installer-\(UUID().uuidString)")
        defer { try? fm.removeItem(at: root) }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let binDir = root.appendingPathComponent("bin")
        try fm.createDirectory(at: binDir, withIntermediateDirectories: true)
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let cli = binDir.appendingPathComponent("openclaw")
        fm.createFile(atPath: cli.path, contents: Data())
        try fm.setAttributes([.posixPermissions: 0o755], ofItemAtPath: cli.path)

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let found = CLIInstaller.installedLocation(
            searchPaths: [binDir.path],
            fileManager: fm)
        #expect(found == cli.path)

        try fm.removeItem(at: cli)
        fm.createFile(atPath: cli.path, contents: Data())
        try fm.setAttributes([.posixPermissions: 0o644], ofItemAtPath: cli.path)

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let missing = CLIInstaller.installedLocation(
            searchPaths: [binDir.path],
            fileManager: fm)
        #expect(missing == nil)
    }
}
