/*
 * AUTO ANNOTATION
 * File: apps/macos/Sources/OpenClaw/NotificationManager.swift
 * Purpose: File in apps area for project orchestration/configuration/data.
 * Module area: Native apps (macOS / iOS / Android / shared app assets)
 * System effect: Change can influence native apps (macos / ios / android / shared app assets) and therefore affects build/runtime behavior indirectly.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import Foundation
import OpenClawIPC
import Security
import UserNotifications

@MainActor
struct NotificationManager {
    private let logger = Logger(subsystem: "ai.openclaw", category: "notifications")

    private static let hasTimeSensitiveEntitlement: Bool = {
        guard let task = SecTaskCreateFromSelf(nil) else { return false }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let key = "com.apple.developer.usernotifications.time-sensitive" as CFString
        guard let val = SecTaskCopyValueForEntitlement(task, key, nil) else { return false }
        return (val as? Bool) == true
    }()

    func send(title: String, body: String, sound: String?, priority: NotificationPriority? = nil) async -> Bool {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let center = UNUserNotificationCenter.current()
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let status = await center.notificationSettings()
        if status.authorizationStatus == .notDetermined {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
            let granted = try? await center.requestAuthorization(options: [.alert, .sound, .badge])
            if granted != true {
                self.logger.warning("notification permission denied (request)")
                return false
            }
        } else if status.authorizationStatus != .authorized {
            self.logger.warning("notification permission denied status=\(status.authorizationStatus.rawValue)")
            return false
        }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let content = UNMutableNotificationContent()
        content.title = title
        content.body = body
        if let soundName = sound, !soundName.isEmpty {
            content.sound = UNNotificationSound(named: UNNotificationSoundName(soundName))
        }

        // Set interruption level based on priority
        if let priority {
            switch priority {
            case .passive:
                content.interruptionLevel = .passive
            case .active:
                content.interruptionLevel = .active
            case .timeSensitive:
                if Self.hasTimeSensitiveEntitlement {
                    content.interruptionLevel = .timeSensitive
                } else {
                    self.logger.debug(
                        "time-sensitive notification requested without entitlement; falling back to active")
                    content.interruptionLevel = .active
                }
            }
        }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let req = UNNotificationRequest(identifier: UUID().uuidString, content: content, trigger: nil)
        do {
            try await center.add(req)
            self.logger.debug("notification queued")
            return true
        } catch {
            self.logger.error("notification send failed: \(error.localizedDescription)")
            return false
        }
    }
}
