/*
 * AUTO ANNOTATION
 * File: apps/macos/Tests/OpenClawIPCTests/CanvasIPCTests.swift
 * Purpose: File in apps area for project orchestration/configuration/data.
 * Module area: Native apps (macOS / iOS / Android / shared app assets)
 * System effect: Change can influence native apps (macos / ios / android / shared app assets) and therefore affects build/runtime behavior indirectly.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import OpenClawIPC
import Foundation
import Testing

@Suite struct CanvasIPCTests {
    @Test func canvasPresentCodableRoundtrip() throws {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let placement = CanvasPlacement(x: 10, y: 20, width: 640, height: 480)
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let req: Request = .canvasPresent(session: "main", path: "/index.html", placement: placement)

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let data = try JSONEncoder().encode(req)
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let decoded = try JSONDecoder().decode(Request.self, from: data)

        switch decoded {
        case let .canvasPresent(session, path, placement):
            #expect(session == "main")
            #expect(path == "/index.html")
            #expect(placement?.x == 10)
            #expect(placement?.y == 20)
            #expect(placement?.width == 640)
            #expect(placement?.height == 480)
        default:
            Issue.record("expected canvasPresent, got \(decoded)")
        }
    }

    @Test func canvasPresentDecodesNilPlacementWhenMissing() throws {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let json = """
        {"type":"canvasPresent","session":"s","path":"/"}
        """
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let decoded = try JSONDecoder().decode(Request.self, from: Data(json.utf8))

        switch decoded {
        case let .canvasPresent(session, path, placement):
            #expect(session == "s")
            #expect(path == "/")
            #expect(placement == nil)
        default:
            Issue.record("expected canvasPresent, got \(decoded)")
        }
    }
}
