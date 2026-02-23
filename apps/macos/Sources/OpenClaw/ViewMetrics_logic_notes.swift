/*
 * AUTO ANNOTATION
 * File: apps/macos/Sources/OpenClaw/ViewMetrics.swift
 * Purpose: File in apps area for project orchestration/configuration/data.
 * Module area: Native apps (macOS / iOS / Android / shared app assets)
 * System effect: Change can influence native apps (macos / ios / android / shared app assets) and therefore affects build/runtime behavior indirectly.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import SwiftUI

private struct ViewWidthPreferenceKey: PreferenceKey {
    static let defaultValue: CGFloat = 0

    static func reduce(value: inout CGFloat, nextValue: () -> CGFloat) {
        value = max(value, nextValue())
    }
}

extension View {
    func onWidthChange(_ onChange: @escaping (CGFloat) -> Void) -> some View {
        self.background(
            GeometryReader { proxy in
                Color.clear.preference(key: ViewWidthPreferenceKey.self, value: proxy.size.width)
            })
            .onPreferenceChange(ViewWidthPreferenceKey.self, perform: onChange)
    }
}

#if DEBUG
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
enum ViewMetricsTesting {
    static func reduceWidth(current: CGFloat, next: CGFloat) -> CGFloat {
        var value = current
        ViewWidthPreferenceKey.reduce(value: &value, nextValue: { next })
        return value
    }
}
#endif
