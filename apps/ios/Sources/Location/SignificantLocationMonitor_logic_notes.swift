/*
 * AUTO ANNOTATION
 * File: apps/ios/Sources/Location/SignificantLocationMonitor.swift
 * Purpose: File in apps area for project orchestration/configuration/data.
 * Module area: Native apps (macOS / iOS / Android / shared app assets)
 * System effect: Change can influence native apps (macos / ios / android / shared app assets) and therefore affects build/runtime behavior indirectly.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import CoreLocation
import Foundation
import OpenClawKit

/// Monitors significant location changes and pushes `location.update`
/// events to the gateway so the severance hook can determine whether
/// the user is at their configured work location.
@MainActor
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
enum SignificantLocationMonitor {
    static func startIfNeeded(
        locationService: any LocationServicing,
        locationMode: OpenClawLocationMode,
        gateway: GatewayNodeSession,
        beforeSend: (@MainActor @Sendable () async -> Void)? = nil
    ) {
        guard locationMode == .always else { return }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let status = locationService.authorizationStatus()
        guard status == .authorizedAlways else { return }
        locationService.startMonitoringSignificantLocationChanges { location in
            struct Payload: Codable {
                var lat: Double
                var lon: Double
                var accuracyMeters: Double
                var source: String?
            }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
            let payload = Payload(
                lat: location.coordinate.latitude,
                lon: location.coordinate.longitude,
                accuracyMeters: location.horizontalAccuracy,
                source: "ios-significant-location")
            guard let data = try? JSONEncoder().encode(payload),
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
                  let json = String(data: data, encoding: .utf8)
            else { return }
            Task { @MainActor in
                if let beforeSend {
                    await beforeSend()
                }
                await gateway.sendEvent(event: "location.update", payloadJSON: json)
            }
        }
    }
}
