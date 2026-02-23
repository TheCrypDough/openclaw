/*
 * AUTO ANNOTATION
 * File: apps/macos/Tests/OpenClawIPCTests/SettingsViewSmokeTests.swift
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
struct SettingsViewSmokeTests {
    @Test func cronSettingsBuildsBody() {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let store = CronJobsStore(isPreview: true)
        store.schedulerEnabled = false
        store.schedulerStorePath = "/tmp/openclaw-cron-store.json"

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let job1 = CronJob(
            id: "job-1",
            agentId: "ops",
            name: "  Morning Check-in  ",
            description: nil,
            enabled: true,
            deleteAfterRun: nil,
            createdAtMs: 1_700_000_000_000,
            updatedAtMs: 1_700_000_100_000,
            schedule: .cron(expr: "0 8 * * *", tz: "UTC"),
            sessionTarget: .main,
            wakeMode: .now,
            payload: .systemEvent(text: "ping"),
            delivery: nil,
            state: CronJobState(
                nextRunAtMs: 1_700_000_200_000,
                runningAtMs: nil,
                lastRunAtMs: 1_700_000_050_000,
                lastStatus: "ok",
                lastError: nil,
                lastDurationMs: 123))

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let job2 = CronJob(
            id: "job-2",
            agentId: nil,
            name: "",
            description: nil,
            enabled: false,
            deleteAfterRun: nil,
            createdAtMs: 1_700_000_000_000,
            updatedAtMs: 1_700_000_100_000,
            schedule: .every(everyMs: 30000, anchorMs: nil),
            sessionTarget: .isolated,
            wakeMode: .nextHeartbeat,
            payload: .agentTurn(
                message: "hello",
                thinking: "low",
                timeoutSeconds: 30,
                deliver: nil,
                channel: nil,
                to: nil,
                bestEffortDeliver: nil),
            delivery: CronDelivery(mode: .announce, channel: "sms", to: "+15551234567", bestEffort: true),
            state: CronJobState(
                nextRunAtMs: nil,
                runningAtMs: nil,
                lastRunAtMs: nil,
                lastStatus: nil,
                lastError: nil,
                lastDurationMs: nil))

        store.jobs = [job1, job2]
        store.selectedJobId = job1.id
        store.runEntries = [
            CronRunLogEntry(
                ts: 1_700_000_050_000,
                jobId: job1.id,
                action: "finished",
                status: "ok",
                error: nil,
                summary: "ok",
                runAtMs: 1_700_000_050_000,
                durationMs: 123,
                nextRunAtMs: 1_700_000_200_000),
        ]

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let view = CronSettings(store: store)
        _ = view.body
    }

    @Test func cronSettingsExercisesPrivateViews() {
        CronSettings.exerciseForTesting()
    }

    @Test func configSettingsBuildsBody() {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let view = ConfigSettings()
        _ = view.body
    }

    @Test func debugSettingsBuildsBody() {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let view = DebugSettings()
        _ = view.body
    }

    @Test func generalSettingsBuildsBody() {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let state = AppState(preview: true)
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let view = GeneralSettings(state: state)
        _ = view.body
    }

    @Test func generalSettingsExercisesBranches() {
        GeneralSettings.exerciseForTesting()
    }

    @Test func sessionsSettingsBuildsBody() {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let view = SessionsSettings(rows: SessionRow.previewRows, isPreview: true)
        _ = view.body
    }

    @Test func instancesSettingsBuildsBody() {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let store = InstancesStore(isPreview: true)
        store.instances = [
            InstanceInfo(
                id: "local",
                host: "this-mac",
                ip: "127.0.0.1",
                version: "1.0",
                platform: "macos 15.0",
                deviceFamily: "Mac",
                modelIdentifier: "MacPreview",
                lastInputSeconds: 12,
                mode: "local",
                reason: "test",
                text: "test instance",
                ts: Date().timeIntervalSince1970 * 1000),
        ]
        let view = InstancesSettings(store: store)
        _ = view.body
    }

    @Test func permissionsSettingsBuildsBody() {
        let view = PermissionsSettings(
            status: [
                .notifications: true,
                .screenRecording: false,
            ],
            refresh: {},
            showOnboarding: {})
        _ = view.body
    }

    @Test func settingsRootViewBuildsBody() {
        let state = AppState(preview: true)
        let view = SettingsRootView(state: state, updater: nil, initialTab: .general)
        _ = view.body
    }

    @Test func aboutSettingsBuildsBody() {
        let view = AboutSettings(updater: nil)
        _ = view.body
    }

    @Test func voiceWakeSettingsBuildsBody() {
        let state = AppState(preview: true)
        let view = VoiceWakeSettings(state: state, isActive: false)
        _ = view.body
    }

    @Test func skillsSettingsBuildsBody() {
        let view = SkillsSettings(state: .preview)
        _ = view.body
    }
}
