/*
 * AUTO ANNOTATION
 * File: apps/macos/Tests/OpenClawIPCTests/RuntimeLocatorTests.swift
 * Purpose: File in apps area for project orchestration/configuration/data.
 * Module area: Native apps (macOS / iOS / Android / shared app assets)
 * System effect: Change can influence native apps (macos / ios / android / shared app assets) and therefore affects build/runtime behavior indirectly.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import Foundation
import Testing
@testable import OpenClaw

@Suite struct RuntimeLocatorTests {
    private func makeTempExecutable(contents: String) throws -> URL {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let dir = URL(fileURLWithPath: NSTemporaryDirectory(), isDirectory: true)
            .appendingPathComponent(UUID().uuidString, isDirectory: true)
        try FileManager().createDirectory(at: dir, withIntermediateDirectories: true)
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let path = dir.appendingPathComponent("node")
        try contents.write(to: path, atomically: true, encoding: .utf8)
        try FileManager().setAttributes([.posixPermissions: 0o755], ofItemAtPath: path.path)
        return path
    }

    @Test func resolveSucceedsWithValidNode() throws {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let script = """
        #!/bin/sh
        echo v22.5.0
        """
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let node = try self.makeTempExecutable(contents: script)
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let result = RuntimeLocator.resolve(searchPaths: [node.deletingLastPathComponent().path])
        guard case let .success(res) = result else {
            Issue.record("Expected success, got \(result)")
            return
        }
        #expect(res.path == node.path)
        #expect(res.version == RuntimeVersion(major: 22, minor: 5, patch: 0))
    }

    @Test func resolveFailsWhenTooOld() throws {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let script = """
        #!/bin/sh
        echo v18.2.0
        """
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let node = try self.makeTempExecutable(contents: script)
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let result = RuntimeLocator.resolve(searchPaths: [node.deletingLastPathComponent().path])
        guard case let .failure(.unsupported(_, found, _, path, _)) = result else {
            Issue.record("Expected unsupported error, got \(result)")
            return
        }
        #expect(found == RuntimeVersion(major: 18, minor: 2, patch: 0))
        #expect(path == node.path)
    }

    @Test func resolveFailsWhenVersionUnparsable() throws {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let script = """
        #!/bin/sh
        echo node-version:unknown
        """
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let node = try self.makeTempExecutable(contents: script)
        let result = RuntimeLocator.resolve(searchPaths: [node.deletingLastPathComponent().path])
        guard case let .failure(.versionParse(_, raw, path, _)) = result else {
            Issue.record("Expected versionParse error, got \(result)")
            return
        }
        #expect(raw.contains("unknown"))
        #expect(path == node.path)
    }

    @Test func describeFailureIncludesPaths() {
        let msg = RuntimeLocator.describeFailure(.notFound(searchPaths: ["/tmp/a", "/tmp/b"]))
        #expect(msg.contains("PATH searched: /tmp/a:/tmp/b"))
    }

    @Test func runtimeVersionParsesWithLeadingVAndMetadata() {
        #expect(RuntimeVersion.from(string: "v22.1.3") == RuntimeVersion(major: 22, minor: 1, patch: 3))
        #expect(RuntimeVersion.from(string: "node 22.3.0-alpha.1") == RuntimeVersion(major: 22, minor: 3, patch: 0))
        #expect(RuntimeVersion.from(string: "bogus") == nil)
    }
}
