/*
 * AUTO ANNOTATION
 * File: apps/macos/Tests/OpenClawIPCTests/VoiceWakeGlobalSettingsSyncTests.swift
 * Purpose: File in apps area for project orchestration/configuration/data.
 * Module area: Native apps (macOS / iOS / Android / shared app assets)
 * System effect: Change can influence native apps (macos / ios / android / shared app assets) and therefore affects build/runtime behavior indirectly.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import OpenClawProtocol
import Foundation
import Testing
@testable import OpenClaw

@Suite(.serialized) struct VoiceWakeGlobalSettingsSyncTests {
    @Test func appliesVoiceWakeChangedEventToAppState() async {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let previous = await MainActor.run { AppStateStore.shared.swabbleTriggerWords }

        await MainActor.run {
            AppStateStore.shared.applyGlobalVoiceWakeTriggers(["before"])
        }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let payload = OpenClawProtocol.AnyCodable(["triggers": ["openclaw", "computer"]])
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let evt = EventFrame(
            type: "event",
            event: "voicewake.changed",
            payload: payload,
            seq: nil,
            stateversion: nil)

        await VoiceWakeGlobalSettingsSync.shared.handle(push: .event(evt))

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let updated = await MainActor.run { AppStateStore.shared.swabbleTriggerWords }
        #expect(updated == ["openclaw", "computer"])

        await MainActor.run {
            AppStateStore.shared.applyGlobalVoiceWakeTriggers(previous)
        }
    }

    @Test func ignoresVoiceWakeChangedEventWithInvalidPayload() async {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let previous = await MainActor.run { AppStateStore.shared.swabbleTriggerWords }

        await MainActor.run {
            AppStateStore.shared.applyGlobalVoiceWakeTriggers(["before"])
        }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let payload = OpenClawProtocol.AnyCodable(["unexpected": 123])
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let evt = EventFrame(
            type: "event",
            event: "voicewake.changed",
            payload: payload,
            seq: nil,
            stateversion: nil)

        await VoiceWakeGlobalSettingsSync.shared.handle(push: .event(evt))

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let updated = await MainActor.run { AppStateStore.shared.swabbleTriggerWords }
        #expect(updated == ["before"])

        await MainActor.run {
            AppStateStore.shared.applyGlobalVoiceWakeTriggers(previous)
        }
    }
}
