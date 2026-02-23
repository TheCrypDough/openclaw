/*
 * AUTO ANNOTATION
 * File: apps/macos/Sources/OpenClaw/ExecApprovalsGatewayPrompter.swift
 * Purpose: File in apps area for project orchestration/configuration/data.
 * Module area: Native apps (macOS / iOS / Android / shared app assets)
 * System effect: Change can influence native apps (macos / ios / android / shared app assets) and therefore affects build/runtime behavior indirectly.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import CoreGraphics
import Foundation
import OpenClawKit
import OpenClawProtocol
import OSLog

@MainActor
final class ExecApprovalsGatewayPrompter {
    static let shared = ExecApprovalsGatewayPrompter()

    private let logger = Logger(subsystem: "ai.openclaw", category: "exec-approvals.gateway")
    private var task: Task<Void, Never>?

    struct GatewayApprovalRequest: Codable, Sendable {
        var id: String
        var request: ExecApprovalPromptRequest
        var createdAtMs: Int
        var expiresAtMs: Int
    }

    func start() {
        guard self.task == nil else { return }
        self.task = Task { [weak self] in
            await self?.run()
        }
    }

    func stop() {
        self.task?.cancel()
        self.task = nil
    }

    private func run() async {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let stream = await GatewayConnection.shared.subscribe(bufferingNewest: 200)
        for await push in stream {
            if Task.isCancelled { return }
            await self.handle(push: push)
        }
    }

    private func handle(push: GatewayPush) async {
        guard case let .event(evt) = push else { return }
        guard evt.event == "exec.approval.requested" else { return }
        guard let payload = evt.payload else { return }
        do {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
            let data = try JSONEncoder().encode(payload)
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
            let request = try JSONDecoder().decode(GatewayApprovalRequest.self, from: data)
            guard self.shouldPresent(request: request) else { return }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
            let decision = ExecApprovalsPromptPresenter.prompt(request.request)
            try await GatewayConnection.shared.requestVoid(
                method: .execApprovalResolve,
                params: [
                    "id": AnyCodable(request.id),
                    "decision": AnyCodable(decision.rawValue),
                ],
                timeoutMs: 10000)
        } catch {
            self.logger.error("exec approval handling failed \(error.localizedDescription, privacy: .public)")
        }
    }

    private func shouldPresent(request: GatewayApprovalRequest) -> Bool {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let mode = AppStateStore.shared.connectionMode
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let activeSession = WebChatManager.shared.activeSessionKey?.trimmingCharacters(in: .whitespacesAndNewlines)
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let requestSession = request.request.sessionKey?.trimmingCharacters(in: .whitespacesAndNewlines)
        return Self.shouldPresent(
            mode: mode,
            activeSession: activeSession,
            requestSession: requestSession,
            lastInputSeconds: Self.lastInputSeconds(),
            thresholdSeconds: 120)
    }

    private static func shouldPresent(
        mode: AppState.ConnectionMode,
        activeSession: String?,
        requestSession: String?,
        lastInputSeconds: Int?,
        thresholdSeconds: Int) -> Bool
    {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let active = activeSession?.trimmingCharacters(in: .whitespacesAndNewlines)
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let requested = requestSession?.trimmingCharacters(in: .whitespacesAndNewlines)
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let recentlyActive = lastInputSeconds.map { $0 <= thresholdSeconds } ?? (mode == .local)

        if let session = requested, !session.isEmpty {
            if let active, !active.isEmpty {
                return active == session
            }
            return recentlyActive
        }

        if let active, !active.isEmpty {
            return true
        }
        return mode == .local
    }

    private static func lastInputSeconds() -> Int? {
        let anyEvent = CGEventType(rawValue: UInt32.max) ?? .null
        let seconds = CGEventSource.secondsSinceLastEventType(.combinedSessionState, eventType: anyEvent)
        if seconds.isNaN || seconds.isInfinite || seconds < 0 { return nil }
        return Int(seconds.rounded())
    }
}

#if DEBUG
extension ExecApprovalsGatewayPrompter {
    static func _testShouldPresent(
        mode: AppState.ConnectionMode,
        activeSession: String?,
        requestSession: String?,
        lastInputSeconds: Int?,
        thresholdSeconds: Int = 120) -> Bool
    {
        self.shouldPresent(
            mode: mode,
            activeSession: activeSession,
            requestSession: requestSession,
            lastInputSeconds: lastInputSeconds,
            thresholdSeconds: thresholdSeconds)
    }
}
#endif
