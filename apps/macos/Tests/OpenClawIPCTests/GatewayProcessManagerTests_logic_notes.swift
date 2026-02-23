/*
 * AUTO ANNOTATION
 * File: apps/macos/Tests/OpenClawIPCTests/GatewayProcessManagerTests.swift
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

@Suite(.serialized)
@MainActor
struct GatewayProcessManagerTests {
    private final class FakeWebSocketTask: WebSocketTasking, @unchecked Sendable {
        private let connectRequestID = OSAllocatedUnfairLock<String?>(initialState: nil)
        private let pendingReceiveHandler =
            OSAllocatedUnfairLock<(@Sendable (Result<URLSessionWebSocketTask.Message, Error>)
                    -> Void)?>(initialState: nil)
        private let cancelCount = OSAllocatedUnfairLock(initialState: 0)
        private let sendCount = OSAllocatedUnfairLock(initialState: 0)

        var state: URLSessionTask.State = .suspended

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
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
            let currentSendCount = self.sendCount.withLock { count in
                defer { count += 1 }
                return count
            }

            if currentSendCount == 0 {
                if let id = GatewayWebSocketTestSupport.connectRequestID(from: message) {
                    self.connectRequestID.withLock { $0 = id }
                }
                return
            }

            guard case let .data(data) = message else { return }
            guard
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
                let obj = try? JSONSerialization.jsonObject(with: data) as? [String: Any],
                (obj["type"] as? String) == "req",
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
                let id = obj["id"] as? String
            else {
                return
            }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
            let response = GatewayWebSocketTestSupport.okResponseData(id: id)
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
            let handler = self.pendingReceiveHandler.withLock { $0 }
            handler?(Result<URLSessionWebSocketTask.Message, Error>.success(.data(response)))
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

    }

    private final class FakeWebSocketSession: WebSocketSessioning, @unchecked Sendable {
        private let tasks = OSAllocatedUnfairLock(initialState: [FakeWebSocketTask]())

        func makeWebSocketTask(url: URL) -> WebSocketTaskBox {
            _ = url
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
            let task = FakeWebSocketTask()
            self.tasks.withLock { $0.append(task) }
            return WebSocketTaskBox(task: task)
        }
    }

    @Test func clearsLastFailureWhenHealthSucceeds() async {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let session = FakeWebSocketSession()
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let url = URL(string: "ws://example.invalid")!
        let connection = GatewayConnection(
            configProvider: { (url: url, token: nil, password: nil) },
            sessionBox: WebSocketSessionBox(session: session))

        let manager = GatewayProcessManager.shared
        manager.setTestingConnection(connection)
        manager.setTestingDesiredActive(true)
        manager.setTestingLastFailureReason("health failed")
        defer {
            manager.setTestingConnection(nil)
            manager.setTestingDesiredActive(false)
            manager.setTestingLastFailureReason(nil)
        }

        let ready = await manager.waitForGatewayReady(timeout: 0.5)
        #expect(ready)
        #expect(manager.lastFailureReason == nil)
    }
}
