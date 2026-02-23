/*
 * AUTO ANNOTATION
 * File: apps/macos/Tests/OpenClawIPCTests/InstancesStoreTests.swift
 * Purpose: File in apps area for project orchestration/configuration/data.
 * Module area: Native apps (macOS / iOS / Android / shared app assets)
 * System effect: Change can influence native apps (macos / ios / android / shared app assets) and therefore affects build/runtime behavior indirectly.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import OpenClawProtocol
import Testing
@testable import OpenClaw

@Suite struct InstancesStoreTests {
    @Test
    @MainActor
    func presenceEventPayloadDecodesViaJSONEncoder() {
        // Build a payload that mirrors the gateway's presence event shape:
        // { "presence": [ PresenceEntry ] }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let entry: [String: OpenClawProtocol.AnyCodable] = [
            "host": .init("gw"),
            "ip": .init("10.0.0.1"),
            "version": .init("2.0.0"),
            "mode": .init("gateway"),
            "lastInputSeconds": .init(5),
            "reason": .init("test"),
            "text": .init("Gateway node"),
            "ts": .init(1_730_000_000),
        ]
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let payloadMap: [String: OpenClawProtocol.AnyCodable] = [
            "presence": .init([OpenClawProtocol.AnyCodable(entry)]),
        ]
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let payload = OpenClawProtocol.AnyCodable(payloadMap)

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let store = InstancesStore(isPreview: true)
        store.handlePresenceEventPayload(payload)

        #expect(store.instances.count == 1)
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let instance = store.instances.first
        #expect(instance?.host == "gw")
        #expect(instance?.ip == "10.0.0.1")
        #expect(instance?.mode == "gateway")
        #expect(instance?.reason == "test")
    }
}
