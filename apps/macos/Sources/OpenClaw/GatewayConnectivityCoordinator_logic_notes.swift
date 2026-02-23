/*
 * AUTO ANNOTATION
 * File: apps/macos/Sources/OpenClaw/GatewayConnectivityCoordinator.swift
 * Purpose: File in apps area for project orchestration/configuration/data.
 * Module area: Native apps (macOS / iOS / Android / shared app assets)
 * System effect: Change can influence native apps (macos / ios / android / shared app assets) and therefore affects build/runtime behavior indirectly.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import Foundation
import Observation
import OSLog

@MainActor
@Observable
final class GatewayConnectivityCoordinator {
    static let shared = GatewayConnectivityCoordinator()

    private let logger = Logger(subsystem: "ai.openclaw", category: "gateway.connectivity")
    private var endpointTask: Task<Void, Never>?
    private var lastResolvedURL: URL?

    private(set) var endpointState: GatewayEndpointState?
    private(set) var resolvedURL: URL?
    private(set) var resolvedMode: AppState.ConnectionMode?
    private(set) var resolvedHostLabel: String?

    private init() {
        self.start()
    }

    func start() {
        guard self.endpointTask == nil else { return }
        self.endpointTask = Task { [weak self] in
            guard let self else { return }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
            let stream = await GatewayEndpointStore.shared.subscribe()
            for await state in stream {
                await MainActor.run { self.handleEndpointState(state) }
            }
        }
    }

    var localEndpointHostLabel: String? {
        guard self.resolvedMode == .local, let url = self.resolvedURL else { return nil }
        return Self.hostLabel(for: url)
    }

    private func handleEndpointState(_ state: GatewayEndpointState) {
        self.endpointState = state
        switch state {
        case let .ready(mode, url, _, _):
            self.resolvedMode = mode
            self.resolvedURL = url
            self.resolvedHostLabel = Self.hostLabel(for: url)
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
            let urlChanged = self.lastResolvedURL?.absoluteString != url.absoluteString
            if urlChanged {
                self.lastResolvedURL = url
                Task { await ControlChannel.shared.refreshEndpoint(reason: "endpoint changed") }
            }
        case let .connecting(mode, _):
            self.resolvedMode = mode
        case let .unavailable(mode, _):
            self.resolvedMode = mode
        }
    }

    private static func hostLabel(for url: URL) -> String {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let host = url.host ?? url.absoluteString
        if let port = url.port { return "\(host):\(port)" }
        return host
    }
}
