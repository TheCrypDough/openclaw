/*
 * AUTO ANNOTATION
 * File: apps/macos/Tests/OpenClawIPCTests/GatewayFrameDecodeTests.swift
 * Purpose: File in apps area for project orchestration/configuration/data.
 * Module area: Native apps (macOS / iOS / Android / shared app assets)
 * System effect: Change can influence native apps (macos / ios / android / shared app assets) and therefore affects build/runtime behavior indirectly.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import OpenClawProtocol
import Foundation
import Testing

@Suite struct GatewayFrameDecodeTests {
    @Test func decodesEventFrameWithAnyCodablePayload() throws {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let json = """
        {
          "type": "event",
          "event": "presence",
          "payload": { "foo": "bar", "count": 1 },
          "seq": 7
        }
        """

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let frame = try JSONDecoder().decode(GatewayFrame.self, from: Data(json.utf8))

        #expect({
            if case .event = frame { true } else { false }
        }(), "expected .event frame")

        guard case let .event(evt) = frame else {
            return
        }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let payload = evt.payload?.value as? [String: AnyCodable]
        #expect(payload?["foo"]?.value as? String == "bar")
        #expect(payload?["count"]?.value as? Int == 1)
        #expect(evt.seq == 7)
    }

    @Test func decodesRequestFrameWithNestedParams() throws {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let json = """
        {
          "type": "req",
          "id": "1",
          "method": "agent.send",
          "params": {
            "text": "hi",
            "items": [1, null, {"ok": true}],
            "meta": { "count": 2 }
          }
        }
        """

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let frame = try JSONDecoder().decode(GatewayFrame.self, from: Data(json.utf8))

        #expect({
            if case .req = frame { true } else { false }
        }(), "expected .req frame")

        guard case let .req(req) = frame else {
            return
        }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let params = req.params?.value as? [String: AnyCodable]
        #expect(params?["text"]?.value as? String == "hi")

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let items = params?["items"]?.value as? [AnyCodable]
        #expect(items?.count == 3)
        #expect(items?[0].value as? Int == 1)
        #expect(items?[1].value is NSNull)

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let item2 = items?[2].value as? [String: AnyCodable]
        #expect(item2?["ok"]?.value as? Bool == true)

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let meta = params?["meta"]?.value as? [String: AnyCodable]
        #expect(meta?["count"]?.value as? Int == 2)
    }

    @Test func decodesUnknownFrameAndPreservesRaw() throws {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let json = """
        {
          "type": "made-up",
          "foo": "bar",
          "count": 1,
          "nested": { "ok": true }
        }
        """

        let frame = try JSONDecoder().decode(GatewayFrame.self, from: Data(json.utf8))

        #expect({
            if case .unknown = frame { true } else { false }
        }(), "expected .unknown frame")

        guard case let .unknown(type, raw) = frame else {
            return
        }

        #expect(type == "made-up")
        #expect(raw["type"]?.value as? String == "made-up")
        #expect(raw["foo"]?.value as? String == "bar")
        #expect(raw["count"]?.value as? Int == 1)
        let nested = raw["nested"]?.value as? [String: AnyCodable]
        #expect(nested?["ok"]?.value as? Bool == true)
    }
}
