/*
 * AUTO ANNOTATION
 * File: apps/macos/Tests/OpenClawIPCTests/WindowPlacementTests.swift
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
struct WindowPlacementTests {
    @Test
    func centeredFrameZeroBoundsFallsBackToOrigin() {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let frame = WindowPlacement.centeredFrame(size: NSSize(width: 120, height: 80), in: NSRect.zero)
        #expect(frame.origin == .zero)
        #expect(frame.size == NSSize(width: 120, height: 80))
    }

    @Test
    func centeredFrameClampsToBoundsAndCenters() {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let bounds = NSRect(x: 10, y: 20, width: 300, height: 200)
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let frame = WindowPlacement.centeredFrame(size: NSSize(width: 600, height: 120), in: bounds)
        #expect(frame.size.width == bounds.width)
        #expect(frame.size.height == 120)
        #expect(frame.minX == bounds.minX)
        #expect(frame.midY == bounds.midY)
    }

    @Test
    func topRightFrameZeroBoundsFallsBackToOrigin() {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let frame = WindowPlacement.topRightFrame(
            size: NSSize(width: 120, height: 80),
            padding: 12,
            in: NSRect.zero)
        #expect(frame.origin == .zero)
        #expect(frame.size == NSSize(width: 120, height: 80))
    }

    @Test
    func topRightFrameClampsToBoundsAndAppliesPadding() {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let bounds = NSRect(x: 10, y: 20, width: 300, height: 200)
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let frame = WindowPlacement.topRightFrame(
            size: NSSize(width: 400, height: 50),
            padding: 8,
            in: bounds)
        #expect(frame.size.width == bounds.width)
        #expect(frame.size.height == 50)
        #expect(frame.maxX == bounds.maxX - 8)
        #expect(frame.maxY == bounds.maxY - 8)
    }

    @Test
    func ensureOnScreenUsesFallbackWhenWindowOffscreen() {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let window = NSWindow(
            contentRect: NSRect(x: 100_000, y: 100_000, width: 200, height: 120),
            styleMask: [.borderless],
            backing: .buffered,
            defer: false)

        WindowPlacement.ensureOnScreen(
            window: window,
            defaultSize: NSSize(width: 200, height: 120),
            fallback: { _ in NSRect(x: 11, y: 22, width: 33, height: 44) })

        #expect(window.frame == NSRect(x: 11, y: 22, width: 33, height: 44))
    }

    @Test
    func ensureOnScreenDoesNotMoveVisibleWindow() {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let screen = NSScreen.main ?? NSScreen.screens.first
        #expect(screen != nil)
        guard let screen else { return }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let visible = screen.visibleFrame.insetBy(dx: 40, dy: 40)
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let window = NSWindow(
            contentRect: NSRect(x: visible.minX, y: visible.minY, width: 200, height: 120),
            styleMask: [.titled],
            backing: .buffered,
            defer: false)
        let original = window.frame

        WindowPlacement.ensureOnScreen(
            window: window,
            defaultSize: NSSize(width: 200, height: 120),
            fallback: { _ in NSRect(x: 11, y: 22, width: 33, height: 44) })

        #expect(window.frame == original)
    }
}
