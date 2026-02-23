/*
 * AUTO ANNOTATION
 * File: apps/ios/Sources/Gateway/GatewaySetupCode.swift
 * Purpose: File in apps area for project orchestration/configuration/data.
 * Module area: Native apps (macOS / iOS / Android / shared app assets)
 * System effect: Change can influence native apps (macos / ios / android / shared app assets) and therefore affects build/runtime behavior indirectly.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import Foundation

struct GatewaySetupPayload: Codable {
    var url: String?
    var host: String?
    var port: Int?
    var tls: Bool?
    var token: String?
    var password: String?
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
enum GatewaySetupCode {
    static func decode(raw: String) -> GatewaySetupPayload? {
        if let payload = decodeFromJSON(raw) {
            return payload
        }
        if let decoded = decodeBase64Payload(raw),
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
           let payload = decodeFromJSON(decoded)
        {
            return payload
        }
        return nil
    }

    private static func decodeFromJSON(_ json: String) -> GatewaySetupPayload? {
        guard let data = json.data(using: .utf8) else { return nil }
        return try? JSONDecoder().decode(GatewaySetupPayload.self, from: data)
    }

    private static func decodeBase64Payload(_ raw: String) -> String? {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let trimmed = raw.trimmingCharacters(in: .whitespacesAndNewlines)
        guard !trimmed.isEmpty else { return nil }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let normalized = trimmed
            .replacingOccurrences(of: "-", with: "+")
            .replacingOccurrences(of: "_", with: "/")
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let padding = normalized.count % 4
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let padded = padding == 0 ? normalized : normalized + String(repeating: "=", count: 4 - padding)
        guard let data = Data(base64Encoded: padded) else { return nil }
        return String(data: data, encoding: .utf8)
    }
}

