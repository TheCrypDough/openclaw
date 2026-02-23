/*
 * AUTO ANNOTATION
 * File: apps/macos/Sources/OpenClaw/NSAttributedString+VoiceWake.swift
 * Purpose: File in apps area for project orchestration/configuration/data.
 * Module area: Native apps (macOS / iOS / Android / shared app assets)
 * System effect: Change can influence native apps (macos / ios / android / shared app assets) and therefore affects build/runtime behavior indirectly.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import Foundation

extension NSAttributedString {
    func strippingForegroundColor() -> NSAttributedString {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let mutable = NSMutableAttributedString(attributedString: self)
        mutable.removeAttribute(.foregroundColor, range: NSRange(location: 0, length: mutable.length))
        return mutable
    }
}
