/*
 * AUTO ANNOTATION
 * File: apps/macos/Tests/OpenClawIPCTests/CritterIconRendererTests.swift
 * Purpose: File in apps area for project orchestration/configuration/data.
 * Module area: Native apps (macOS / iOS / Android / shared app assets)
 * System effect: Change can influence native apps (macos / ios / android / shared app assets) and therefore affects build/runtime behavior indirectly.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import AppKit
import Testing
@testable import OpenClaw

@Suite
@MainActor
struct CritterIconRendererTests {
    @Test func makeIconRendersExpectedSize() {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let image = CritterIconRenderer.makeIcon(
            blink: 0.25,
            legWiggle: 0.5,
            earWiggle: 0.2,
            earScale: 1,
            earHoles: true,
            badge: nil)

        #expect(image.size.width == 18)
        #expect(image.size.height == 18)
        #expect(image.tiffRepresentation != nil)
    }

    @Test func makeIconRendersWithBadge() {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let image = CritterIconRenderer.makeIcon(
            blink: 0,
            legWiggle: 0,
            earWiggle: 0,
            earScale: 1,
            earHoles: false,
            badge: .init(symbolName: "terminal.fill", prominence: .primary))

        #expect(image.tiffRepresentation != nil)
    }

    @Test func critterStatusLabelExercisesHelpers() async {
        await CritterStatusLabel.exerciseForTesting()
    }
}
