/*
 * AUTO ANNOTATION
 * File: apps/macos/Sources/OpenClaw/ScreenshotSize.swift
 * Purpose: File in apps area for project orchestration/configuration/data.
 * Module area: Native apps (macOS / iOS / Android / shared app assets)
 * System effect: Change can influence native apps (macos / ios / android / shared app assets) and therefore affects build/runtime behavior indirectly.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import Foundation
import ImageIO

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
enum ScreenshotSize {
    struct Size {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let width: Int
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let height: Int
    }

    static func readPNGSize(data: Data) -> Size? {
        guard let source = CGImageSourceCreateWithData(data as CFData, nil) else { return nil }
        guard let props = CGImageSourceCopyPropertiesAtIndex(source, 0, nil) as? [CFString: Any] else { return nil }
        guard let width = props[kCGImagePropertyPixelWidth] as? Int else { return nil }
        guard let height = props[kCGImagePropertyPixelHeight] as? Int else { return nil }
        return Size(width: width, height: height)
    }
}
