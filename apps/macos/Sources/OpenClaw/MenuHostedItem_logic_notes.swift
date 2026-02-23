/*
 * AUTO ANNOTATION
 * File: apps/macos/Sources/OpenClaw/MenuHostedItem.swift
 * Purpose: File in apps area for project orchestration/configuration/data.
 * Module area: Native apps (macOS / iOS / Android / shared app assets)
 * System effect: Change can influence native apps (macos / ios / android / shared app assets) and therefore affects build/runtime behavior indirectly.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import AppKit
import SwiftUI

/// Hosts arbitrary SwiftUI content as an AppKit view so it can be embedded in a native `NSMenuItem.view`.
///
/// SwiftUI `MenuBarExtraStyle.menu` aggressively simplifies many view hierarchies into a title + image.
/// Wrapping the content in an `NSViewRepresentable` forces AppKit-backed menu item rendering.
struct MenuHostedItem: NSViewRepresentable {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    let width: CGFloat
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    let rootView: AnyView

    func makeNSView(context _: Context) -> NSHostingView<AnyView> {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let hosting = NSHostingView(rootView: self.rootView)
        self.applySizing(to: hosting)
        return hosting
    }

    func updateNSView(_ nsView: NSHostingView<AnyView>, context _: Context) {
        nsView.rootView = self.rootView
        self.applySizing(to: nsView)
    }

    private func applySizing(to hosting: NSHostingView<AnyView>) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let width = max(1, self.width)
        hosting.frame.size.width = width
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let fitting = hosting.fittingSize
        hosting.frame = NSRect(origin: .zero, size: NSSize(width: width, height: fitting.height))
    }
}
