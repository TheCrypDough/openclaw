/*
 * AUTO ANNOTATION
 * File: apps/macos/Tests/OpenClawIPCTests/GatewayConnectionControlTests.swift
 * Purpose: File in apps area for project orchestration/configuration/data.
 * Module area: Native apps (macOS / iOS / Android / shared app assets)
 * System effect: Change can influence native apps (macos / ios / android / shared app assets) and therefore affects build/runtime behavior indirectly.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import OpenClawKit
import Foundation
import Testing
@testable import OpenClaw
@testable import OpenClawIPC

private final class FakeWebSocketTask: WebSocketTasking, @unchecked Sendable {
    var state: URLSessionTask.State = .running

    func resume() {}

    func cancel(with _: URLSessionWebSocketTask.CloseCode, reason _: Data?) {
        self.state = .canceling
    }

    func send(_: URLSessionWebSocketTask.Message) async throws {}

    func receive() async throws -> URLSessionWebSocketTask.Message {
        throw URLError(.cannotConnectToHost)
    }

    func receive(completionHandler: @escaping @Sendable (Result<URLSessionWebSocketTask.Message, Error>) -> Void) {
        completionHandler(.failure(URLError(.cannotConnectToHost)))
    }
}

private final class FakeWebSocketSession: WebSocketSessioning, @unchecked Sendable {
    func makeWebSocketTask(url _: URL) -> WebSocketTaskBox {
        WebSocketTaskBox(task: FakeWebSocketTask())
    }
}

private func makeTestGatewayConnection() -> GatewayConnection {
    GatewayConnection(
        configProvider: {
            (url: URL(string: "ws://127.0.0.1:1")!, token: nil, password: nil)
        },
        sessionBox: WebSocketSessionBox(session: FakeWebSocketSession()))
}

@Suite(.serialized) struct GatewayConnectionControlTests {
    @Test func statusFailsWhenProcessMissing() async {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let connection = makeTestGatewayConnection()
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let result = await connection.status()
        #expect(result.ok == false)
        #expect(result.error != nil)
    }

    @Test func rejectEmptyMessage() async {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let connection = makeTestGatewayConnection()
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let result = await connection.sendAgent(
            message: "",
            thinking: nil,
            sessionKey: "main",
            deliver: false,
            to: nil)
        #expect(result.ok == false)
    }
}
