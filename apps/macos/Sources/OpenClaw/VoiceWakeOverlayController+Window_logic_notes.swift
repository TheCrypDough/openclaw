/*
 * AUTO ANNOTATION
 * File: apps/macos/Sources/OpenClaw/VoiceWakeOverlayController+Window.swift
 * Purpose: File in apps area for project orchestration/configuration/data.
 * Module area: Native apps (macOS / iOS / Android / shared app assets)
 * System effect: Change can influence native apps (macos / ios / android / shared app assets) and therefore affects build/runtime behavior indirectly.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import AppKit
import QuartzCore
import SwiftUI

extension VoiceWakeOverlayController {
    func present() {
        if !self.enableUI || ProcessInfo.processInfo.isRunningTests {
            if !self.model.isVisible {
                self.model.isVisible = true
            }
            return
        }
        self.ensureWindow()
        self.hostingView?.rootView = VoiceWakeOverlayView(controller: self)
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let target = self.targetFrame()

        guard let window else { return }
        if !self.model.isVisible {
            self.model.isVisible = true
            self.logger.log(
                level: .info,
                "overlay present windowShown textLen=\(self.model.text.count, privacy: .public)")
            // Keep the status item in “listening” mode until we explicitly dismiss the overlay.
            AppStateStore.shared.triggerVoiceEars(ttl: nil)
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
            let start = target.offsetBy(dx: 0, dy: -6)
            window.setFrame(start, display: true)
            window.alphaValue = 0
            window.orderFrontRegardless()
            NSAnimationContext.runAnimationGroup { context in
                context.duration = 0.18
                context.timingFunction = CAMediaTimingFunction(name: .easeOut)
                window.animator().setFrame(target, display: true)
                window.animator().alphaValue = 1
            }
        } else {
            self.updateWindowFrame(animate: true)
            window.orderFrontRegardless()
        }
    }

    private func ensureWindow() {
        if self.window != nil { return }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let borderPad = self.closeOverflow
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let panel = NSPanel(
            contentRect: NSRect(x: 0, y: 0, width: self.width + borderPad * 2, height: 60 + borderPad * 2),
            styleMask: [.nonactivatingPanel, .borderless],
            backing: .buffered,
            defer: false)
        panel.isOpaque = false
        panel.backgroundColor = .clear
        panel.hasShadow = false
        panel.level = Self.preferredWindowLevel
        panel.collectionBehavior = [.canJoinAllSpaces, .fullScreenAuxiliary, .transient]
        panel.hidesOnDeactivate = false
        panel.isMovable = false
        panel.isFloatingPanel = true
        panel.becomesKeyOnlyIfNeeded = true
        panel.titleVisibility = .hidden
        panel.titlebarAppearsTransparent = true

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let host = NSHostingView(rootView: VoiceWakeOverlayView(controller: self))
        host.translatesAutoresizingMaskIntoConstraints = false
        panel.contentView = host
        self.hostingView = host
        self.window = panel
    }

    /// Reassert window ordering when other panels are shown.
    func bringToFrontIfVisible() {
        guard self.model.isVisible, let window = self.window else { return }
        window.level = Self.preferredWindowLevel
        window.orderFrontRegardless()
    }

    func targetFrame() -> NSRect {
        guard let screen = NSScreen.main else { return .zero }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let height = self.measuredHeight()
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let size = NSSize(width: self.width + self.closeOverflow * 2, height: height + self.closeOverflow * 2)
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let visible = screen.visibleFrame
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let origin = CGPoint(
            x: visible.maxX - size.width,
            y: visible.maxY - size.height)
        return NSRect(origin: origin, size: size)
    }

    func updateWindowFrame(animate: Bool = false) {
        guard let window else { return }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let frame = self.targetFrame()
        if animate {
            NSAnimationContext.runAnimationGroup { context in
                context.duration = 0.12
                context.timingFunction = CAMediaTimingFunction(name: .easeOut)
                window.animator().setFrame(frame, display: true)
            }
        } else {
            window.setFrame(frame, display: true)
        }
    }

    func measuredHeight() -> CGFloat {
        let attributed = self.model.attributed.length > 0 ? self.model.attributed : self
            .makeAttributed(from: self.model.text)
        let maxWidth = self.width - (self.padding * 2) - self.spacing - self.buttonWidth

        let textInset = NSSize(width: 2, height: 6)
        let lineFragmentPadding: CGFloat = 0
        let containerWidth = max(1, maxWidth - (textInset.width * 2) - (lineFragmentPadding * 2))

        let storage = NSTextStorage(attributedString: attributed)
        let container = NSTextContainer(containerSize: CGSize(width: containerWidth, height: .greatestFiniteMagnitude))
        container.lineFragmentPadding = lineFragmentPadding
        container.lineBreakMode = .byWordWrapping

        let layout = NSLayoutManager()
        layout.addTextContainer(container)
        storage.addLayoutManager(layout)

        _ = layout.glyphRange(for: container)
        let used = layout.usedRect(for: container)

        let contentHeight = ceil(used.height + (textInset.height * 2))
        let total = contentHeight + self.verticalPadding * 2
        self.model.isOverflowing = total > self.maxHeight
        return max(self.minHeight, min(total, self.maxHeight))
    }

    func dismissTargetFrame(for frame: NSRect, reason: DismissReason, outcome: SendOutcome) -> NSRect? {
        switch (reason, outcome) {
        case (.empty, _):
            let scale: CGFloat = 0.95
            let newSize = NSSize(width: frame.size.width * scale, height: frame.size.height * scale)
            let dx = (frame.size.width - newSize.width) / 2
            let dy = (frame.size.height - newSize.height) / 2
            return NSRect(x: frame.origin.x + dx, y: frame.origin.y + dy, width: newSize.width, height: newSize.height)
        case (.explicit, .sent):
            return frame.offsetBy(dx: 8, dy: 6)
        default:
            return frame
        }
    }
}
