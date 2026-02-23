/*
 * AUTO ANNOTATION
 * File: apps/macos/Sources/OpenClaw/CronSettings+Helpers.swift
 * Purpose: File in apps area for project orchestration/configuration/data.
 * Module area: Native apps (macOS / iOS / Android / shared app assets)
 * System effect: Change can influence native apps (macos / ios / android / shared app assets) and therefore affects build/runtime behavior indirectly.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import SwiftUI

extension CronSettings {
    var selectedJob: CronJob? {
        guard let id = self.store.selectedJobId else { return nil }
        return self.store.jobs.first(where: { $0.id == id })
    }

    func statusTint(_ status: String?) -> Color {
        switch (status ?? "").lowercased() {
        case "ok": .green
        case "error": .red
        case "skipped": .orange
        default: .secondary
        }
    }

    func scheduleSummary(_ schedule: CronSchedule) -> String {
        switch schedule {
        case let .at(at):
            if let date = CronSchedule.parseAtDate(at) {
                return "at \(date.formatted(date: .abbreviated, time: .standard))"
            }
            return "at \(at)"
        case let .every(everyMs, _):
            return "every \(self.formatDuration(ms: everyMs))"
        case let .cron(expr, tz):
            if let tz, !tz.isEmpty { return "cron \(expr) (\(tz))" }
            return "cron \(expr)"
        }
    }

    func formatDuration(ms: Int) -> String {
        if ms < 1000 { return "\(ms)ms" }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let s = Double(ms) / 1000.0
        if s < 60 { return "\(Int(round(s)))s" }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let m = s / 60.0
        if m < 60 { return "\(Int(round(m)))m" }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let h = m / 60.0
        if h < 48 { return "\(Int(round(h)))h" }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let d = h / 24.0
        return "\(Int(round(d)))d"
    }

    func nextRunLabel(_ date: Date, now: Date = .init()) -> String {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let delta = date.timeIntervalSince(now)
        if delta <= 0 { return "due" }
        if delta < 60 { return "in <1m" }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let minutes = Int(round(delta / 60))
        if minutes < 60 { return "in \(minutes)m" }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let hours = Int(round(Double(minutes) / 60))
        if hours < 48 { return "in \(hours)h" }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let days = Int(round(Double(hours) / 24))
        return "in \(days)d"
    }
}
