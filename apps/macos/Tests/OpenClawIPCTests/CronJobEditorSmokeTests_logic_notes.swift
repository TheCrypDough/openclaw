/*
 * AUTO ANNOTATION
 * File: apps/macos/Tests/OpenClawIPCTests/CronJobEditorSmokeTests.swift
 * Purpose: File in apps area for project orchestration/configuration/data.
 * Module area: Native apps (macOS / iOS / Android / shared app assets)
 * System effect: Change can influence native apps (macos / ios / android / shared app assets) and therefore affects build/runtime behavior indirectly.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import SwiftUI
import Testing
@testable import OpenClaw

@Suite(.serialized)
@MainActor
struct CronJobEditorSmokeTests {
    @Test func statusPillBuildsBody() {
        _ = StatusPill(text: "ok", tint: .green).body
        _ = StatusPill(text: "disabled", tint: .secondary).body
    }

    @Test func cronJobEditorBuildsBodyForNewJob() {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let channelsStore = ChannelsStore(isPreview: true)
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let view = CronJobEditor(
            job: nil,
            isSaving: .constant(false),
            error: .constant(nil),
            channelsStore: channelsStore,
            onCancel: {},
            onSave: { _ in })
        _ = view.body
    }

    @Test func cronJobEditorBuildsBodyForExistingJob() {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let channelsStore = ChannelsStore(isPreview: true)
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let job = CronJob(
            id: "job-1",
            agentId: "ops",
            name: "Daily summary",
            description: nil,
            enabled: true,
            deleteAfterRun: nil,
            createdAtMs: 1_700_000_000_000,
            updatedAtMs: 1_700_000_000_000,
            schedule: .every(everyMs: 3_600_000, anchorMs: 1_700_000_000_000),
            sessionTarget: .isolated,
            wakeMode: .nextHeartbeat,
            payload: .agentTurn(
                message: "Summarize the last day",
                thinking: "low",
                timeoutSeconds: 120,
                deliver: nil,
                channel: nil,
                to: nil,
                bestEffortDeliver: nil),
            delivery: CronDelivery(mode: .announce, channel: "whatsapp", to: "+15551234567", bestEffort: true),
            state: CronJobState(
                nextRunAtMs: 1_700_000_100_000,
                runningAtMs: nil,
                lastRunAtMs: 1_700_000_050_000,
                lastStatus: "ok",
                lastError: nil,
                lastDurationMs: 1000))

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let view = CronJobEditor(
            job: job,
            isSaving: .constant(false),
            error: .constant(nil),
            channelsStore: channelsStore,
            onCancel: {},
            onSave: { _ in })
        _ = view.body
    }

    @Test func cronJobEditorExercisesBuilders() {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let channelsStore = ChannelsStore(isPreview: true)
        var view = CronJobEditor(
            job: nil,
            isSaving: .constant(false),
            error: .constant(nil),
            channelsStore: channelsStore,
            onCancel: {},
            onSave: { _ in })
        view.exerciseForTesting()
    }

    @Test func cronJobEditorIncludesDeleteAfterRunForAtSchedule() throws {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let channelsStore = ChannelsStore(isPreview: true)
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let view = CronJobEditor(
            job: nil,
            isSaving: .constant(false),
            error: .constant(nil),
            channelsStore: channelsStore,
            onCancel: {},
            onSave: { _ in })

        var root: [String: Any] = [:]
        view.applyDeleteAfterRun(to: &root, scheduleKind: CronJobEditor.ScheduleKind.at, deleteAfterRun: true)
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let raw = root["deleteAfterRun"] as? Bool
        #expect(raw == true)
    }
}
