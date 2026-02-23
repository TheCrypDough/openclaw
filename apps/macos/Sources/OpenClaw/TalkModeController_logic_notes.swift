/*
 * AUTO ANNOTATION
 * File: apps/macos/Sources/OpenClaw/TalkModeController.swift
 * Purpose: File in apps area for project orchestration/configuration/data.
 * Module area: Native apps (macOS / iOS / Android / shared app assets)
 * System effect: Change can influence native apps (macos / ios / android / shared app assets) and therefore affects build/runtime behavior indirectly.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import Observation

@MainActor
@Observable
final class TalkModeController {
    static let shared = TalkModeController()

    private let logger = Logger(subsystem: "ai.openclaw", category: "talk.controller")

    private(set) var phase: TalkModePhase = .idle
    private(set) var isPaused: Bool = false

    func setEnabled(_ enabled: Bool) async {
        self.logger.info("talk enabled=\(enabled)")
        if enabled {
            TalkOverlayController.shared.present()
        } else {
            TalkOverlayController.shared.dismiss()
        }
        await TalkModeRuntime.shared.setEnabled(enabled)
    }

    func updatePhase(_ phase: TalkModePhase) {
        self.phase = phase
        TalkOverlayController.shared.updatePhase(phase)
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let effectivePhase = self.isPaused ? "paused" : phase.rawValue
        Task {
            await GatewayConnection.shared.talkMode(
                enabled: AppStateStore.shared.talkEnabled,
                phase: effectivePhase)
        }
    }

    func updateLevel(_ level: Double) {
        TalkOverlayController.shared.updateLevel(level)
    }

    func setPaused(_ paused: Bool) {
        guard self.isPaused != paused else { return }
        self.logger.info("talk paused=\(paused)")
        self.isPaused = paused
        TalkOverlayController.shared.updatePaused(paused)
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let effectivePhase = paused ? "paused" : self.phase.rawValue
        Task {
            await GatewayConnection.shared.talkMode(
                enabled: AppStateStore.shared.talkEnabled,
                phase: effectivePhase)
        }
        Task { await TalkModeRuntime.shared.setPaused(paused) }
    }

    func togglePaused() {
        self.setPaused(!self.isPaused)
    }

    func stopSpeaking(reason: TalkStopReason = .userTap) {
        Task { await TalkModeRuntime.shared.stopSpeaking(reason: reason) }
    }

    func exitTalkMode() {
        Task { await AppStateStore.shared.setTalkEnabled(false) }
    }
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
enum TalkStopReason {
    case userTap
    case speech
    case manual
}
