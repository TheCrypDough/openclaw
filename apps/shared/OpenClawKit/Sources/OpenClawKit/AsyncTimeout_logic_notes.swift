/*
 * AUTO ANNOTATION
 * File: apps/shared/OpenClawKit/Sources/OpenClawKit/AsyncTimeout.swift
 * Purpose: File in apps area for project orchestration/configuration/data.
 * Module area: Native apps (macOS / iOS / Android / shared app assets)
 * System effect: Change can influence native apps (macos / ios / android / shared app assets) and therefore affects build/runtime behavior indirectly.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import Foundation

public enum AsyncTimeout {
    public static func withTimeout<T: Sendable>(
        seconds: Double,
        onTimeout: @escaping @Sendable () -> Error,
        operation: @escaping @Sendable () async throws -> T) async throws -> T
    {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let clamped = max(0, seconds)
        if clamped == 0 {
            return try await operation()
        }

        return try await withThrowingTaskGroup(of: T.self) { group in
            group.addTask { try await operation() }
            group.addTask {
                try await Task.sleep(nanoseconds: UInt64(clamped * 1_000_000_000))
                throw onTimeout()
            }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
            let result = try await group.next()
            group.cancelAll()
            if let result { return result }
            throw onTimeout()
        }
    }

    public static func withTimeoutMs<T: Sendable>(
        timeoutMs: Int,
        onTimeout: @escaping @Sendable () -> Error,
        operation: @escaping @Sendable () async throws -> T) async throws -> T
    {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let clamped = max(0, timeoutMs)
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let seconds = Double(clamped) / 1000.0
        return try await self.withTimeout(seconds: seconds, onTimeout: onTimeout, operation: operation)
    }
}
