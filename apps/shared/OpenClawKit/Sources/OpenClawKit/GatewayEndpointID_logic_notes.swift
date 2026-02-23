/*
 * AUTO ANNOTATION
 * File: apps/shared/OpenClawKit/Sources/OpenClawKit/GatewayEndpointID.swift
 * Purpose: File in apps area for project orchestration/configuration/data.
 * Module area: Native apps (macOS / iOS / Android / shared app assets)
 * System effect: Change can influence native apps (macos / ios / android / shared app assets) and therefore affects build/runtime behavior indirectly.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import Foundation
import Network

public enum GatewayEndpointID {
    public static func stableID(_ endpoint: NWEndpoint) -> String {
        switch endpoint {
        case let .service(name, type, domain, _):
            // Keep stable across encoded/decoded differences (e.g. \032 for spaces).
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
            let normalizedName = Self.normalizeServiceNameForID(name)
            return "\(type)|\(domain)|\(normalizedName)"
        default:
            return String(describing: endpoint)
        }
    }

    public static func prettyDescription(_ endpoint: NWEndpoint) -> String {
        BonjourEscapes.decode(String(describing: endpoint))
    }

    private static func normalizeServiceNameForID(_ rawName: String) -> String {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let decoded = BonjourEscapes.decode(rawName)
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let normalized = decoded.split(whereSeparator: \.isWhitespace).joined(separator: " ")
        return normalized.trimmingCharacters(in: .whitespacesAndNewlines)
    }
}
