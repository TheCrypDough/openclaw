/*
 * AUTO ANNOTATION
 * File: apps/shared/OpenClawKit/Sources/OpenClawKit/ShareGatewayRelaySettings.swift
 * Purpose: File in apps area for project orchestration/configuration/data.
 * Module area: Native apps (macOS / iOS / Android / shared app assets)
 * System effect: Change can influence native apps (macos / ios / android / shared app assets) and therefore affects build/runtime behavior indirectly.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import Foundation

public struct ShareGatewayRelayConfig: Codable, Sendable, Equatable {
    public let gatewayURLString: String
    public let token: String?
    public let password: String?
    public let sessionKey: String
    public let deliveryChannel: String?
    public let deliveryTo: String?

    public init(
        gatewayURLString: String,
        token: String?,
        password: String?,
        sessionKey: String,
        deliveryChannel: String? = nil,
        deliveryTo: String? = nil)
    {
        self.gatewayURLString = gatewayURLString
        self.token = token
        self.password = password
        self.sessionKey = sessionKey
        self.deliveryChannel = deliveryChannel
        self.deliveryTo = deliveryTo
    }
}

public enum ShareGatewayRelaySettings {
    private static let suiteName = "group.ai.openclaw.shared"
    private static let relayConfigKey = "share.gatewayRelay.config.v1"
    private static let lastEventKey = "share.gatewayRelay.event.v1"

    private static var defaults: UserDefaults {
        UserDefaults(suiteName: self.suiteName) ?? .standard
    }

    public static func loadConfig() -> ShareGatewayRelayConfig? {
        guard let data = self.defaults.data(forKey: self.relayConfigKey) else { return nil }
        return try? JSONDecoder().decode(ShareGatewayRelayConfig.self, from: data)
    }

    public static func saveConfig(_ config: ShareGatewayRelayConfig) {
        guard let data = try? JSONEncoder().encode(config) else { return }
        self.defaults.set(data, forKey: self.relayConfigKey)
    }

    public static func clearConfig() {
        self.defaults.removeObject(forKey: self.relayConfigKey)
    }

    public static func saveLastEvent(_ message: String) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let timestamp = ISO8601DateFormatter().string(from: Date())
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let payload = "[\(timestamp)] \(message)"
        self.defaults.set(payload, forKey: self.lastEventKey)
    }

    public static func loadLastEvent() -> String? {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let value = self.defaults.string(forKey: self.lastEventKey)?
            .trimmingCharacters(in: .whitespacesAndNewlines) ?? ""
        return value.isEmpty ? nil : value
    }
}
