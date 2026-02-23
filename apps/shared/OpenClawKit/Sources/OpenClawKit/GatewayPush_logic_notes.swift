/*
 * AUTO ANNOTATION
 * File: apps/shared/OpenClawKit/Sources/OpenClawKit/GatewayPush.swift
 * Purpose: File in apps area for project orchestration/configuration/data.
 * Module area: Native apps (macOS / iOS / Android / shared app assets)
 * System effect: Change can influence native apps (macos / ios / android / shared app assets) and therefore affects build/runtime behavior indirectly.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import OpenClawProtocol

/// Server-push messages from the gateway websocket.
///
/// This is the in-process replacement for the legacy `NotificationCenter` fan-out.
public enum GatewayPush: Sendable {
    /// A full snapshot that arrives on connect (or reconnect).
    case snapshot(HelloOk)
    /// A server push event frame.
    case event(EventFrame)
    /// A detected sequence gap (`expected...received`) for event frames.
    case seqGap(expected: Int, received: Int)
}
