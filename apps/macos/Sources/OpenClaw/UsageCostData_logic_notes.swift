/*
 * AUTO ANNOTATION
 * File: apps/macos/Sources/OpenClaw/UsageCostData.swift
 * Purpose: File in apps area for project orchestration/configuration/data.
 * Module area: Native apps (macOS / iOS / Android / shared app assets)
 * System effect: Change can influence native apps (macos / ios / android / shared app assets) and therefore affects build/runtime behavior indirectly.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import Foundation

struct GatewayCostUsageTotals: Codable {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    let input: Int
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    let output: Int
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    let cacheRead: Int
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    let cacheWrite: Int
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    let totalTokens: Int
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    let totalCost: Double
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    let missingCostEntries: Int
}

struct GatewayCostUsageDay: Codable {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    let date: String
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    let input: Int
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    let output: Int
    let cacheRead: Int
    let cacheWrite: Int
    let totalTokens: Int
    let totalCost: Double
    let missingCostEntries: Int
}

struct GatewayCostUsageSummary: Codable {
    let updatedAt: Double
    let days: Int
    let daily: [GatewayCostUsageDay]
    let totals: GatewayCostUsageTotals
}

enum CostUsageFormatting {
    static func formatUsd(_ value: Double?) -> String? {
        guard let value, value.isFinite else { return nil }
        if value >= 1 { return String(format: "$%.2f", value) }
        if value >= 0.01 { return String(format: "$%.2f", value) }
        return String(format: "$%.4f", value)
    }

    static func formatTokenCount(_ value: Int?) -> String? {
        guard let value else { return nil }
        let safe = max(0, value)
        if safe >= 1_000_000 { return String(format: "%.1fm", Double(safe) / 1_000_000.0) }
        if safe >= 1000 { return safe >= 10000
            ? String(format: "%.0fk", Double(safe) / 1000.0)
            : String(format: "%.1fk", Double(safe) / 1000.0)
        }
        return String(safe)
    }
}

@MainActor
enum CostUsageLoader {
    static func loadSummary() async throws -> GatewayCostUsageSummary {
        let data = try await ControlChannel.shared.request(
            method: "usage.cost",
            params: nil,
            timeoutMs: 7000)
        return try JSONDecoder().decode(GatewayCostUsageSummary.self, from: data)
    }
}
