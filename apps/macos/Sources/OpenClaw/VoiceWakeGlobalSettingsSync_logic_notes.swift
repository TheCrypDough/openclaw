/*
 * AUTO ANNOTATION
 * File: apps/macos/Sources/OpenClaw/VoiceWakeGlobalSettingsSync.swift
 * Purpose: File in apps area for project orchestration/configuration/data.
 * Module area: Native apps (macOS / iOS / Android / shared app assets)
 * System effect: Change can influence native apps (macos / ios / android / shared app assets) and therefore affects build/runtime behavior indirectly.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import Foundation
import OpenClawKit
import OSLog

@MainActor
final class VoiceWakeGlobalSettingsSync {
    static let shared = VoiceWakeGlobalSettingsSync()

    private let logger = Logger(subsystem: "ai.openclaw", category: "voicewake.sync")
    private var task: Task<Void, Never>?

    private struct VoiceWakePayload: Codable, Equatable {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let triggers: [String]
    }

    func start() {
        guard self.task == nil else { return }
        self.task = Task { [weak self] in
            guard let self else { return }
            while !Task.isCancelled {
                do {
                    try await GatewayConnection.shared.refresh()
                } catch {
                    // Not configured / not reachable yet.
                }

                await self.refreshFromGateway()

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
                let stream = await GatewayConnection.shared.subscribe(bufferingNewest: 200)
                for await push in stream {
                    if Task.isCancelled { return }
                    await self.handle(push: push)
                }

                // If the stream finishes (gateway shutdown / reconnect), loop and resubscribe.
                try? await Task.sleep(nanoseconds: 600_000_000)
            }
        }
    }

    func stop() {
        self.task?.cancel()
        self.task = nil
    }

    private func refreshFromGateway() async {
        do {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
            let triggers = try await GatewayConnection.shared.voiceWakeGetTriggers()
            AppStateStore.shared.applyGlobalVoiceWakeTriggers(triggers)
        } catch {
            // Best-effort only.
        }
    }

    func handle(push: GatewayPush) async {
        guard case let .event(evt) = push else { return }
        guard evt.event == "voicewake.changed" else { return }
        guard let payload = evt.payload else { return }
        do {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
            let decoded = try GatewayPayloadDecoding.decode(payload, as: VoiceWakePayload.self)
            AppStateStore.shared.applyGlobalVoiceWakeTriggers(decoded.triggers)
        } catch {
            self.logger.error("failed to decode voicewake.changed: \(error.localizedDescription, privacy: .public)")
        }
    }
}
