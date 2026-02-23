/*
 * AUTO ANNOTATION
 * File: apps/ios/Sources/Motion/MotionService.swift
 * Purpose: File in apps area for project orchestration/configuration/data.
 * Module area: Native apps (macOS / iOS / Android / shared app assets)
 * System effect: Change can influence native apps (macos / ios / android / shared app assets) and therefore affects build/runtime behavior indirectly.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import CoreMotion
import Foundation
import OpenClawKit

final class MotionService: MotionServicing {
    func activities(params: OpenClawMotionActivityParams) async throws -> OpenClawMotionActivityPayload {
        guard CMMotionActivityManager.isActivityAvailable() else {
            throw NSError(domain: "Motion", code: 1, userInfo: [
                NSLocalizedDescriptionKey: "MOTION_UNAVAILABLE: activity not supported on this device",
            ])
        }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let auth = CMMotionActivityManager.authorizationStatus()
        guard auth == .authorized else {
            throw NSError(domain: "Motion", code: 3, userInfo: [
                NSLocalizedDescriptionKey: "MOTION_PERMISSION_REQUIRED: grant Motion & Fitness permission",
            ])
        }

        let (start, end) = Self.resolveRange(startISO: params.startISO, endISO: params.endISO)
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let limit = max(1, min(params.limit ?? 200, 1000))

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let manager = CMMotionActivityManager()
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let mapped = try await withCheckedThrowingContinuation { (cont: CheckedContinuation<[OpenClawMotionActivityEntry], Error>) in
            manager.queryActivityStarting(from: start, to: end, to: OperationQueue()) { activity, error in
                if let error {
                    cont.resume(throwing: error)
                } else {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
                    let formatter = ISO8601DateFormatter()
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
                    let sliced = Array((activity ?? []).suffix(limit))
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
                    let entries = sliced.map { entry in
                        OpenClawMotionActivityEntry(
                            startISO: formatter.string(from: entry.startDate),
                            endISO: formatter.string(from: end),
                            confidence: Self.confidenceString(entry.confidence),
                            isWalking: entry.walking,
                            isRunning: entry.running,
                            isCycling: entry.cycling,
                            isAutomotive: entry.automotive,
                            isStationary: entry.stationary,
                            isUnknown: entry.unknown)
                    }
                    cont.resume(returning: entries)
                }
            }
        }

        return OpenClawMotionActivityPayload(activities: mapped)
    }

    func pedometer(params: OpenClawPedometerParams) async throws -> OpenClawPedometerPayload {
        guard CMPedometer.isStepCountingAvailable() else {
            throw NSError(domain: "Motion", code: 2, userInfo: [
                NSLocalizedDescriptionKey: "PEDOMETER_UNAVAILABLE: step counting not supported",
            ])
        }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let auth = CMPedometer.authorizationStatus()
        guard auth == .authorized else {
            throw NSError(domain: "Motion", code: 4, userInfo: [
                NSLocalizedDescriptionKey: "MOTION_PERMISSION_REQUIRED: grant Motion & Fitness permission",
            ])
        }

        let (start, end) = Self.resolveRange(startISO: params.startISO, endISO: params.endISO)
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let pedometer = CMPedometer()
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let payload = try await withCheckedThrowingContinuation { (cont: CheckedContinuation<OpenClawPedometerPayload, Error>) in
            pedometer.queryPedometerData(from: start, to: end) { data, error in
                if let error {
                    cont.resume(throwing: error)
                } else {
                    let formatter = ISO8601DateFormatter()
                    let payload = OpenClawPedometerPayload(
                        startISO: formatter.string(from: start),
                        endISO: formatter.string(from: end),
                        steps: data?.numberOfSteps.intValue,
                        distanceMeters: data?.distance?.doubleValue,
                        floorsAscended: data?.floorsAscended?.intValue,
                        floorsDescended: data?.floorsDescended?.intValue)
                    cont.resume(returning: payload)
                }
            }
        }
        return payload
    }

    private static func resolveRange(startISO: String?, endISO: String?) -> (Date, Date) {
        let formatter = ISO8601DateFormatter()
        let start = startISO.flatMap { formatter.date(from: $0) } ?? Calendar.current.startOfDay(for: Date())
        let end = endISO.flatMap { formatter.date(from: $0) } ?? Date()
        return (start, end)
    }

    private static func confidenceString(_ confidence: CMMotionActivityConfidence) -> String {
        switch confidence {
        case .low: "low"
        case .medium: "medium"
        case .high: "high"
        @unknown default: "unknown"
        }
    }
}
