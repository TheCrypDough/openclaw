/*
 * AUTO ANNOTATION
 * File: apps/macos/Tests/OpenClawIPCTests/HoverHUDControllerTests.swift
 * Purpose: File in apps area for project orchestration/configuration/data.
 * Module area: Native apps (macOS / iOS / Android / shared app assets)
 * System effect: Change can influence native apps (macos / ios / android / shared app assets) and therefore affects build/runtime behavior indirectly.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import AppKit
import Testing
@testable import OpenClaw

@Suite(.serialized)
@MainActor
struct HoverHUDControllerTests {
    @Test func hoverHUDControllerPresentsAndDismisses() async {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let controller = HoverHUDController()
        controller.setSuppressed(false)

        controller.statusItemHoverChanged(
            inside: true,
            anchorProvider: { NSRect(x: 10, y: 10, width: 24, height: 24) })
        try? await Task.sleep(nanoseconds: 260_000_000)

        controller.panelHoverChanged(inside: true)
        controller.panelHoverChanged(inside: false)
        controller.statusItemHoverChanged(
            inside: false,
            anchorProvider: { NSRect(x: 10, y: 10, width: 24, height: 24) })

        controller.dismiss(reason: "test")
        controller.setSuppressed(true)
    }
}
