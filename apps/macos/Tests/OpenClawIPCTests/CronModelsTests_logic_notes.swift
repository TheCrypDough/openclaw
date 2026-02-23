/*
 * AUTO ANNOTATION
 * File: apps/macos/Tests/OpenClawIPCTests/CronModelsTests.swift
 * Purpose: File in apps area for project orchestration/configuration/data.
 * Module area: Native apps (macOS / iOS / Android / shared app assets)
 * System effect: Change can influence native apps (macos / ios / android / shared app assets) and therefore affects build/runtime behavior indirectly.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import Foundation
import Testing
@testable import OpenClaw

@Suite
struct CronModelsTests {
    @Test func scheduleAtEncodesAndDecodes() throws {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let schedule = CronSchedule.at(at: "2026-02-03T18:00:00Z")
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let data = try JSONEncoder().encode(schedule)
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let decoded = try JSONDecoder().decode(CronSchedule.self, from: data)
        #expect(decoded == schedule)
    }

    @Test func scheduleAtDecodesLegacyAtMs() throws {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let json = """
        {"kind":"at","atMs":1700000000000}
        """
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let decoded = try JSONDecoder().decode(CronSchedule.self, from: Data(json.utf8))
        if case let .at(at) = decoded {
            #expect(at.hasPrefix("2023-"))
        } else {
            #expect(Bool(false))
        }
    }

    @Test func scheduleEveryEncodesAndDecodesWithAnchor() throws {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let schedule = CronSchedule.every(everyMs: 5000, anchorMs: 10000)
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let data = try JSONEncoder().encode(schedule)
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let decoded = try JSONDecoder().decode(CronSchedule.self, from: data)
        #expect(decoded == schedule)
    }

    @Test func scheduleCronEncodesAndDecodesWithTimezone() throws {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let schedule = CronSchedule.cron(expr: "*/5 * * * *", tz: "Europe/Vienna")
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let data = try JSONEncoder().encode(schedule)
        let decoded = try JSONDecoder().decode(CronSchedule.self, from: data)
        #expect(decoded == schedule)
    }

    @Test func payloadAgentTurnEncodesAndDecodes() throws {
        let payload = CronPayload.agentTurn(
            message: "hello",
            thinking: "low",
            timeoutSeconds: 15,
            deliver: true,
            channel: "whatsapp",
            to: "+15551234567",
            bestEffortDeliver: false)
        let data = try JSONEncoder().encode(payload)
        let decoded = try JSONDecoder().decode(CronPayload.self, from: data)
        #expect(decoded == payload)
    }

    @Test func jobEncodesAndDecodesDeleteAfterRun() throws {
        let job = CronJob(
            id: "job-1",
            agentId: nil,
            name: "One-shot",
            description: nil,
            enabled: true,
            deleteAfterRun: true,
            createdAtMs: 0,
            updatedAtMs: 0,
            schedule: .at(at: "2026-02-03T18:00:00Z"),
            sessionTarget: .main,
            wakeMode: .now,
            payload: .systemEvent(text: "ping"),
            delivery: nil,
            state: CronJobState())
        let data = try JSONEncoder().encode(job)
        let decoded = try JSONDecoder().decode(CronJob.self, from: data)
        #expect(decoded.deleteAfterRun == true)
    }

    @Test func scheduleDecodeRejectsUnknownKind() {
        let json = """
        {"kind":"wat","at":"2026-02-03T18:00:00Z"}
        """
        #expect(throws: DecodingError.self) {
            _ = try JSONDecoder().decode(CronSchedule.self, from: Data(json.utf8))
        }
    }

    @Test func payloadDecodeRejectsUnknownKind() {
        let json = """
        {"kind":"wat","text":"hello"}
        """
        #expect(throws: DecodingError.self) {
            _ = try JSONDecoder().decode(CronPayload.self, from: Data(json.utf8))
        }
    }

    @Test func displayNameTrimsWhitespaceAndFallsBack() {
        let base = CronJob(
            id: "x",
            agentId: nil,
            name: "  hello  ",
            description: nil,
            enabled: true,
            deleteAfterRun: nil,
            createdAtMs: 0,
            updatedAtMs: 0,
            schedule: .at(at: "2026-02-03T18:00:00Z"),
            sessionTarget: .main,
            wakeMode: .now,
            payload: .systemEvent(text: "hi"),
            delivery: nil,
            state: CronJobState())
        #expect(base.displayName == "hello")

        var unnamed = base
        unnamed.name = "   "
        #expect(unnamed.displayName == "Untitled job")
    }

    @Test func nextRunDateAndLastRunDateDeriveFromState() {
        let job = CronJob(
            id: "x",
            agentId: nil,
            name: "t",
            description: nil,
            enabled: true,
            deleteAfterRun: nil,
            createdAtMs: 0,
            updatedAtMs: 0,
            schedule: .at(at: "2026-02-03T18:00:00Z"),
            sessionTarget: .main,
            wakeMode: .now,
            payload: .systemEvent(text: "hi"),
            delivery: nil,
            state: CronJobState(
                nextRunAtMs: 1_700_000_000_000,
                runningAtMs: nil,
                lastRunAtMs: 1_700_000_050_000,
                lastStatus: nil,
                lastError: nil,
                lastDurationMs: nil))
        #expect(job.nextRunDate == Date(timeIntervalSince1970: 1_700_000_000))
        #expect(job.lastRunDate == Date(timeIntervalSince1970: 1_700_000_050))
    }
}
