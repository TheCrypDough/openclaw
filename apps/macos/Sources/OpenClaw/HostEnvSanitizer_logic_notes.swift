/*
 * AUTO ANNOTATION
 * File: apps/macos/Sources/OpenClaw/HostEnvSanitizer.swift
 * Purpose: File in apps area for project orchestration/configuration/data.
 * Module area: Native apps (macOS / iOS / Android / shared app assets)
 * System effect: Change can influence native apps (macos / ios / android / shared app assets) and therefore affects build/runtime behavior indirectly.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import Foundation

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
enum HostEnvSanitizer {
    /// Keep in sync with src/infra/host-env-security-policy.json.
    /// Parity is validated by src/infra/host-env-security.policy-parity.test.ts.
    private static let blockedKeys: Set<String> = [
        "NODE_OPTIONS",
        "NODE_PATH",
        "PYTHONHOME",
        "PYTHONPATH",
        "PERL5LIB",
        "PERL5OPT",
        "RUBYLIB",
        "RUBYOPT",
        "BASH_ENV",
        "ENV",
        "SHELL",
        "GCONV_PATH",
        "IFS",
        "SSLKEYLOGFILE",
    ]

    private static let blockedPrefixes: [String] = [
        "DYLD_",
        "LD_",
        "BASH_FUNC_",
    ]

    private static func isBlocked(_ upperKey: String) -> Bool {
        if self.blockedKeys.contains(upperKey) { return true }
        return self.blockedPrefixes.contains(where: { upperKey.hasPrefix($0) })
    }

    static func sanitize(overrides: [String: String]?) -> [String: String] {
        var merged: [String: String] = [:]
        for (rawKey, value) in ProcessInfo.processInfo.environment {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
            let key = rawKey.trimmingCharacters(in: .whitespacesAndNewlines)
            guard !key.isEmpty else { continue }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
            let upper = key.uppercased()
            if self.isBlocked(upper) { continue }
            merged[key] = value
        }

        guard let overrides else { return merged }
        for (rawKey, value) in overrides {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
            let key = rawKey.trimmingCharacters(in: .whitespacesAndNewlines)
            guard !key.isEmpty else { continue }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
            let upper = key.uppercased()
            // PATH is part of the security boundary (command resolution + safe-bin checks). Never
            // allow request-scoped PATH overrides from agents/gateways.
            if upper == "PATH" { continue }
            if self.isBlocked(upper) { continue }
            merged[key] = value
        }
        return merged
    }
}
