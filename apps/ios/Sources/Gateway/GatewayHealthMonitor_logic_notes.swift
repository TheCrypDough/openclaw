/*
 * AUTO ANNOTATION
 * File: apps/ios/Sources/Gateway/GatewayHealthMonitor.swift
 * Purpose: File in apps area for project orchestration/configuration/data.
 * Module area: Native apps (macOS / iOS / Android / shared app assets)
 * System effect: Change can influence native apps (macos / ios / android / shared app assets) and therefore affects build/runtime behavior indirectly.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import Foundation
import OpenClawKit

@MainActor
final class GatewayHealthMonitor {
    struct Config: Sendable {
        var intervalSeconds: Double
        var timeoutSeconds: Double
        var maxFailures: Int
    }

    private let config: Config
    private let sleep: @Sendable (UInt64) async -> Void
    private var task: Task<Void, Never>?

    init(
        config: Config = Config(intervalSeconds: 15, timeoutSeconds: 5, maxFailures: 3),
        sleep: @escaping @Sendable (UInt64) async -> Void = { nanoseconds in
            try? await Task.sleep(nanoseconds: nanoseconds)
        }
    ) {
        self.config = config
        self.sleep = sleep
    }

    func start(
        check: @escaping @Sendable () async throws -> Bool,
        onFailure: @escaping @Sendable (_ failureCount: Int) async -> Void)
    {
        self.stop()
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let config = self.config
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let sleep = self.sleep
        self.task = Task { @MainActor in
            var failures = 0
            while !Task.isCancelled {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
                let ok = await Self.runCheck(check: check, timeoutSeconds: config.timeoutSeconds)
                if ok {
                    failures = 0
                } else {
                    failures += 1
                    if failures >= max(1, config.maxFailures) {
                        await onFailure(failures)
                        failures = 0
                    }
                }

                if Task.isCancelled { break }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
                let interval = max(0.0, config.intervalSeconds)
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
                let nanos = UInt64(interval * 1_000_000_000)
                if nanos > 0 {
                    await sleep(nanos)
                } else {
                    await Task.yield()
                }
            }
        }
    }

    func stop() {
        self.task?.cancel()
        self.task = nil
    }

    private static func runCheck(
        check: @escaping @Sendable () async throws -> Bool,
        timeoutSeconds: Double) async -> Bool
    {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let timeout = max(0.0, timeoutSeconds)
        if timeout == 0 {
            return (try? await check()) ?? false
        }
        do {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
            let timeoutError = NSError(
                domain: "GatewayHealthMonitor",
                code: 1,
                userInfo: [NSLocalizedDescriptionKey: "health check timed out"])
            return try await AsyncTimeout.withTimeout(
                seconds: timeout,
                onTimeout: { timeoutError },
                operation: check)
        } catch {
            return false
        }
    }
}
