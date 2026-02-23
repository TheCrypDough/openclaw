/*
 * AUTO ANNOTATION
 * File: apps/macos/Tests/OpenClawIPCTests/AgentWorkspaceTests.swift
 * Purpose: File in apps area for project orchestration/configuration/data.
 * Module area: Native apps (macOS / iOS / Android / shared app assets)
 * System effect: Change can influence native apps (macos / ios / android / shared app assets) and therefore affects build/runtime behavior indirectly.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import Foundation
import Testing
@testable import OpenClaw

@Suite
struct AgentWorkspaceTests {
    @Test
    func displayPathUsesTildeForHome() {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let home = FileManager().homeDirectoryForCurrentUser
        #expect(AgentWorkspace.displayPath(for: home) == "~")

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let inside = home.appendingPathComponent("Projects", isDirectory: true)
        #expect(AgentWorkspace.displayPath(for: inside).hasPrefix("~/"))
    }

    @Test
    func resolveWorkspaceURLExpandsTilde() {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let url = AgentWorkspace.resolveWorkspaceURL(from: "~/tmp")
        #expect(url.path.hasSuffix("/tmp"))
    }

    @Test
    func agentsURLAppendsFilename() {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let root = URL(fileURLWithPath: "/tmp/ws", isDirectory: true)
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let url = AgentWorkspace.agentsURL(workspaceURL: root)
        #expect(url.lastPathComponent == AgentWorkspace.agentsFilename)
    }

    @Test
    func bootstrapCreatesAgentsFileWhenMissing() throws {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let tmp = FileManager().temporaryDirectory
            .appendingPathComponent("openclaw-ws-\(UUID().uuidString)", isDirectory: true)
        defer { try? FileManager().removeItem(at: tmp) }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let agentsURL = try AgentWorkspace.bootstrap(workspaceURL: tmp)
        #expect(FileManager().fileExists(atPath: agentsURL.path))

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let contents = try String(contentsOf: agentsURL, encoding: .utf8)
        #expect(contents.contains("# AGENTS.md"))

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let identityURL = tmp.appendingPathComponent(AgentWorkspace.identityFilename)
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let userURL = tmp.appendingPathComponent(AgentWorkspace.userFilename)
        let bootstrapURL = tmp.appendingPathComponent(AgentWorkspace.bootstrapFilename)
        #expect(FileManager().fileExists(atPath: identityURL.path))
        #expect(FileManager().fileExists(atPath: userURL.path))
        #expect(FileManager().fileExists(atPath: bootstrapURL.path))

        let second = try AgentWorkspace.bootstrap(workspaceURL: tmp)
        #expect(second == agentsURL)
    }

    @Test
    func bootstrapSafetyRejectsNonEmptyFolderWithoutAgents() throws {
        let tmp = FileManager().temporaryDirectory
            .appendingPathComponent("openclaw-ws-\(UUID().uuidString)", isDirectory: true)
        defer { try? FileManager().removeItem(at: tmp) }
        try FileManager().createDirectory(at: tmp, withIntermediateDirectories: true)
        let marker = tmp.appendingPathComponent("notes.txt")
        try "hello".write(to: marker, atomically: true, encoding: .utf8)

        let result = AgentWorkspace.bootstrapSafety(for: tmp)
        switch result {
        case .unsafe:
            break
        case .safe:
            #expect(Bool(false), "Expected unsafe bootstrap safety result.")
        }
    }

    @Test
    func bootstrapSafetyAllowsExistingAgentsFile() throws {
        let tmp = FileManager().temporaryDirectory
            .appendingPathComponent("openclaw-ws-\(UUID().uuidString)", isDirectory: true)
        defer { try? FileManager().removeItem(at: tmp) }
        try FileManager().createDirectory(at: tmp, withIntermediateDirectories: true)
        let agents = tmp.appendingPathComponent(AgentWorkspace.agentsFilename)
        try "# AGENTS.md".write(to: agents, atomically: true, encoding: .utf8)

        let result = AgentWorkspace.bootstrapSafety(for: tmp)
        switch result {
        case .safe:
            break
        case .unsafe:
            #expect(Bool(false), "Expected safe bootstrap safety result.")
        }
    }

    @Test
    func bootstrapSkipsBootstrapFileWhenWorkspaceHasContent() throws {
        let tmp = FileManager().temporaryDirectory
            .appendingPathComponent("openclaw-ws-\(UUID().uuidString)", isDirectory: true)
        defer { try? FileManager().removeItem(at: tmp) }
        try FileManager().createDirectory(at: tmp, withIntermediateDirectories: true)
        let marker = tmp.appendingPathComponent("notes.txt")
        try "hello".write(to: marker, atomically: true, encoding: .utf8)

        _ = try AgentWorkspace.bootstrap(workspaceURL: tmp)

        let bootstrapURL = tmp.appendingPathComponent(AgentWorkspace.bootstrapFilename)
        #expect(!FileManager().fileExists(atPath: bootstrapURL.path))
    }

    @Test
    func needsBootstrapFalseWhenIdentityAlreadySet() throws {
        let tmp = FileManager().temporaryDirectory
            .appendingPathComponent("openclaw-ws-\(UUID().uuidString)", isDirectory: true)
        defer { try? FileManager().removeItem(at: tmp) }
        try FileManager().createDirectory(at: tmp, withIntermediateDirectories: true)
        let identityURL = tmp.appendingPathComponent(AgentWorkspace.identityFilename)
        try """
        # IDENTITY.md - Agent Identity

        - Name: Clawd
        - Creature: Space Lobster
        - Vibe: Helpful
        - Emoji: lobster
        """.write(to: identityURL, atomically: true, encoding: .utf8)
        let bootstrapURL = tmp.appendingPathComponent(AgentWorkspace.bootstrapFilename)
        try "bootstrap".write(to: bootstrapURL, atomically: true, encoding: .utf8)

        #expect(!AgentWorkspace.needsBootstrap(workspaceURL: tmp))
    }
}
