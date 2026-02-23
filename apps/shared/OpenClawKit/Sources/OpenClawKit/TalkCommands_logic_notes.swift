/*
 * AUTO ANNOTATION
 * File: apps/shared/OpenClawKit/Sources/OpenClawKit/TalkCommands.swift
 * Purpose: File in apps area for project orchestration/configuration/data.
 * Module area: Native apps (macOS / iOS / Android / shared app assets)
 * System effect: Change can influence native apps (macos / ios / android / shared app assets) and therefore affects build/runtime behavior indirectly.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import Foundation

public enum OpenClawTalkCommand: String, Codable, Sendable {
    case pttStart = "talk.ptt.start"
    case pttStop = "talk.ptt.stop"
    case pttCancel = "talk.ptt.cancel"
    case pttOnce = "talk.ptt.once"
}

public struct OpenClawTalkPTTStartPayload: Codable, Sendable, Equatable {
    public var captureId: String

    public init(captureId: String) {
        self.captureId = captureId
    }
}

public struct OpenClawTalkPTTStopPayload: Codable, Sendable, Equatable {
    public var captureId: String
    public var transcript: String?
    public var status: String

    public init(captureId: String, transcript: String?, status: String) {
        self.captureId = captureId
        self.transcript = transcript
        self.status = status
    }
}
