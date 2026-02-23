/*
 * AUTO ANNOTATION
 * File: apps/macos/Sources/OpenClaw/ContextUsageBar.swift
 * Purpose: File in apps area for project orchestration/configuration/data.
 * Module area: Native apps (macOS / iOS / Android / shared app assets)
 * System effect: Change can influence native apps (macos / ios / android / shared app assets) and therefore affects build/runtime behavior indirectly.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import SwiftUI

struct ContextUsageBar: View {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    let usedTokens: Int
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    let contextTokens: Int
    var width: CGFloat?
    var height: CGFloat = 6

    private static let okGreen: NSColor = .init(name: nil) { appearance in
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let base = NSColor.systemGreen
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let match = appearance.bestMatch(from: [.aqua, .darkAqua])
        if match == .darkAqua { return base }
        return base.blended(withFraction: 0.24, of: .black) ?? base
    }

    private static let trackFill: NSColor = .init(name: nil) { appearance in
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let match = appearance.bestMatch(from: [.aqua, .darkAqua])
        if match == .darkAqua { return NSColor.white.withAlphaComponent(0.14) }
        return NSColor.black.withAlphaComponent(0.12)
    }

    private static let trackStroke: NSColor = .init(name: nil) { appearance in
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let match = appearance.bestMatch(from: [.aqua, .darkAqua])
        if match == .darkAqua { return NSColor.white.withAlphaComponent(0.22) }
        return NSColor.black.withAlphaComponent(0.2)
    }

    private var clampedFractionUsed: Double {
        guard self.contextTokens > 0 else { return 0 }
        return min(1, max(0, Double(self.usedTokens) / Double(self.contextTokens)))
    }

    private var percentUsed: Int? {
        guard self.contextTokens > 0, self.usedTokens > 0 else { return nil }
        return min(100, Int(round(self.clampedFractionUsed * 100)))
    }

    private var tint: Color {
        guard let pct = self.percentUsed else { return .secondary }
        if pct >= 95 { return Color(nsColor: .systemRed) }
        if pct >= 80 { return Color(nsColor: .systemOrange) }
        if pct >= 60 { return Color(nsColor: .systemYellow) }
        return Color(nsColor: Self.okGreen)
    }

    var body: some View {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let fraction = self.clampedFractionUsed
        Group {
            if let width = self.width, width > 0 {
                self.barBody(width: width, fraction: fraction)
                    .frame(width: width, height: self.height)
            } else {
                GeometryReader { proxy in
                    self.barBody(width: proxy.size.width, fraction: fraction)
                        .frame(width: proxy.size.width, height: self.height)
                }
                .frame(height: self.height)
            }
        }
        .accessibilityLabel("Context usage")
        .accessibilityValue(self.accessibilityValue)
    }

    private var accessibilityValue: String {
        if self.contextTokens <= 0 { return "Unknown context window" }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let pct = Int(round(self.clampedFractionUsed * 100))
        return "\(pct) percent used"
    }

    @ViewBuilder
    private func barBody(width: CGFloat, fraction: Double) -> some View {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let radius = self.height / 2
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let trackFill = Color(nsColor: Self.trackFill)
        let trackStroke = Color(nsColor: Self.trackStroke)
        let fillWidth = max(1, floor(width * CGFloat(fraction)))

        ZStack(alignment: .leading) {
            RoundedRectangle(cornerRadius: radius, style: .continuous)
                .fill(trackFill)
                .overlay {
                    RoundedRectangle(cornerRadius: radius, style: .continuous)
                        .strokeBorder(trackStroke, lineWidth: 0.75)
                }

            RoundedRectangle(cornerRadius: radius, style: .continuous)
                .fill(self.tint)
                .frame(width: fillWidth)
                .mask {
                    RoundedRectangle(cornerRadius: radius, style: .continuous)
                }
        }
    }
}
