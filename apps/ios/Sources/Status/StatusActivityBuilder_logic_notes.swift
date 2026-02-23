/*
 * AUTO ANNOTATION
 * File: apps/ios/Sources/Status/StatusActivityBuilder.swift
 * Purpose: File in apps area for project orchestration/configuration/data.
 * Module area: Native apps (macOS / iOS / Android / shared app assets)
 * System effect: Change can influence native apps (macos / ios / android / shared app assets) and therefore affects build/runtime behavior indirectly.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import SwiftUI

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
enum StatusActivityBuilder {
    @MainActor
    static func build(
        appModel: NodeAppModel,
        voiceWakeEnabled: Bool,
        cameraHUDText: String?,
        cameraHUDKind: NodeAppModel.CameraHUDKind?
    ) -> StatusPill.Activity? {
        // Keep the top pill consistent across tabs (camera + voice wake + pairing states).
        if appModel.isBackgrounded {
            return StatusPill.Activity(
                title: "Foreground required",
                systemImage: "exclamationmark.triangle.fill",
                tint: .orange)
        }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let gatewayStatus = appModel.gatewayStatusText.trimmingCharacters(in: .whitespacesAndNewlines)
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let gatewayLower = gatewayStatus.lowercased()
        if gatewayLower.contains("repair") {
            return StatusPill.Activity(title: "Repairing…", systemImage: "wrench.and.screwdriver", tint: .orange)
        }
        if gatewayLower.contains("approval") || gatewayLower.contains("pairing") {
            return StatusPill.Activity(title: "Approval pending", systemImage: "person.crop.circle.badge.clock")
        }
        // Avoid duplicating the primary gateway status ("Connecting…") in the activity slot.

        if appModel.screenRecordActive {
            return StatusPill.Activity(title: "Recording screen…", systemImage: "record.circle.fill", tint: .red)
        }

        if let cameraHUDText, !cameraHUDText.isEmpty, let cameraHUDKind {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
            let systemImage: String
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
            let tint: Color?
            switch cameraHUDKind {
            case .photo:
                systemImage = "camera.fill"
                tint = nil
            case .recording:
                systemImage = "video.fill"
                tint = .red
            case .success:
                systemImage = "checkmark.circle.fill"
                tint = .green
            case .error:
                systemImage = "exclamationmark.triangle.fill"
                tint = .red
            }
            return StatusPill.Activity(title: cameraHUDText, systemImage: systemImage, tint: tint)
        }

        if voiceWakeEnabled {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
            let voiceStatus = appModel.voiceWake.statusText
            if voiceStatus.localizedCaseInsensitiveContains("microphone permission") {
                return StatusPill.Activity(title: "Mic permission", systemImage: "mic.slash", tint: .orange)
            }
            if voiceStatus == "Paused" {
                // Talk mode intentionally pauses voice wake to release the mic. Don't spam the HUD for that case.
                if appModel.talkMode.isEnabled {
                    return nil
                }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
                let suffix = appModel.isBackgrounded ? " (background)" : ""
                return StatusPill.Activity(title: "Voice Wake paused\(suffix)", systemImage: "pause.circle.fill")
            }
        }

        return nil
    }
}

