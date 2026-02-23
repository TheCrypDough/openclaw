/*
 * AUTO ANNOTATION
 * File: apps/shared/OpenClawKit/Tests/OpenClawKitTests/ChatThemeTests.swift
 * Purpose: File in apps area for project orchestration/configuration/data.
 * Module area: Native apps (macOS / iOS / Android / shared app assets)
 * System effect: Change can influence native apps (macos / ios / android / shared app assets) and therefore affects build/runtime behavior indirectly.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import Foundation
import Testing
@testable import OpenClawChatUI

#if os(macOS)
import AppKit
#endif

#if os(macOS)
private func luminance(_ color: NSColor) throws -> CGFloat {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    let rgb = try #require(color.usingColorSpace(.deviceRGB))
    return 0.2126 * rgb.redComponent + 0.7152 * rgb.greenComponent + 0.0722 * rgb.blueComponent
}
#endif

@Suite struct ChatThemeTests {
    @Test func assistantBubbleResolvesForLightAndDark() throws {
        #if os(macOS)
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let lightAppearance = try #require(NSAppearance(named: .aqua))
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let darkAppearance = try #require(NSAppearance(named: .darkAqua))

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let lightResolved = OpenClawChatTheme.resolvedAssistantBubbleColor(for: lightAppearance)
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let darkResolved = OpenClawChatTheme.resolvedAssistantBubbleColor(for: darkAppearance)
        #expect(try luminance(lightResolved) > luminance(darkResolved))
        #else
        #expect(Bool(true))
        #endif
    }
}
