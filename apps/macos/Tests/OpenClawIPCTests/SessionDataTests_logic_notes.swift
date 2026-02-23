/*
 * AUTO ANNOTATION
 * File: apps/macos/Tests/OpenClawIPCTests/SessionDataTests.swift
 * Purpose: File in apps area for project orchestration/configuration/data.
 * Module area: Native apps (macOS / iOS / Android / shared app assets)
 * System effect: Change can influence native apps (macos / ios / android / shared app assets) and therefore affects build/runtime behavior indirectly.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import Foundation
import Testing
@testable import OpenClaw

@Suite
struct SessionDataTests {
    @Test func sessionKindFromKeyDetectsCommonKinds() {
        #expect(SessionKind.from(key: "global") == .global)
        #expect(SessionKind.from(key: "discord:group:engineering") == .group)
        #expect(SessionKind.from(key: "unknown") == .unknown)
        #expect(SessionKind.from(key: "user@example.com") == .direct)
    }

    @Test func sessionTokenStatsFormatKTokensRoundsAsExpected() {
        #expect(SessionTokenStats.formatKTokens(999) == "999")
        #expect(SessionTokenStats.formatKTokens(1000) == "1.0k")
        #expect(SessionTokenStats.formatKTokens(12340) == "12k")
    }

    @Test func sessionTokenStatsPercentUsedClampsTo100() {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let stats = SessionTokenStats(input: 0, output: 0, total: 250_000, contextTokens: 200_000)
        #expect(stats.percentUsed == 100)
    }

    @Test func sessionRowFlagLabelsIncludeNonDefaultFlags() {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let row = SessionRow(
            id: "x",
            key: "user@example.com",
            kind: .direct,
            displayName: nil,
            provider: nil,
            subject: nil,
            room: nil,
            space: nil,
            updatedAt: Date(),
            sessionId: nil,
            thinkingLevel: "high",
            verboseLevel: "debug",
            systemSent: true,
            abortedLastRun: true,
            tokens: SessionTokenStats(input: 1, output: 2, total: 3, contextTokens: 10),
            model: nil)
        #expect(row.flagLabels.contains("think high"))
        #expect(row.flagLabels.contains("verbose debug"))
        #expect(row.flagLabels.contains("system sent"))
        #expect(row.flagLabels.contains("aborted"))
    }
}
