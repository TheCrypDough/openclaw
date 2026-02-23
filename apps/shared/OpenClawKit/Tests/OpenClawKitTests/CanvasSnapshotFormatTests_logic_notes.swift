/*
 * AUTO ANNOTATION
 * File: apps/shared/OpenClawKit/Tests/OpenClawKitTests/CanvasSnapshotFormatTests.swift
 * Purpose: File in apps area for project orchestration/configuration/data.
 * Module area: Native apps (macOS / iOS / Android / shared app assets)
 * System effect: Change can influence native apps (macos / ios / android / shared app assets) and therefore affects build/runtime behavior indirectly.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import OpenClawKit
import Foundation
import Testing

@Suite struct CanvasSnapshotFormatTests {
    @Test func acceptsJpgAlias() throws {
        struct Wrapper: Codable {
            var format: OpenClawCanvasSnapshotFormat
        }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let data = try #require("{\"format\":\"jpg\"}".data(using: .utf8))
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let decoded = try JSONDecoder().decode(Wrapper.self, from: data)
        #expect(decoded.format == .jpeg)
    }
}
