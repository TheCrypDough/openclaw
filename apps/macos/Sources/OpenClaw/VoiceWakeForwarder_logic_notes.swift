/*
 * AUTO ANNOTATION
 * File: apps/macos/Sources/OpenClaw/VoiceWakeForwarder.swift
 * Purpose: File in apps area for project orchestration/configuration/data.
 * Module area: Native apps (macOS / iOS / Android / shared app assets)
 * System effect: Change can influence native apps (macos / ios / android / shared app assets) and therefore affects build/runtime behavior indirectly.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import Foundation
import OSLog

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
enum VoiceWakeForwarder {
    private static let logger = Logger(subsystem: "ai.openclaw", category: "voicewake.forward")

    static func prefixedTranscript(_ transcript: String, machineName: String? = nil) -> String {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let resolvedMachine = machineName
            .flatMap { name -> String? in
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
                let trimmed = name.trimmingCharacters(in: .whitespacesAndNewlines)
                return trimmed.isEmpty ? nil : trimmed
            }
            ?? Host.current().localizedName
            ?? ProcessInfo.processInfo.hostName

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let safeMachine = resolvedMachine.isEmpty ? "this Mac" : resolvedMachine
        return """
        User talked via voice recognition on \(safeMachine) - repeat prompt first \
        + remember some words might be incorrectly transcribed.

        \(transcript)
        """
    }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    enum VoiceWakeForwardError: LocalizedError, Equatable {
        case rpcFailed(String)

        var errorDescription: String? {
            switch self {
            case let .rpcFailed(message): message
            }
        }
    }

    struct ForwardOptions: Sendable {
        var sessionKey: String = "main"
        var thinking: String = "low"
        var deliver: Bool = true
        var to: String?
        var channel: GatewayAgentChannel = .last
    }

    @discardableResult
    static func forward(
        transcript: String,
        options: ForwardOptions = ForwardOptions()) async -> Result<Void, VoiceWakeForwardError>
    {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let payload = Self.prefixedTranscript(transcript)
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let deliver = options.channel.shouldDeliver(options.deliver)
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let result = await GatewayConnection.shared.sendAgent(GatewayAgentInvocation(
            message: payload,
            sessionKey: options.sessionKey,
            thinking: options.thinking,
            deliver: deliver,
            to: options.to,
            channel: options.channel))

        if result.ok {
            self.logger.info("voice wake forward ok")
            return .success(())
        }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let message = result.error ?? "agent rpc unavailable"
        self.logger.error("voice wake forward failed: \(message, privacy: .public)")
        return .failure(.rpcFailed(message))
    }

    static func checkConnection() async -> Result<Void, VoiceWakeForwardError> {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let status = await GatewayConnection.shared.status()
        if status.ok { return .success(()) }
        return .failure(.rpcFailed(status.error ?? "agent rpc unreachable"))
    }
}
