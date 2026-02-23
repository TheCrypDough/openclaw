/*
 * AUTO ANNOTATION
 * File: apps/macos/Sources/OpenClaw/SessionMenuLabelView.swift
 * Purpose: File in apps area for project orchestration/configuration/data.
 * Module area: Native apps (macOS / iOS / Android / shared app assets)
 * System effect: Change can influence native apps (macos / ios / android / shared app assets) and therefore affects build/runtime behavior indirectly.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import SwiftUI

extension EnvironmentValues {
    @Entry var menuItemHighlighted: Bool = false
}

struct SessionMenuLabelView: View {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    let row: SessionRow
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    let width: CGFloat
    @Environment(\.menuItemHighlighted) private var isHighlighted
    private let paddingLeading: CGFloat = 22
    private let paddingTrailing: CGFloat = 14
    private let barHeight: CGFloat = 6

    private var primaryTextColor: Color {
        self.isHighlighted ? Color(nsColor: .selectedMenuItemTextColor) : .primary
    }

    private var secondaryTextColor: Color {
        self.isHighlighted ? Color(nsColor: .selectedMenuItemTextColor).opacity(0.85) : .secondary
    }

    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            ContextUsageBar(
                usedTokens: self.row.tokens.total,
                contextTokens: self.row.tokens.contextTokens,
                width: max(1, self.width - (self.paddingLeading + self.paddingTrailing)),
                height: self.barHeight)

            HStack(alignment: .firstTextBaseline, spacing: 2) {
                Text(self.row.label)
                    .font(.caption.weight(self.row.key == "main" ? .semibold : .regular))
                    .foregroundStyle(self.primaryTextColor)
                    .lineLimit(1)
                    .truncationMode(.middle)
                    .layoutPriority(1)

                Spacer(minLength: 4)

                Text("\(self.row.tokens.contextSummaryShort) · \(self.row.ageText)")
                    .font(.caption.monospacedDigit())
                    .foregroundStyle(self.secondaryTextColor)
                    .lineLimit(1)
                    .fixedSize(horizontal: true, vertical: false)
                    .layoutPriority(2)

                Image(systemName: "chevron.right")
                    .font(.caption.weight(.semibold))
                    .foregroundStyle(self.secondaryTextColor)
                    .padding(.leading, 2)
            }
        }
        .padding(.vertical, 10)
        .padding(.leading, self.paddingLeading)
        .padding(.trailing, self.paddingTrailing)
    }
}
