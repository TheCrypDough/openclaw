/*
 * AUTO ANNOTATION
 * File: apps/macos/Sources/OpenClaw/VoiceWakeOverlayTextViews.swift
 * Purpose: File in apps area for project orchestration/configuration/data.
 * Module area: Native apps (macOS / iOS / Android / shared app assets)
 * System effect: Change can influence native apps (macos / ios / android / shared app assets) and therefore affects build/runtime behavior indirectly.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import AppKit
import SwiftUI

struct TranscriptTextView: NSViewRepresentable {
    @Binding var text: String
    var attributed: NSAttributedString
    var isFinal: Bool
    var isOverflowing: Bool
    var onBeginEditing: () -> Void
    var onEscape: () -> Void
    var onEndEditing: () -> Void
    var onSend: () -> Void

    func makeCoordinator() -> Coordinator {
        Coordinator(self)
    }

    func makeNSView(context: Context) -> NSScrollView {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let textView = TranscriptNSTextView()
        textView.delegate = context.coordinator
        textView.drawsBackground = false
        textView.isRichText = true
        textView.isAutomaticQuoteSubstitutionEnabled = false
        textView.isAutomaticTextReplacementEnabled = false
        textView.font = .systemFont(ofSize: 13, weight: .regular)
        textView.textContainer?.lineBreakMode = .byWordWrapping
        textView.textContainer?.lineFragmentPadding = 0
        textView.textContainerInset = NSSize(width: 2, height: 6)

        textView.minSize = .zero
        textView.maxSize = NSSize(width: CGFloat.greatestFiniteMagnitude, height: CGFloat.greatestFiniteMagnitude)
        textView.isHorizontallyResizable = false
        textView.isVerticallyResizable = true
        textView.autoresizingMask = [.width]

        textView.textContainer?.containerSize = NSSize(width: 0, height: CGFloat.greatestFiniteMagnitude)
        textView.textContainer?.widthTracksTextView = true

        textView.textStorage?.setAttributedString(self.attributed)
        textView.typingAttributes = [
            .foregroundColor: NSColor.labelColor,
            .font: NSFont.systemFont(ofSize: 13, weight: .regular),
        ]
        textView.focusRingType = .none
        textView.onSend = { [weak textView] in
            textView?.window?.makeFirstResponder(nil)
            self.onSend()
        }
        textView.onBeginEditing = self.onBeginEditing
        textView.onEscape = self.onEscape
        textView.onEndEditing = self.onEndEditing

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let scroll = NSScrollView()
        scroll.drawsBackground = false
        scroll.borderType = .noBorder
        scroll.hasVerticalScroller = true
        scroll.autohidesScrollers = true
        scroll.scrollerStyle = .overlay
        scroll.hasHorizontalScroller = false
        scroll.documentView = textView
        return scroll
    }

    func updateNSView(_ scrollView: NSScrollView, context: Context) {
        guard let textView = scrollView.documentView as? TranscriptNSTextView else { return }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let isEditing = scrollView.window?.firstResponder == textView
        if isEditing {
            return
        }

        if !textView.attributedString().isEqual(to: self.attributed) {
            context.coordinator.isProgrammaticUpdate = true
            defer { context.coordinator.isProgrammaticUpdate = false }
            textView.textStorage?.setAttributedString(self.attributed)
        }
    }

    final class Coordinator: NSObject, NSTextViewDelegate {
        var parent: TranscriptTextView
        var isProgrammaticUpdate = false

        init(_ parent: TranscriptTextView) {
            self.parent = parent
        }

        func textDidBeginEditing(_ notification: Notification) {
            self.parent.onBeginEditing()
        }

        func textDidEndEditing(_ notification: Notification) {
            self.parent.onEndEditing()
        }

        func textDidChange(_ notification: Notification) {
            guard !self.isProgrammaticUpdate else { return }
            guard let view = notification.object as? NSTextView else { return }
            guard view.window?.firstResponder === view else { return }
            self.parent.text = view.string
        }
    }
}

// MARK: - Vibrant display label

struct VibrantLabelView: NSViewRepresentable {
    var attributed: NSAttributedString
    var onTap: () -> Void

    func makeNSView(context: Context) -> NSView {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let label = NSTextField(labelWithAttributedString: self.attributed)
        label.isEditable = false
        label.isBordered = false
        label.drawsBackground = false
        label.lineBreakMode = .byWordWrapping
        label.maximumNumberOfLines = 0
        label.usesSingleLineMode = false
        label.cell?.wraps = true
        label.cell?.isScrollable = false
        label.setContentHuggingPriority(.defaultLow, for: .horizontal)
        label.setContentCompressionResistancePriority(.defaultLow, for: .horizontal)
        label.setContentHuggingPriority(.required, for: .vertical)
        label.setContentCompressionResistancePriority(.required, for: .vertical)
        label.textColor = .labelColor

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let container = ClickCatcher(onTap: onTap)
        container.addSubview(label)

        label.translatesAutoresizingMaskIntoConstraints = false
        NSLayoutConstraint.activate([
            label.leadingAnchor.constraint(equalTo: container.leadingAnchor),
            label.trailingAnchor.constraint(equalTo: container.trailingAnchor),
            label.topAnchor.constraint(equalTo: container.topAnchor),
            label.bottomAnchor.constraint(equalTo: container.bottomAnchor),
        ])
        return container
    }

    func updateNSView(_ nsView: NSView, context: Context) {
        guard let container = nsView as? ClickCatcher,
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
              let label = container.subviews.first as? NSTextField else { return }
        label.attributedStringValue = self.attributed.strippingForegroundColor()
        label.textColor = .labelColor
    }
}

private final class ClickCatcher: NSView {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    let onTap: () -> Void
    init(onTap: @escaping () -> Void) {
        self.onTap = onTap
        super.init(frame: .zero)
    }

    @available(*, unavailable)
    required init?(coder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }

    override func mouseDown(with event: NSEvent) {
        super.mouseDown(with: event)
        self.onTap()
    }
}

private final class TranscriptNSTextView: NSTextView {
    var onSend: (() -> Void)?
    var onBeginEditing: (() -> Void)?
    var onEndEditing: (() -> Void)?
    var onEscape: (() -> Void)?

    override func becomeFirstResponder() -> Bool {
        self.onBeginEditing?()
        return super.becomeFirstResponder()
    }

    override func resignFirstResponder() -> Bool {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let result = super.resignFirstResponder()
        self.onEndEditing?()
        return result
    }

    override func keyDown(with event: NSEvent) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let isReturn = event.keyCode == 36
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let isEscape = event.keyCode == 53
        if isEscape {
            self.onEscape?()
            return
        }
        if isReturn, event.modifierFlags.contains(.command) {
            self.onSend?()
            return
        }
        if isReturn {
            if event.modifierFlags.contains(.shift) {
                super.insertNewline(nil)
                return
            }
            self.onSend?()
            return
        }
        super.keyDown(with: event)
    }
}
