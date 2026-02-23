# AUTOPLACEHOLDER_ANNOTATION: apps/ios/Sources/Gateway/GatewayConnectConfig.swift
# Purpose: File in apps area for project orchestration/configuration/data.
# Area: Native apps (macOS / iOS / Android / shared app assets)
# System effect: Change can influence native apps (macos / ios / android / shared app assets) and therefore affects build/runtime behavior indirectly.
import Foundation
import OpenClawKit

/// Single source of truth for "how we connect" to the current gateway.
///
/// The iOS app maintains two WebSocket sessions to the same gateway:
/// - a `role=node` session for device capabilities (`node.invoke.*`)
/// - a `role=operator` session for chat/talk/config (`chat.*`, `talk.*`, etc.)
///
/// Both sessions should derive all connection inputs from this config so we
/// don't accidentally persist gateway-scoped state under different keys.
struct GatewayConnectConfig: Sendable {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    let url: URL
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    let stableID: String
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    let tls: GatewayTLSParams?
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    let token: String?
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    let password: String?
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    let nodeOptions: GatewayConnectOptions

    /// Stable, non-empty identifier used for gateway-scoped persistence keys.
    /// If the caller doesn't provide a stableID, fall back to URL identity.
    var effectiveStableID: String {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let trimmed = self.stableID.trimmingCharacters(in: .whitespacesAndNewlines)
        if trimmed.isEmpty { return self.url.absoluteString }
        return trimmed
    }
}
