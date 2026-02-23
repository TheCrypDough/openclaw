/*
 * AUTO ANNOTATION
 * File: apps/macos/Tests/OpenClawIPCTests/GatewayChannelConnectTests.swift
 * Purpose: File in apps area for project orchestration/configuration/data.
 * Module area: Native apps (macOS / iOS / Android / shared app assets)
 * System effect: Change can influence native apps (macos / ios / android / shared app assets) and therefore affects build/runtime behavior indirectly.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import OpenClawKit
import Foundation
import os
import Testing
@testable import OpenClaw

@Suite struct GatewayChannelConnectTests {
    private enum FakeResponse {
        case helloOk(delayMs: Int)
        case invalid(delayMs: Int)
    }

    private final class FakeWebSocketTask: WebSocketTasking, @unchecked Sendable {
        private let response: FakeResponse
        private let connectRequestID = OSAllocatedUnfairLock<String?>(initialState: nil)
        private let pendingReceiveHandler =
            OSAllocatedUnfairLock<(@Sendable (Result<URLSessionWebSocketTask.Message, Error>) -> Void)?>(
                initialState: nil)

        var state: URLSessionTask.State = .suspended

        init(response: FakeResponse) {
            self.response = response
        }

        func resume() {
            self.state = .running
        }

        func cancel(with closeCode: URLSessionWebSocketTask.CloseCode, reason: Data?) {
            _ = (closeCode, reason)
            self.state = .canceling
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
            let handler = self.pendingReceiveHandler.withLock { handler in
                defer { handler = nil }
                return handler
            }
            handler?(Result<URLSessionWebSocketTask.Message, Error>.failure(URLError(.cancelled)))
        }

        func send(_ message: URLSessionWebSocketTask.Message) async throws {
            if let id = GatewayWebSocketTestSupport.connectRequestID(from: message) {
                self.connectRequestID.withLock { $0 = id }
            }
        }

        func receive() async throws -> URLSessionWebSocketTask.Message {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
            let delayMs: Int
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
            let msg: URLSessionWebSocketTask.Message
            switch self.response {
            case let .helloOk(ms):
                delayMs = ms
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
                let id = self.connectRequestID.withLock { $0 } ?? "connect"
                msg = .data(GatewayWebSocketTestSupport.connectOkData(id: id))
            case let .invalid(ms):
                delayMs = ms
                msg = .string("not json")
            }
            try await Task.sleep(nanoseconds: UInt64(delayMs) * 1_000_000)
            return msg
        }

        func receive(
            completionHandler: @escaping @Sendable (Result<URLSessionWebSocketTask.Message, Error>) -> Void)
        {
            // The production channel sets up a continuous receive loop after hello.
            // Tests only need the handshake receive; keep the loop idle.
            self.pendingReceiveHandler.withLock { $0 = completionHandler }
        }

    }

    private final class FakeWebSocketSession: WebSocketSessioning, @unchecked Sendable {
        private let response: FakeResponse
        private let makeCount = OSAllocatedUnfairLock(initialState: 0)

        init(response: FakeResponse) {
            self.response = response
        }

        func snapshotMakeCount() -> Int { self.makeCount.withLock { $0 } }

        func makeWebSocketTask(url: URL) -> WebSocketTaskBox {
            _ = url
            self.makeCount.withLock { $0 += 1 }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
            let task = FakeWebSocketTask(response: self.response)
            return WebSocketTaskBox(task: task)
        }
    }

    @Test func concurrentConnectIsSingleFlightOnSuccess() async throws {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let session = FakeWebSocketSession(response: .helloOk(delayMs: 200))
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let channel = GatewayChannelActor(
            url: URL(string: "ws://example.invalid")!,
            token: nil,
            session: WebSocketSessionBox(session: session))

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let t1 = Task { try await channel.connect() }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let t2 = Task { try await channel.connect() }

        _ = try await t1.value
        _ = try await t2.value

        #expect(session.snapshotMakeCount() == 1)
    }

    @Test func concurrentConnectSharesFailure() async {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let session = FakeWebSocketSession(response: .invalid(delayMs: 200))
        let channel = GatewayChannelActor(
            url: URL(string: "ws://example.invalid")!,
            token: nil,
            session: WebSocketSessionBox(session: session))

        let t1 = Task { try await channel.connect() }
        let t2 = Task { try await channel.connect() }

        let r1 = await t1.result
        let r2 = await t2.result

        #expect({
            if case .failure = r1 { true } else { false }
        }())
        #expect({
            if case .failure = r2 { true } else { false }
        }())
        #expect(session.snapshotMakeCount() == 1)
    }
}
