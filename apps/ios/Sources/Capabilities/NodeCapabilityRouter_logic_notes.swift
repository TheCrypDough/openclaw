/*
 * AUTO ANNOTATION
 * File: apps/ios/Sources/Capabilities/NodeCapabilityRouter.swift
 * Purpose: File in apps area for project orchestration/configuration/data.
 * Module area: Native apps (macOS / iOS / Android / shared app assets)
 * System effect: Change can influence native apps (macos / ios / android / shared app assets) and therefore affects build/runtime behavior indirectly.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import Foundation
import OpenClawKit

@MainActor
final class NodeCapabilityRouter {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    enum RouterError: Error {
        case unknownCommand
        case handlerUnavailable
    }

    typealias Handler = (BridgeInvokeRequest) async throws -> BridgeInvokeResponse

    private let handlers: [String: Handler]

    init(handlers: [String: Handler]) {
        self.handlers = handlers
    }

    func handle(_ request: BridgeInvokeRequest) async throws -> BridgeInvokeResponse {
        guard let handler = handlers[request.command] else {
            throw RouterError.unknownCommand
        }
        return try await handler(request)
    }
}
