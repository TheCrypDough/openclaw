/*
 * AUTO ANNOTATION
 * File: apps/macos/Tests/OpenClawIPCTests/MacGatewayChatTransportMappingTests.swift
 * Purpose: File in apps area for project orchestration/configuration/data.
 * Module area: Native apps (macOS / iOS / Android / shared app assets)
 * System effect: Change can influence native apps (macos / ios / android / shared app assets) and therefore affects build/runtime behavior indirectly.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import OpenClawChatUI
import OpenClawProtocol
import Testing
@testable import OpenClaw

@Suite struct MacGatewayChatTransportMappingTests {
    @Test func snapshotMapsToHealth() {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let snapshot = Snapshot(
            presence: [],
            health: OpenClawProtocol.AnyCodable(["ok": OpenClawProtocol.AnyCodable(false)]),
            stateversion: StateVersion(presence: 1, health: 1),
            uptimems: 123,
            configpath: nil,
            statedir: nil,
            sessiondefaults: nil,
            authmode: nil,
            updateavailable: nil)

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let hello = HelloOk(
            type: "hello",
            _protocol: 2,
            server: [:],
            features: [:],
            snapshot: snapshot,
            canvashosturl: nil,
            auth: nil,
            policy: [:])

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let mapped = MacGatewayChatTransport.mapPushToTransportEvent(.snapshot(hello))
        switch mapped {
        case let .health(ok):
            #expect(ok == false)
        default:
            Issue.record("expected .health from snapshot, got \(String(describing: mapped))")
        }
    }

    @Test func healthEventMapsToHealth() {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let frame = EventFrame(
            type: "event",
            event: "health",
            payload: OpenClawProtocol.AnyCodable(["ok": OpenClawProtocol.AnyCodable(true)]),
            seq: 1,
            stateversion: nil)

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let mapped = MacGatewayChatTransport.mapPushToTransportEvent(.event(frame))
        switch mapped {
        case let .health(ok):
            #expect(ok == true)
        default:
            Issue.record("expected .health from health event, got \(String(describing: mapped))")
        }
    }

    @Test func tickEventMapsToTick() {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let frame = EventFrame(type: "event", event: "tick", payload: nil, seq: 1, stateversion: nil)
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let mapped = MacGatewayChatTransport.mapPushToTransportEvent(.event(frame))
        #expect({
            if case .tick = mapped { return true }
            return false
        }())
    }

    @Test func chatEventMapsToChat() {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let payload = OpenClawProtocol.AnyCodable([
            "runId": OpenClawProtocol.AnyCodable("run-1"),
            "sessionKey": OpenClawProtocol.AnyCodable("main"),
            "state": OpenClawProtocol.AnyCodable("final"),
        ])
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let frame = EventFrame(type: "event", event: "chat", payload: payload, seq: 1, stateversion: nil)
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let mapped = MacGatewayChatTransport.mapPushToTransportEvent(.event(frame))

        switch mapped {
        case let .chat(chat):
            #expect(chat.runId == "run-1")
            #expect(chat.sessionKey == "main")
            #expect(chat.state == "final")
        default:
            Issue.record("expected .chat from chat event, got \(String(describing: mapped))")
        }
    }

    @Test func unknownEventMapsToNil() {
        let frame = EventFrame(
            type: "event",
            event: "unknown",
            payload: OpenClawProtocol.AnyCodable(["a": OpenClawProtocol.AnyCodable(1)]),
            seq: 1,
            stateversion: nil)
        let mapped = MacGatewayChatTransport.mapPushToTransportEvent(.event(frame))
        #expect(mapped == nil)
    }

    @Test func seqGapMapsToSeqGap() {
        let mapped = MacGatewayChatTransport.mapPushToTransportEvent(.seqGap(expected: 1, received: 9))
        #expect({
            if case .seqGap = mapped { return true }
            return false
        }())
    }
}
