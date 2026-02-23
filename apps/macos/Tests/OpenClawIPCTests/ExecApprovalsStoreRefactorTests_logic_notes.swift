/*
 * AUTO ANNOTATION
 * File: apps/macos/Tests/OpenClawIPCTests/ExecApprovalsStoreRefactorTests.swift
 * Purpose: File in apps area for project orchestration/configuration/data.
 * Module area: Native apps (macOS / iOS / Android / shared app assets)
 * System effect: Change can influence native apps (macos / ios / android / shared app assets) and therefore affects build/runtime behavior indirectly.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import Foundation
import Testing
@testable import OpenClaw

@Suite(.serialized)
struct ExecApprovalsStoreRefactorTests {
    @Test
    func ensureFileSkipsRewriteWhenUnchanged() async throws {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let stateDir = FileManager().temporaryDirectory
            .appendingPathComponent("openclaw-state-\(UUID().uuidString)", isDirectory: true)
        defer { try? FileManager().removeItem(at: stateDir) }

        try await TestIsolation.withEnvValues(["OPENCLAW_STATE_DIR": stateDir.path]) {
            _ = ExecApprovalsStore.ensureFile()
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
            let url = ExecApprovalsStore.fileURL()
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
            let firstWriteDate = try Self.modificationDate(at: url)

            try await Task.sleep(nanoseconds: 1_100_000_000)
            _ = ExecApprovalsStore.ensureFile()
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
            let secondWriteDate = try Self.modificationDate(at: url)

            #expect(firstWriteDate == secondWriteDate)
        }
    }

    @Test
    func updateAllowlistReportsRejectedBasenamePattern() async throws {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let stateDir = FileManager().temporaryDirectory
            .appendingPathComponent("openclaw-state-\(UUID().uuidString)", isDirectory: true)
        defer { try? FileManager().removeItem(at: stateDir) }

        await TestIsolation.withEnvValues(["OPENCLAW_STATE_DIR": stateDir.path]) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
            let rejected = ExecApprovalsStore.updateAllowlist(
                agentId: "main",
                allowlist: [
                    ExecAllowlistEntry(pattern: "echo"),
                    ExecAllowlistEntry(pattern: "/bin/echo"),
                ])
            #expect(rejected.count == 1)
            #expect(rejected.first?.reason == .missingPathComponent)
            #expect(rejected.first?.pattern == "echo")

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
            let resolved = ExecApprovalsStore.resolve(agentId: "main")
            #expect(resolved.allowlist.map(\.pattern) == ["/bin/echo"])
        }
    }

    @Test
    func updateAllowlistMigratesLegacyPatternFromResolvedPath() async throws {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let stateDir = FileManager().temporaryDirectory
            .appendingPathComponent("openclaw-state-\(UUID().uuidString)", isDirectory: true)
        defer { try? FileManager().removeItem(at: stateDir) }

        await TestIsolation.withEnvValues(["OPENCLAW_STATE_DIR": stateDir.path]) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
            let rejected = ExecApprovalsStore.updateAllowlist(
                agentId: "main",
                allowlist: [
                    ExecAllowlistEntry(pattern: "echo", lastUsedAt: nil, lastUsedCommand: nil, lastResolvedPath: " /usr/bin/echo "),
                ])
            #expect(rejected.isEmpty)

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
            let resolved = ExecApprovalsStore.resolve(agentId: "main")
            #expect(resolved.allowlist.map(\.pattern) == ["/usr/bin/echo"])
        }
    }

    private static func modificationDate(at url: URL) throws -> Date {
        let attributes = try FileManager().attributesOfItem(atPath: url.path)
        guard let date = attributes[.modificationDate] as? Date else {
            struct MissingDateError: Error {}
            throw MissingDateError()
        }
        return date
    }
}
