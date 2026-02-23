/*
 * AUTO ANNOTATION
 * File: apps/shared/OpenClawKit/Sources/OpenClawKit/GatewayErrors.swift
 * Purpose: File in apps area for project orchestration/configuration/data.
 * Module area: Native apps (macOS / iOS / Android / shared app assets)
 * System effect: Change can influence native apps (macos / ios / android / shared app assets) and therefore affects build/runtime behavior indirectly.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import OpenClawProtocol
import Foundation

/// Structured error surfaced when the gateway responds with `{ ok: false }`.
public struct GatewayResponseError: LocalizedError, @unchecked Sendable {
    public let method: String
    public let code: String
    public let message: String
    public let details: [String: AnyCodable]

    public init(method: String, code: String?, message: String?, details: [String: AnyCodable]?) {
        self.method = method
        self.code = (code?.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty == false)
            ? code!.trimmingCharacters(in: .whitespacesAndNewlines)
            : "GATEWAY_ERROR"
        self.message = (message?.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty == false)
            ? message!.trimmingCharacters(in: .whitespacesAndNewlines)
            : "gateway error"
        self.details = details ?? [:]
    }

    public var errorDescription: String? {
        if self.code == "GATEWAY_ERROR" { return "\(self.method): \(self.message)" }
        return "\(self.method): [\(self.code)] \(self.message)"
    }
}

public struct GatewayDecodingError: LocalizedError, Sendable {
    public let method: String
    public let message: String

    public init(method: String, message: String) {
        self.method = method
        self.message = message
    }

    public var errorDescription: String? { "\(self.method): \(self.message)" }
}
