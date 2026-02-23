/*
 * AUTO ANNOTATION
 * File: apps/ios/Tests/CameraControllerErrorTests.swift
 * Purpose: File in apps area for project orchestration/configuration/data.
 * Module area: Native apps (macOS / iOS / Android / shared app assets)
 * System effect: Change can influence native apps (macos / ios / android / shared app assets) and therefore affects build/runtime behavior indirectly.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import Testing
@testable import OpenClaw

@Suite struct CameraControllerErrorTests {
    @Test func errorDescriptionsAreStable() {
        #expect(CameraController.CameraError.cameraUnavailable.errorDescription == "Camera unavailable")
        #expect(CameraController.CameraError.microphoneUnavailable.errorDescription == "Microphone unavailable")
        #expect(CameraController.CameraError.permissionDenied(kind: "Camera")
            .errorDescription == "Camera permission denied")
        #expect(CameraController.CameraError.invalidParams("bad").errorDescription == "bad")
        #expect(CameraController.CameraError.captureFailed("nope").errorDescription == "nope")
        #expect(CameraController.CameraError.exportFailed("export").errorDescription == "export")
    }
}
