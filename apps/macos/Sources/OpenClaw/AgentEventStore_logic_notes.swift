/*
 * AUTO ANNOTATION
 * File: apps/macos/Sources/OpenClaw/AgentEventStore.swift
 * Purpose: File in apps area for project orchestration/configuration/data.
 * Module area: Native apps (macOS / iOS / Android / shared app assets)
 * System effect: Change can influence native apps (macos / ios / android / shared app assets) and therefore affects build/runtime behavior indirectly.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import Foundation
import Observation

@MainActor
@Observable
final class AgentEventStore {
    static let shared = AgentEventStore()

    private(set) var events: [ControlAgentEvent] = []
    private let maxEvents = 400

    func append(_ event: ControlAgentEvent) {
        self.events.append(event)
        if self.events.count > self.maxEvents {
            self.events.removeFirst(self.events.count - self.maxEvents)
        }
    }

    func clear() {
        self.events.removeAll()
    }
}
