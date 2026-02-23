/*
 * AUTO ANNOTATION
 * File: apps/ios/Sources/Onboarding/OnboardingStateStore.swift
 * Purpose: File in apps area for project orchestration/configuration/data.
 * Module area: Native apps (macOS / iOS / Android / shared app assets)
 * System effect: Change can influence native apps (macos / ios / android / shared app assets) and therefore affects build/runtime behavior indirectly.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import Foundation

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
enum OnboardingConnectionMode: String, CaseIterable {
    case homeNetwork = "home_network"
    case remoteDomain = "remote_domain"
    case developerLocal = "developer_local"

    var title: String {
        switch self {
        case .homeNetwork:
            "Home Network"
        case .remoteDomain:
            "Remote Domain"
        case .developerLocal:
            "Same Machine (Dev)"
        }
    }
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
enum OnboardingStateStore {
    private static let completedDefaultsKey = "onboarding.completed"
    private static let lastModeDefaultsKey = "onboarding.last_mode"
    private static let lastSuccessTimeDefaultsKey = "onboarding.last_success_time"

    @MainActor
    static func shouldPresentOnLaunch(appModel: NodeAppModel, defaults: UserDefaults = .standard) -> Bool {
        if defaults.bool(forKey: Self.completedDefaultsKey) { return false }
        // If we have a last-known connection config, don't force onboarding on launch. Auto-connect
        // should handle reconnecting, and users can always open onboarding manually if needed.
        if GatewaySettingsStore.loadLastGatewayConnection() != nil { return false }
        return appModel.gatewayServerName == nil
    }

    static func markCompleted(mode: OnboardingConnectionMode? = nil, defaults: UserDefaults = .standard) {
        defaults.set(true, forKey: Self.completedDefaultsKey)
        if let mode {
            defaults.set(mode.rawValue, forKey: Self.lastModeDefaultsKey)
        }
        defaults.set(Int(Date().timeIntervalSince1970), forKey: Self.lastSuccessTimeDefaultsKey)
    }

    static func markIncomplete(defaults: UserDefaults = .standard) {
        defaults.set(false, forKey: Self.completedDefaultsKey)
    }

    static func lastMode(defaults: UserDefaults = .standard) -> OnboardingConnectionMode? {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let raw = defaults.string(forKey: Self.lastModeDefaultsKey)?
            .trimmingCharacters(in: .whitespacesAndNewlines) ?? ""
        guard !raw.isEmpty else { return nil }
        return OnboardingConnectionMode(rawValue: raw)
    }
}
