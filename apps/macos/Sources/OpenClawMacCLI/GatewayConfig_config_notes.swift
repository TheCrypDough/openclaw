# AUTOPLACEHOLDER_ANNOTATION: apps/macos/Sources/OpenClawMacCLI/GatewayConfig.swift
# Purpose: File in apps area for project orchestration/configuration/data.
# Area: Native apps (macOS / iOS / Android / shared app assets)
# System effect: Change can influence native apps (macos / ios / android / shared app assets) and therefore affects build/runtime behavior indirectly.
import Foundation

struct GatewayConfig {
    var mode: String?
    var bind: String?
    var port: Int?
    var remoteUrl: String?
    var token: String?
    var password: String?
    var remoteToken: String?
    var remotePassword: String?
}

struct GatewayEndpoint {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    let url: URL
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    let token: String?
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    let password: String?
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    let mode: String
}

func loadGatewayConfig() -> GatewayConfig {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    let home = FileManager().homeDirectoryForCurrentUser
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    let candidates = [
        home.appendingPathComponent(".openclaw/openclaw.json"),
    ]
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    let url = candidates.first { FileManager().isReadableFile(atPath: $0.path) } ?? candidates[0]
    guard let data = try? Data(contentsOf: url) else { return GatewayConfig() }
    guard let json = try? JSONSerialization.jsonObject(with: data) as? [String: Any] else {
        return GatewayConfig()
    }

    var cfg = GatewayConfig()
    if let gateway = json["gateway"] as? [String: Any] {
        cfg.mode = gateway["mode"] as? String
        cfg.bind = gateway["bind"] as? String
        cfg.port = gateway["port"] as? Int ?? parseInt(gateway["port"])

        if let auth = gateway["auth"] as? [String: Any] {
            cfg.token = auth["token"] as? String
            cfg.password = auth["password"] as? String
        }
        if let remote = gateway["remote"] as? [String: Any] {
            cfg.remoteUrl = remote["url"] as? String
            cfg.remoteToken = remote["token"] as? String
            cfg.remotePassword = remote["password"] as? String
        }
    }
    return cfg
}

func parseInt(_ value: Any?) -> Int? {
    switch value {
    case let number as Int:
        number
    case let number as Double:
        Int(number)
    case let raw as String:
        Int(raw.trimmingCharacters(in: .whitespacesAndNewlines))
    default:
        nil
    }
}
