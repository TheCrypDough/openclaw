/*
 * AUTO ANNOTATION
 * File: apps/macos/Sources/OpenClaw/UsageData.swift
 * Purpose: File in apps area for project orchestration/configuration/data.
 * Module area: Native apps (macOS / iOS / Android / shared app assets)
 * System effect: Change can influence native apps (macos / ios / android / shared app assets) and therefore affects build/runtime behavior indirectly.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import Foundation

struct GatewayUsageWindow: Codable {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    let label: String
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    let usedPercent: Double
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    let resetAt: Double?
}

struct GatewayUsageProvider: Codable {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    let provider: String
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    let displayName: String
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    let windows: [GatewayUsageWindow]
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    let plan: String?
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    let error: String?
}

struct GatewayUsageSummary: Codable {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    let updatedAt: Double
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    let providers: [GatewayUsageProvider]
}

struct UsageRow: Identifiable {
    let id: String
    let providerId: String
    let displayName: String
    let plan: String?
    let windowLabel: String?
    let usedPercent: Double?
    let resetAt: Date?
    let error: String?

    var hasError: Bool {
        if let error, !error.isEmpty { return true }
        return false
    }

    var titleText: String {
        if let plan, !plan.isEmpty { return "\(self.displayName) (\(plan))" }
        return self.displayName
    }

    var remainingPercent: Int? {
        guard let usedPercent, usedPercent.isFinite else { return nil }
        return max(0, min(100, Int(round(100 - usedPercent))))
    }

    func detailText(now: Date = .init()) -> String {
        guard let remaining = self.remainingPercent else { return "No data" }
        var parts = ["\(remaining)% left"]
        if let windowLabel, !windowLabel.isEmpty { parts.append(windowLabel) }
        if let resetAt {
            let reset = UsageRow.formatResetRemaining(target: resetAt, now: now)
            if let reset { parts.append("⏱\(reset)") }
        }
        return parts.joined(separator: " · ")
    }

    private static func formatResetRemaining(target: Date, now: Date) -> String? {
        let diff = target.timeIntervalSince(now)
        if diff <= 0 { return "now" }
        let minutes = Int(floor(diff / 60))
        if minutes < 60 { return "\(minutes)m" }
        let hours = minutes / 60
        let mins = minutes % 60
        if hours < 24 { return mins > 0 ? "\(hours)h \(mins)m" : "\(hours)h" }
        let days = hours / 24
        if days < 7 { return "\(days)d \(hours % 24)h" }
        let formatter = DateFormatter()
        formatter.dateFormat = "MMM d"
        return formatter.string(from: target)
    }
}

extension GatewayUsageSummary {
    func primaryRows() -> [UsageRow] {
        self.providers.compactMap { provider in
            guard let window = provider.windows.max(by: { $0.usedPercent < $1.usedPercent }) else {
                return nil
            }

            return UsageRow(
                id: "\(provider.provider)-\(window.label)",
                providerId: provider.provider,
                displayName: provider.displayName,
                plan: provider.plan,
                windowLabel: window.label,
                usedPercent: window.usedPercent,
                resetAt: window.resetAt.map { Date(timeIntervalSince1970: $0 / 1000) },
                error: nil)
        }
    }
}

@MainActor
enum UsageLoader {
    static func loadSummary() async throws -> GatewayUsageSummary {
        let data = try await ControlChannel.shared.request(
            method: "usage.status",
            params: nil,
            timeoutMs: 5000)
        return try JSONDecoder().decode(GatewayUsageSummary.self, from: data)
    }
}
