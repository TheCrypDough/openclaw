/*
 * AUTO ANNOTATION
 * File: apps/macos/Tests/OpenClawIPCTests/GatewayChannelShutdownTests.swift
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

@Suite struct GatewayChannelShutdownTests {
    private final class FakeWebSocketTask: WebSocketTasking, @unchecked Sendable {
        private let connectRequestID = OSAllocatedUnfairLock<String?>(initialState: nil)
        private let pendingReceiveHandler =
            OSAllocatedUnfairLock<(@Sendable (Result<URLSessionWebSocketTask.Message, Error>)
                    -> Void)?>(initialState: nil)
        private let cancelCount = OSAllocatedUnfairLock(initialState: 0)

        var state: URLSessionTask.State = .suspended

        func snapshotCancelCount() -> Int { self.cancelCount.withLock { $0 } }

        func resume() {
            self.state = .running
        }

        func cancel(with closeCode: URLSessionWebSocketTask.CloseCode, reason: Data?) {
            _ = (closeCode, reason)
            self.state = .canceling
            self.cancelCount.withLock { $0 += 1 }
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
            let id = self.connectRequestID.withLock { $0 } ?? "connect"
            return .data(GatewayWebSocketTestSupport.connectOkData(id: id))
        }

        func receive(
            completionHandler: @escaping @Sendable (Result<URLSessionWebSocketTask.Message, Error>) -> Void)
        {
            self.pendingReceiveHandler.withLock { $0 = completionHandler }
        }

        func triggerReceiveFailure() {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
            let handler = self.pendingReceiveHandler.withLock { $0 }
            handler?(Result<URLSessionWebSocketTask.Message, Error>.failure(URLError(.networkConnectionLost)))
        }

    }

    private final class FakeWebSocketSession: WebSocketSessioning, @unchecked Sendable {
        private let makeCount = OSAllocatedUnfairLock(initialState: 0)
        private let tasks = OSAllocatedUnfairLock(initialState: [FakeWebSocketTask]())

        func snapshotMakeCount() -> Int { self.makeCount.withLock { $0 } }
        func latestTask() -> FakeWebSocketTask? { self.tasks.withLock { $0.last } }

        func makeWebSocketTask(url: URL) -> WebSocketTaskBox {
            _ = url
            self.makeCount.withLock { $0 += 1 }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
            let task = FakeWebSocketTask()
            self.tasks.withLock { $0.append(task) }
            return WebSocketTaskBox(task: task)
        }
    }

    @Test func shutdownPreventsReconnectLoopFromReceiveFailure() async throws {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let session = FakeWebSocketSession()
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let channel = GatewayChannelActor(
            url: URL(string: "ws://example.invalid")!,
            token: nil,
            session: WebSocketSessionBox(session: session))

        // Establish a connection so `listen()` is active.
        try await channel.connect()
        #expect(session.snapshotMakeCount() == 1)

        // Simulate a socket receive failure, which would normally schedule a reconnect.
        session.latestTask()?.triggerReceiveFailure()

        // Shut down quickly, before backoff reconnect triggers.
        await channel.shutdown()

        // Wait longer than the default reconnect backoff (500ms) to ensure no reconnect happens.
        try? await Task.sleep(nanoseconds: 750 * 1_000_000)

        #expect(session.snapshotMakeCount() == 1)
    }
}
