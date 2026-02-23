/*
 * AUTO ANNOTATION
 * File: apps/shared/OpenClawKit/Sources/OpenClawKit/BonjourTypes.swift
 * Purpose: File in apps area for project orchestration/configuration/data.
 * Module area: Native apps (macOS / iOS / Android / shared app assets)
 * System effect: Change can influence native apps (macos / ios / android / shared app assets) and therefore affects build/runtime behavior indirectly.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import Foundation

public enum OpenClawBonjour {
    // v0: internal-only, subject to rename.
    public static let gatewayServiceType = "_openclaw-gw._tcp"
    public static let gatewayServiceDomain = "local."
    public static var wideAreaGatewayServiceDomain: String? {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let env = ProcessInfo.processInfo.environment
        return resolveWideAreaDomain(env["OPENCLAW_WIDE_AREA_DOMAIN"])
    }

    public static var gatewayServiceDomains: [String] {
        var domains = [gatewayServiceDomain]
        if let wideArea = wideAreaGatewayServiceDomain {
            domains.append(wideArea)
        }
        return domains
    }

    private static func resolveWideAreaDomain(_ raw: String?) -> String? {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let trimmed = (raw ?? "").trimmingCharacters(in: .whitespacesAndNewlines)
        if trimmed.isEmpty { return nil }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let normalized = normalizeServiceDomain(trimmed)
        return normalized == gatewayServiceDomain ? nil : normalized
    }

    public static func normalizeServiceDomain(_ raw: String?) -> String {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let trimmed = (raw ?? "").trimmingCharacters(in: .whitespacesAndNewlines)
        if trimmed.isEmpty {
            return self.gatewayServiceDomain
        }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let lower = trimmed.lowercased()
        if lower == "local" || lower == "local." {
            return self.gatewayServiceDomain
        }

        return lower.hasSuffix(".") ? lower : (lower + ".")
    }
}
