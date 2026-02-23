/*
 * AUTO ANNOTATION
 * File: apps/ios/Sources/Gateway/GatewayConnectionIssue.swift
 * Purpose: File in apps area for project orchestration/configuration/data.
 * Module area: Native apps (macOS / iOS / Android / shared app assets)
 * System effect: Change can influence native apps (macos / ios / android / shared app assets) and therefore affects build/runtime behavior indirectly.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import Foundation

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
enum GatewayConnectionIssue: Equatable {
    case none
    case tokenMissing
    case unauthorized
    case pairingRequired(requestId: String?)
    case network
    case unknown(String)

    var requestId: String? {
        if case let .pairingRequired(requestId) = self {
            return requestId
        }
        return nil
    }

    var needsAuthToken: Bool {
        switch self {
        case .tokenMissing, .unauthorized:
            return true
        default:
            return false
        }
    }

    var needsPairing: Bool {
        if case .pairingRequired = self { return true }
        return false
    }

    static func detect(from statusText: String) -> Self {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let trimmed = statusText.trimmingCharacters(in: .whitespacesAndNewlines)
        guard !trimmed.isEmpty else { return .none }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let lower = trimmed.lowercased()

        if lower.contains("pairing required") || lower.contains("not_paired") || lower.contains("not paired") {
            return .pairingRequired(requestId: self.extractRequestId(from: trimmed))
        }
        if lower.contains("gateway token missing") {
            return .tokenMissing
        }
        if lower.contains("unauthorized") {
            return .unauthorized
        }
        if lower.contains("connection refused") ||
            lower.contains("timed out") ||
            lower.contains("network is unreachable") ||
            lower.contains("cannot find host") ||
            lower.contains("could not connect")
        {
            return .network
        }
        if lower.hasPrefix("gateway error:") {
            return .unknown(trimmed)
        }
        return .none
    }

    private static func extractRequestId(from statusText: String) -> String? {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let marker = "requestId:"
        guard let range = statusText.range(of: marker) else { return nil }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let suffix = statusText[range.upperBound...]
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let trimmed = suffix.trimmingCharacters(in: .whitespacesAndNewlines)
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let end = trimmed.firstIndex(where: { ch in
            ch == ")" || ch.isWhitespace || ch == "," || ch == ";"
        }) ?? trimmed.endIndex
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let id = String(trimmed[..<end]).trimmingCharacters(in: .whitespacesAndNewlines)
        return id.isEmpty ? nil : id
    }
}
