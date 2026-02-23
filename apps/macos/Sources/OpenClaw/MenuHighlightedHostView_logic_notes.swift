/*
 * AUTO ANNOTATION
 * File: apps/macos/Sources/OpenClaw/MenuHighlightedHostView.swift
 * Purpose: File in apps area for project orchestration/configuration/data.
 * Module area: Native apps (macOS / iOS / Android / shared app assets)
 * System effect: Change can influence native apps (macos / ios / android / shared app assets) and therefore affects build/runtime behavior indirectly.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import AppKit
import SwiftUI

final class HighlightedMenuItemHostView: NSView {
    private var baseView: AnyView
    private let hosting: NSHostingView<AnyView>
    private var targetWidth: CGFloat
    private var tracking: NSTrackingArea?
    private var hovered = false {
        didSet { self.updateHighlight() }
    }

    init(rootView: AnyView, width: CGFloat) {
        self.baseView = rootView
        self.hosting = NSHostingView(rootView: AnyView(rootView.environment(\.menuItemHighlighted, false)))
        self.targetWidth = max(1, width)
        super.init(frame: .zero)

        self.addSubview(self.hosting)
        self.hosting.autoresizingMask = [.width, .height]
        self.updateSizing()
    }

    @available(*, unavailable)
    required init?(coder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }

    override var intrinsicContentSize: NSSize {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let size = self.hosting.fittingSize
        return NSSize(width: self.targetWidth, height: size.height)
    }

    override func updateTrackingAreas() {
        super.updateTrackingAreas()
        if let tracking {
            self.removeTrackingArea(tracking)
        }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let options: NSTrackingArea.Options = [
            .mouseEnteredAndExited,
            .activeAlways,
            .inVisibleRect,
        ]
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let area = NSTrackingArea(rect: self.bounds, options: options, owner: self, userInfo: nil)
        self.addTrackingArea(area)
        self.tracking = area
    }

    override func mouseEntered(with event: NSEvent) {
        _ = event
        self.hovered = true
    }

    override func mouseExited(with event: NSEvent) {
        _ = event
        self.hovered = false
    }

    override func layout() {
        super.layout()
        self.hosting.frame = self.bounds
    }

    override func draw(_ dirtyRect: NSRect) {
        if self.hovered {
            NSColor.selectedContentBackgroundColor.setFill()
            self.bounds.fill()
        }
        super.draw(dirtyRect)
    }

    func update(rootView: AnyView, width: CGFloat) {
        self.baseView = rootView
        self.targetWidth = max(1, width)
        self.updateHighlight()
    }

    private func updateHighlight() {
        self.hosting.rootView = AnyView(self.baseView.environment(\.menuItemHighlighted, self.hovered))
        self.updateSizing()
        self.needsDisplay = true
    }

    private func updateSizing() {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let width = max(1, self.targetWidth)
        self.hosting.frame.size.width = width
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let size = self.hosting.fittingSize
        self.frame = NSRect(origin: .zero, size: NSSize(width: width, height: size.height))
        self.invalidateIntrinsicContentSize()
    }
}

struct MenuHostedHighlightedItem: NSViewRepresentable {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    let width: CGFloat
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    let rootView: AnyView

    func makeNSView(context _: Context) -> HighlightedMenuItemHostView {
        HighlightedMenuItemHostView(rootView: self.rootView, width: self.width)
    }

    func updateNSView(_ nsView: HighlightedMenuItemHostView, context _: Context) {
        nsView.update(rootView: self.rootView, width: self.width)
    }
}
