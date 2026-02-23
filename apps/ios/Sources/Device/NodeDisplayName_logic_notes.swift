/*
 * AUTO ANNOTATION
 * File: apps/ios/Sources/Device/NodeDisplayName.swift
 * Purpose: File in apps area for project orchestration/configuration/data.
 * Module area: Native apps (macOS / iOS / Android / shared app assets)
 * System effect: Change can influence native apps (macos / ios / android / shared app assets) and therefore affects build/runtime behavior indirectly.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import Foundation
import UIKit

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
enum NodeDisplayName {
    private static let genericNames: Set<String> = ["iOS Node", "iPhone Node", "iPad Node"]

    static func isGeneric(_ name: String) -> Bool {
        Self.genericNames.contains(name)
    }

    static func defaultValue(for interfaceIdiom: UIUserInterfaceIdiom) -> String {
        switch interfaceIdiom {
        case .phone:
            return "iPhone Node"
        case .pad:
            return "iPad Node"
        default:
            return "iOS Node"
        }
    }

    static func resolve(
        existing: String?,
        deviceName: String,
        interfaceIdiom: UIUserInterfaceIdiom
    ) -> String {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let trimmedExisting = existing?.trimmingCharacters(in: .whitespacesAndNewlines) ?? ""
        if !trimmedExisting.isEmpty, !Self.isGeneric(trimmedExisting) {
            return trimmedExisting
        }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let trimmedDevice = deviceName.trimmingCharacters(in: .whitespacesAndNewlines)
        if let normalized = Self.normalizedDeviceName(trimmedDevice) {
            return normalized
        }

        return Self.defaultValue(for: interfaceIdiom)
    }

    private static func normalizedDeviceName(_ deviceName: String) -> String? {
        guard !deviceName.isEmpty else { return nil }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let lower = deviceName.lowercased()
        if lower.contains("iphone") || lower.contains("ipad") || lower.contains("ios") {
            return deviceName
        }
        return nil
    }
}
