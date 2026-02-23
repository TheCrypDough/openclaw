/*
 * AUTO ANNOTATION
 * File: apps/macos/Tests/OpenClawIPCTests/PermissionManagerTests.swift
 * Purpose: File in apps area for project orchestration/configuration/data.
 * Module area: Native apps (macOS / iOS / Android / shared app assets)
 * System effect: Change can influence native apps (macos / ios / android / shared app assets) and therefore affects build/runtime behavior indirectly.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import OpenClawIPC
import CoreLocation
import Testing
@testable import OpenClaw

@Suite(.serialized)
@MainActor
struct PermissionManagerTests {
    @Test func voiceWakePermissionHelpersMatchStatus() async {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let direct = PermissionManager.voiceWakePermissionsGranted()
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let ensured = await PermissionManager.ensureVoiceWakePermissions(interactive: false)
        #expect(ensured == direct)
    }

    @Test func statusCanQueryNonInteractiveCaps() async {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let caps: [Capability] = [.microphone, .speechRecognition, .screenRecording]
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let status = await PermissionManager.status(caps)
        #expect(status.keys.count == caps.count)
    }

    @Test func ensureNonInteractiveDoesNotThrow() async {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let caps: [Capability] = [.microphone, .speechRecognition, .screenRecording]
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let ensured = await PermissionManager.ensure(caps, interactive: false)
        #expect(ensured.keys.count == caps.count)
    }

    @Test func locationStatusMatchesAuthorizationAlways() async {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let status = CLLocationManager().authorizationStatus
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let results = await PermissionManager.status([.location])
        #expect(results[.location] == (status == .authorizedAlways))
    }

    @Test func ensureLocationNonInteractiveMatchesAuthorizationAlways() async {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let status = CLLocationManager().authorizationStatus
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let ensured = await PermissionManager.ensure([.location], interactive: false)
        #expect(ensured[.location] == (status == .authorizedAlways))
    }
}
