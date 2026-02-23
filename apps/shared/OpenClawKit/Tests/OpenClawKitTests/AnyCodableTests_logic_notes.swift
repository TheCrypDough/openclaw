/*
 * AUTO ANNOTATION
 * File: apps/shared/OpenClawKit/Tests/OpenClawKitTests/AnyCodableTests.swift
 * Purpose: File in apps area for project orchestration/configuration/data.
 * Module area: Native apps (macOS / iOS / Android / shared app assets)
 * System effect: Change can influence native apps (macos / ios / android / shared app assets) and therefore affects build/runtime behavior indirectly.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import Foundation
import Testing
import OpenClawProtocol

struct AnyCodableTests {
    @Test
    func encodesNSNumberBooleansAsJSONBooleans() throws {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let trueData = try JSONEncoder().encode(AnyCodable(NSNumber(value: true)))
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let falseData = try JSONEncoder().encode(AnyCodable(NSNumber(value: false)))

        #expect(String(data: trueData, encoding: .utf8) == "true")
        #expect(String(data: falseData, encoding: .utf8) == "false")
    }

    @Test
    func preservesBooleanLiteralsFromJSONSerializationBridge() throws {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let raw = try #require(
            JSONSerialization.jsonObject(with: Data(#"{"enabled":true,"nested":{"active":false}}"#.utf8))
                as? [String: Any]
        )
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let enabled = try #require(raw["enabled"])
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let nested = try #require(raw["nested"])

        struct RequestEnvelope: Codable {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
            let params: [String: AnyCodable]
        }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let envelope = RequestEnvelope(
            params: [
                "enabled": AnyCodable(enabled),
                "nested": AnyCodable(nested),
            ]
        )
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let data = try JSONEncoder().encode(envelope)
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let json = try #require(String(data: data, encoding: .utf8))

        #expect(json.contains(#""enabled":true"#))
        #expect(json.contains(#""active":false"#))
    }
}
