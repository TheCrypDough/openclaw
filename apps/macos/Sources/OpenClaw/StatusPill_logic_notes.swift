/*
 * AUTO ANNOTATION
 * File: apps/macos/Sources/OpenClaw/StatusPill.swift
 * Purpose: File in apps area for project orchestration/configuration/data.
 * Module area: Native apps (macOS / iOS / Android / shared app assets)
 * System effect: Change can influence native apps (macos / ios / android / shared app assets) and therefore affects build/runtime behavior indirectly.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import SwiftUI

struct StatusPill: View {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    let text: String
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    let tint: Color

    var body: some View {
        Text(self.text)
            .font(.caption2.weight(.semibold))
            .padding(.horizontal, 7)
            .padding(.vertical, 3)
            .foregroundStyle(self.tint == .secondary ? .secondary : self.tint)
            .background((self.tint == .secondary ? Color.secondary : self.tint).opacity(0.12))
            .clipShape(Capsule())
    }
}
