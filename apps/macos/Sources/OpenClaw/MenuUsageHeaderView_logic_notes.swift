/*
 * AUTO ANNOTATION
 * File: apps/macos/Sources/OpenClaw/MenuUsageHeaderView.swift
 * Purpose: File in apps area for project orchestration/configuration/data.
 * Module area: Native apps (macOS / iOS / Android / shared app assets)
 * System effect: Change can influence native apps (macos / ios / android / shared app assets) and therefore affects build/runtime behavior indirectly.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import SwiftUI

struct MenuUsageHeaderView: View {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    let count: Int

    private let paddingTop: CGFloat = 8
    private let paddingBottom: CGFloat = 6
    private let paddingTrailing: CGFloat = 10
    private let paddingLeading: CGFloat = 20

    var body: some View {
        VStack(alignment: .leading, spacing: 6) {
            HStack(alignment: .firstTextBaseline) {
                Text("Usage")
                    .font(.caption.weight(.semibold))
                    .foregroundStyle(.secondary)
                Spacer(minLength: 10)
                Text(self.subtitle)
                    .font(.caption)
                    .foregroundStyle(.secondary)
            }
        }
        .padding(.top, self.paddingTop)
        .padding(.bottom, self.paddingBottom)
        .padding(.leading, self.paddingLeading)
        .padding(.trailing, self.paddingTrailing)
        .frame(minWidth: 300, maxWidth: .infinity, alignment: .leading)
        .transaction { txn in txn.animation = nil }
    }

    private var subtitle: String {
        if self.count == 1 { return "1 provider" }
        return "\(self.count) providers"
    }
}
