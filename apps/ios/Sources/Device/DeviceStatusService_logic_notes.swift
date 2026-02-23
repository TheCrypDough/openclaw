/*
 * AUTO ANNOTATION
 * File: apps/ios/Sources/Device/DeviceStatusService.swift
 * Purpose: File in apps area for project orchestration/configuration/data.
 * Module area: Native apps (macOS / iOS / Android / shared app assets)
 * System effect: Change can influence native apps (macos / ios / android / shared app assets) and therefore affects build/runtime behavior indirectly.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import Foundation
import OpenClawKit
import UIKit

final class DeviceStatusService: DeviceStatusServicing {
    private let networkStatus: NetworkStatusService

    init(networkStatus: NetworkStatusService = NetworkStatusService()) {
        self.networkStatus = networkStatus
    }

    func status() async throws -> OpenClawDeviceStatusPayload {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let battery = self.batteryStatus()
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let thermal = self.thermalStatus()
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let storage = self.storageStatus()
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let network = await self.networkStatus.currentStatus()
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let uptime = ProcessInfo.processInfo.systemUptime

        return OpenClawDeviceStatusPayload(
            battery: battery,
            thermal: thermal,
            storage: storage,
            network: network,
            uptimeSeconds: uptime)
    }

    func info() -> OpenClawDeviceInfoPayload {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let device = UIDevice.current
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let appVersion = Bundle.main.infoDictionary?["CFBundleShortVersionString"] as? String ?? "dev"
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let appBuild = Bundle.main.infoDictionary?["CFBundleVersion"] as? String ?? "0"
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let locale = Locale.preferredLanguages.first ?? Locale.current.identifier
        return OpenClawDeviceInfoPayload(
            deviceName: device.name,
            modelIdentifier: Self.modelIdentifier(),
            systemName: device.systemName,
            systemVersion: device.systemVersion,
            appVersion: appVersion,
            appBuild: appBuild,
            locale: locale)
    }

    private func batteryStatus() -> OpenClawBatteryStatusPayload {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let device = UIDevice.current
        device.isBatteryMonitoringEnabled = true
        let level = device.batteryLevel >= 0 ? Double(device.batteryLevel) : nil
        let state: OpenClawBatteryState = switch device.batteryState {
        case .charging: .charging
        case .full: .full
        case .unplugged: .unplugged
        case .unknown: .unknown
        @unknown default: .unknown
        }
        return OpenClawBatteryStatusPayload(
            level: level,
            state: state,
            lowPowerModeEnabled: ProcessInfo.processInfo.isLowPowerModeEnabled)
    }

    private func thermalStatus() -> OpenClawThermalStatusPayload {
        let state: OpenClawThermalState = switch ProcessInfo.processInfo.thermalState {
        case .nominal: .nominal
        case .fair: .fair
        case .serious: .serious
        case .critical: .critical
        @unknown default: .nominal
        }
        return OpenClawThermalStatusPayload(state: state)
    }

    private func storageStatus() -> OpenClawStorageStatusPayload {
        let attrs = (try? FileManager.default.attributesOfFileSystem(forPath: NSHomeDirectory())) ?? [:]
        let total = (attrs[.systemSize] as? NSNumber)?.int64Value ?? 0
        let free = (attrs[.systemFreeSize] as? NSNumber)?.int64Value ?? 0
        let used = max(0, total - free)
        return OpenClawStorageStatusPayload(totalBytes: total, freeBytes: free, usedBytes: used)
    }

    private static func modelIdentifier() -> String {
        var systemInfo = utsname()
        uname(&systemInfo)
        let machine = withUnsafeBytes(of: &systemInfo.machine) { ptr in
            String(bytes: ptr.prefix { $0 != 0 }, encoding: .utf8)
        }
        let trimmed = machine?.trimmingCharacters(in: .whitespacesAndNewlines) ?? ""
        return trimmed.isEmpty ? "unknown" : trimmed
    }
}
