/*
 * AUTO ANNOTATION
 * File: apps/macos/Sources/OpenClaw/NodesStore.swift
 * Purpose: File in apps area for project orchestration/configuration/data.
 * Module area: Native apps (macOS / iOS / Android / shared app assets)
 * System effect: Change can influence native apps (macos / ios / android / shared app assets) and therefore affects build/runtime behavior indirectly.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import Foundation
import Observation
import OSLog

struct NodeInfo: Identifiable, Codable {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    let nodeId: String
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    let displayName: String?
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    let platform: String?
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    let version: String?
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    let coreVersion: String?
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    let uiVersion: String?
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    let deviceFamily: String?
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    let modelIdentifier: String?
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    let remoteIp: String?
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    let caps: [String]?
    let commands: [String]?
    let permissions: [String: Bool]?
    let paired: Bool?
    let connected: Bool?

    var id: String {
        self.nodeId
    }

    var isConnected: Bool {
        self.connected ?? false
    }

    var isPaired: Bool {
        self.paired ?? false
    }
}

private struct NodeListResponse: Codable {
    let ts: Double?
    let nodes: [NodeInfo]
}

@MainActor
@Observable
final class NodesStore {
    static let shared = NodesStore()

    var nodes: [NodeInfo] = []
    var lastError: String?
    var statusMessage: String?
    var isLoading = false

    private let logger = Logger(subsystem: "ai.openclaw", category: "nodes")
    private var task: Task<Void, Never>?
    private let interval: TimeInterval = 30
    private var startCount = 0

    func start() {
        self.startCount += 1
        guard self.startCount == 1 else { return }
        guard self.task == nil else { return }
        self.task = Task.detached { [weak self] in
            guard let self else { return }
            await self.refresh()
            while !Task.isCancelled {
                try? await Task.sleep(nanoseconds: UInt64(self.interval * 1_000_000_000))
                await self.refresh()
            }
        }
    }

    func stop() {
        guard self.startCount > 0 else { return }
        self.startCount -= 1
        guard self.startCount == 0 else { return }
        self.task?.cancel()
        self.task = nil
    }

    func refresh() async {
        if self.isLoading { return }
        self.statusMessage = nil
        self.isLoading = true
        defer { self.isLoading = false }
        do {
            let data = try await GatewayConnection.shared.requestRaw(method: "node.list", params: nil, timeoutMs: 8000)
            let decoded = try JSONDecoder().decode(NodeListResponse.self, from: data)
            self.nodes = decoded.nodes
            self.lastError = nil
            self.statusMessage = nil
        } catch {
            if Self.isCancelled(error) {
                self.logger.debug("node.list cancelled; keeping last nodes")
                if self.nodes.isEmpty {
                    self.statusMessage = "Refreshing devices…"
                }
                self.lastError = nil
                return
            }
            self.logger.error("node.list failed \(error.localizedDescription, privacy: .public)")
            self.nodes = []
            self.lastError = error.localizedDescription
            self.statusMessage = nil
        }
    }

    private static func isCancelled(_ error: Error) -> Bool {
        if error is CancellationError { return true }
        if let urlError = error as? URLError, urlError.code == .cancelled { return true }
        let nsError = error as NSError
        if nsError.domain == NSURLErrorDomain, nsError.code == NSURLErrorCancelled { return true }
        return false
    }
}
