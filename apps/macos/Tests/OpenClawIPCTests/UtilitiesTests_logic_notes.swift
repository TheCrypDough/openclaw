/*
 * AUTO ANNOTATION
 * File: apps/macos/Tests/OpenClawIPCTests/UtilitiesTests.swift
 * Purpose: File in apps area for project orchestration/configuration/data.
 * Module area: Native apps (macOS / iOS / Android / shared app assets)
 * System effect: Change can influence native apps (macos / ios / android / shared app assets) and therefore affects build/runtime behavior indirectly.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import Foundation
import Testing
@testable import OpenClaw

@Suite(.serialized) struct UtilitiesTests {
    @Test func ageStringsCoverCommonWindows() {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let now = Date(timeIntervalSince1970: 1_000_000)
        #expect(age(from: now, now: now) == "just now")
        #expect(age(from: now.addingTimeInterval(-45), now: now) == "just now")
        #expect(age(from: now.addingTimeInterval(-75), now: now) == "1 minute ago")
        #expect(age(from: now.addingTimeInterval(-10 * 60), now: now) == "10m ago")
        #expect(age(from: now.addingTimeInterval(-3600), now: now) == "1 hour ago")
        #expect(age(from: now.addingTimeInterval(-5 * 3600), now: now) == "5h ago")
        #expect(age(from: now.addingTimeInterval(-26 * 3600), now: now) == "yesterday")
        #expect(age(from: now.addingTimeInterval(-3 * 86400), now: now) == "3d ago")
    }

    @Test func parseSSHTargetSupportsUserPortAndDefaults() {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let parsed1 = CommandResolver.parseSSHTarget("alice@example.com:2222")
        #expect(parsed1?.user == "alice")
        #expect(parsed1?.host == "example.com")
        #expect(parsed1?.port == 2222)

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let parsed2 = CommandResolver.parseSSHTarget("example.com")
        #expect(parsed2?.user == nil)
        #expect(parsed2?.host == "example.com")
        #expect(parsed2?.port == 22)

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let parsed3 = CommandResolver.parseSSHTarget("bob@host")
        #expect(parsed3?.user == "bob")
        #expect(parsed3?.host == "host")
        #expect(parsed3?.port == 22)
    }

    @Test func sanitizedTargetStripsLeadingSSHPrefix() {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let defaults = UserDefaults(suiteName: "UtilitiesTests.\(UUID().uuidString)")!
        defaults.set(AppState.ConnectionMode.remote.rawValue, forKey: connectionModeKey)
        defaults.set("ssh  alice@example.com", forKey: remoteTargetKey)

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let settings = CommandResolver.connectionSettings(defaults: defaults, configRoot: [:])
        #expect(settings.mode == .remote)
        #expect(settings.target == "alice@example.com")
    }

    @Test func gatewayEntrypointPrefersDistOverBin() throws {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let tmp = URL(fileURLWithPath: NSTemporaryDirectory(), isDirectory: true)
            .appendingPathComponent(UUID().uuidString, isDirectory: true)
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let dist = tmp.appendingPathComponent("dist/index.js")
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let bin = tmp.appendingPathComponent("bin/openclaw.js")
        try FileManager().createDirectory(at: dist.deletingLastPathComponent(), withIntermediateDirectories: true)
        try FileManager().createDirectory(at: bin.deletingLastPathComponent(), withIntermediateDirectories: true)
        FileManager().createFile(atPath: dist.path, contents: Data())
        FileManager().createFile(atPath: bin.path, contents: Data())

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let entry = CommandResolver.gatewayEntrypoint(in: tmp)
        #expect(entry == dist.path)
    }

    @Test func logLocatorPicksNewestLogFile() throws {
        let fm = FileManager()
        let dir = URL(fileURLWithPath: "/tmp/openclaw", isDirectory: true)
        try? fm.createDirectory(at: dir, withIntermediateDirectories: true)

        let older = dir.appendingPathComponent("openclaw-old-\(UUID().uuidString).log")
        let newer = dir.appendingPathComponent("openclaw-new-\(UUID().uuidString).log")
        fm.createFile(atPath: older.path, contents: Data("old".utf8))
        fm.createFile(atPath: newer.path, contents: Data("new".utf8))
        try fm.setAttributes([.modificationDate: Date(timeIntervalSinceNow: -100)], ofItemAtPath: older.path)
        try fm.setAttributes([.modificationDate: Date()], ofItemAtPath: newer.path)

        let best = LogLocator.bestLogFile()
        #expect(best?.lastPathComponent == newer.lastPathComponent)

        try? fm.removeItem(at: older)
        try? fm.removeItem(at: newer)
    }

    @Test func gatewayEntrypointNilWhenMissing() {
        let tmp = URL(fileURLWithPath: NSTemporaryDirectory(), isDirectory: true)
            .appendingPathComponent(UUID().uuidString, isDirectory: true)
        #expect(CommandResolver.gatewayEntrypoint(in: tmp) == nil)
    }
}
