/*
 * AUTO ANNOTATION
 * File: apps/macos/Sources/OpenClaw/ConnectionModeResolver.swift
 * Purpose: File in apps area for project orchestration/configuration/data.
 * Module area: Native apps (macOS / iOS / Android / shared app assets)
 * System effect: Change can influence native apps (macos / ios / android / shared app assets) and therefore affects build/runtime behavior indirectly.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import Foundation

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
enum EffectiveConnectionModeSource: Sendable, Equatable {
    case configMode
    case configRemoteURL
    case userDefaults
    case onboarding
}

struct EffectiveConnectionMode: Sendable, Equatable {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    let mode: AppState.ConnectionMode
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    let source: EffectiveConnectionModeSource
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
enum ConnectionModeResolver {
    static func resolve(
        root: [String: Any],
        defaults: UserDefaults = .standard) -> EffectiveConnectionMode
    {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let gateway = root["gateway"] as? [String: Any]
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let configModeRaw = (gateway?["mode"] as? String) ?? ""
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let configMode = configModeRaw
            .trimmingCharacters(in: .whitespacesAndNewlines)
            .lowercased()

        switch configMode {
        case "local":
            return EffectiveConnectionMode(mode: .local, source: .configMode)
        case "remote":
            return EffectiveConnectionMode(mode: .remote, source: .configMode)
        default:
            break
        }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let remoteURLRaw = ((gateway?["remote"] as? [String: Any])?["url"] as? String) ?? ""
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let remoteURL = remoteURLRaw.trimmingCharacters(in: .whitespacesAndNewlines)
        if !remoteURL.isEmpty {
            return EffectiveConnectionMode(mode: .remote, source: .configRemoteURL)
        }

        if let storedModeRaw = defaults.string(forKey: connectionModeKey) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
            let storedMode = AppState.ConnectionMode(rawValue: storedModeRaw) ?? .local
            return EffectiveConnectionMode(mode: storedMode, source: .userDefaults)
        }

        let seen = defaults.bool(forKey: "openclaw.onboardingSeen")
        return EffectiveConnectionMode(mode: seen ? .local : .unconfigured, source: .onboarding)
    }
}
