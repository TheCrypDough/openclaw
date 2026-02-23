/*
 * AUTO ANNOTATION
 * File: apps/macos/Sources/OpenClaw/NodeMode/MacNodeLocationService.swift
 * Purpose: File in apps area for project orchestration/configuration/data.
 * Module area: Native apps (macOS / iOS / Android / shared app assets)
 * System effect: Change can influence native apps (macos / ios / android / shared app assets) and therefore affects build/runtime behavior indirectly.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import CoreLocation
import Foundation
import OpenClawKit

@MainActor
final class MacNodeLocationService: NSObject, CLLocationManagerDelegate {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    enum Error: Swift.Error {
        case timeout
        case unavailable
    }

    private let manager = CLLocationManager()
    private var locationContinuation: CheckedContinuation<CLLocation, Swift.Error>?

    override init() {
        super.init()
        self.manager.delegate = self
        self.manager.desiredAccuracy = kCLLocationAccuracyBest
    }

    func authorizationStatus() -> CLAuthorizationStatus {
        self.manager.authorizationStatus
    }

    func accuracyAuthorization() -> CLAccuracyAuthorization {
        if #available(macOS 11.0, *) {
            return self.manager.accuracyAuthorization
        }
        return .fullAccuracy
    }

    func currentLocation(
        desiredAccuracy: OpenClawLocationAccuracy,
        maxAgeMs: Int?,
        timeoutMs: Int?) async throws -> CLLocation
    {
        guard CLLocationManager.locationServicesEnabled() else {
            throw Error.unavailable
        }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let now = Date()
        if let maxAgeMs,
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
           let cached = self.manager.location,
           now.timeIntervalSince(cached.timestamp) * 1000 <= Double(maxAgeMs)
        {
            return cached
        }

        self.manager.desiredAccuracy = Self.accuracyValue(desiredAccuracy)
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let timeout = max(0, timeoutMs ?? 10000)
        return try await self.withTimeout(timeoutMs: timeout) {
            try await self.requestLocation()
        }
    }

    private func requestLocation() async throws -> CLLocation {
        try await withCheckedThrowingContinuation { cont in
            self.locationContinuation = cont
            self.manager.requestLocation()
        }
    }

    private func withTimeout<T: Sendable>(
        timeoutMs: Int,
        operation: @escaping () async throws -> T) async throws -> T
    {
        if timeoutMs == 0 {
            return try await operation()
        }

        return try await withCheckedThrowingContinuation { continuation in
            var didFinish = false

            func finish(returning value: T) {
                guard !didFinish else { return }
                didFinish = true
                continuation.resume(returning: value)
            }

            func finish(throwing error: Swift.Error) {
                guard !didFinish else { return }
                didFinish = true
                continuation.resume(throwing: error)
            }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
            let timeoutItem = DispatchWorkItem {
                finish(throwing: Error.timeout)
            }
            DispatchQueue.main.asyncAfter(
                deadline: .now() + .milliseconds(timeoutMs),
                execute: timeoutItem)

            Task { @MainActor in
                do {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
                    let value = try await operation()
                    timeoutItem.cancel()
                    finish(returning: value)
                } catch {
                    timeoutItem.cancel()
                    finish(throwing: error)
                }
            }
        }
    }

    private static func accuracyValue(_ accuracy: OpenClawLocationAccuracy) -> CLLocationAccuracy {
        switch accuracy {
        case .coarse:
            kCLLocationAccuracyKilometer
        case .balanced:
            kCLLocationAccuracyHundredMeters
        case .precise:
            kCLLocationAccuracyBest
        }
    }

    // MARK: - CLLocationManagerDelegate (nonisolated for Swift 6 compatibility)

    nonisolated func locationManager(_ manager: CLLocationManager, didUpdateLocations locations: [CLLocation]) {
        Task { @MainActor in
            guard let cont = self.locationContinuation else { return }
            self.locationContinuation = nil
            if let latest = locations.last {
                cont.resume(returning: latest)
            } else {
                cont.resume(throwing: Error.unavailable)
            }
        }
    }

    nonisolated func locationManager(_ manager: CLLocationManager, didFailWithError error: Swift.Error) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let errorCopy = error // Capture error for Sendable compliance
        Task { @MainActor in
            guard let cont = self.locationContinuation else { return }
            self.locationContinuation = nil
            cont.resume(throwing: errorCopy)
        }
    }
}
