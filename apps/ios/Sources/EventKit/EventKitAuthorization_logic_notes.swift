/*
 * AUTO ANNOTATION
 * File: apps/ios/Sources/EventKit/EventKitAuthorization.swift
 * Purpose: File in apps area for project orchestration/configuration/data.
 * Module area: Native apps (macOS / iOS / Android / shared app assets)
 * System effect: Change can influence native apps (macos / ios / android / shared app assets) and therefore affects build/runtime behavior indirectly.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import EventKit

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
enum EventKitAuthorization {
    static func allowsRead(status: EKAuthorizationStatus) -> Bool {
        switch status {
        case .authorized, .fullAccess:
            return true
        case .writeOnly:
            return false
        case .notDetermined:
            // Don’t prompt during node.invoke; prompts block the invoke and lead to timeouts.
            return false
        case .restricted, .denied:
            return false
        @unknown default:
            return false
        }
    }

    static func allowsWrite(status: EKAuthorizationStatus) -> Bool {
        switch status {
        case .authorized, .fullAccess, .writeOnly:
            return true
        case .notDetermined:
            // Don’t prompt during node.invoke; prompts block the invoke and lead to timeouts.
            return false
        case .restricted, .denied:
            return false
        @unknown default:
            return false
        }
    }
}

