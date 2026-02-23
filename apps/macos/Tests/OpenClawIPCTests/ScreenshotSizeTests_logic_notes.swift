/*
 * AUTO ANNOTATION
 * File: apps/macos/Tests/OpenClawIPCTests/ScreenshotSizeTests.swift
 * Purpose: File in apps area for project orchestration/configuration/data.
 * Module area: Native apps (macOS / iOS / Android / shared app assets)
 * System effect: Change can influence native apps (macos / ios / android / shared app assets) and therefore affects build/runtime behavior indirectly.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import Foundation
import Testing
@testable import OpenClaw

@Suite
struct ScreenshotSizeTests {
    @Test
    func readPNGSizeReturnsDimensions() throws {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let pngBase64 =
            "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+WZxkAAAAASUVORK5CYII="
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let data = try #require(Data(base64Encoded: pngBase64))
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let size = ScreenshotSize.readPNGSize(data: data)
        #expect(size?.width == 1)
        #expect(size?.height == 1)
    }

    @Test
    func readPNGSizeRejectsNonPNGData() {
        #expect(ScreenshotSize.readPNGSize(data: Data("nope".utf8)) == nil)
    }
}
