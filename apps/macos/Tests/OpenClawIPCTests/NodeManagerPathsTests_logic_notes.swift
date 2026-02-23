/*
 * AUTO ANNOTATION
 * File: apps/macos/Tests/OpenClawIPCTests/NodeManagerPathsTests.swift
 * Purpose: File in apps area for project orchestration/configuration/data.
 * Module area: Native apps (macOS / iOS / Android / shared app assets)
 * System effect: Change can influence native apps (macos / ios / android / shared app assets) and therefore affects build/runtime behavior indirectly.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import Foundation
import Testing
@testable import OpenClaw

@Suite struct NodeManagerPathsTests {
    private func makeTempDir() throws -> URL {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let base = URL(fileURLWithPath: NSTemporaryDirectory(), isDirectory: true)
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let dir = base.appendingPathComponent(UUID().uuidString, isDirectory: true)
        try FileManager().createDirectory(at: dir, withIntermediateDirectories: true)
        return dir
    }

    private func makeExec(at path: URL) throws {
        try FileManager().createDirectory(
            at: path.deletingLastPathComponent(),
            withIntermediateDirectories: true)
        FileManager().createFile(atPath: path.path, contents: Data("echo ok\n".utf8))
        try FileManager().setAttributes([.posixPermissions: 0o755], ofItemAtPath: path.path)
    }

    @Test func fnmNodeBinsPreferNewestInstalledVersion() throws {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let home = try self.makeTempDir()

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let v20Bin = home
            .appendingPathComponent(".local/share/fnm/node-versions/v20.19.5/installation/bin/node")
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let v25Bin = home
            .appendingPathComponent(".local/share/fnm/node-versions/v25.1.0/installation/bin/node")
        try self.makeExec(at: v20Bin)
        try self.makeExec(at: v25Bin)

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let bins = CommandResolver._testNodeManagerBinPaths(home: home)
        #expect(bins.first == v25Bin.deletingLastPathComponent().path)
        #expect(bins.contains(v20Bin.deletingLastPathComponent().path))
    }

    @Test func ignoresEntriesWithoutNodeExecutable() throws {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let home = try self.makeTempDir()
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let missingNodeBin = home
            .appendingPathComponent(".local/share/fnm/node-versions/v99.0.0/installation/bin")
        try FileManager().createDirectory(at: missingNodeBin, withIntermediateDirectories: true)

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let bins = CommandResolver._testNodeManagerBinPaths(home: home)
        #expect(!bins.contains(missingNodeBin.path))
    }
}
