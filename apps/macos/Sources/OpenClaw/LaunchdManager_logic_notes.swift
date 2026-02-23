/*
 * AUTO ANNOTATION
 * File: apps/macos/Sources/OpenClaw/LaunchdManager.swift
 * Purpose: File in apps area for project orchestration/configuration/data.
 * Module area: Native apps (macOS / iOS / Android / shared app assets)
 * System effect: Change can influence native apps (macos / ios / android / shared app assets) and therefore affects build/runtime behavior indirectly.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import Foundation

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
enum LaunchdManager {
    private static func runLaunchctl(_ args: [String]) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let process = Process()
        process.launchPath = "/bin/launchctl"
        process.arguments = args
        try? process.run()
    }

    static func startOpenClaw() {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let userTarget = "gui/\(getuid())/\(launchdLabel)"
        self.runLaunchctl(["kickstart", "-k", userTarget])
    }

    static func stopOpenClaw() {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let userTarget = "gui/\(getuid())/\(launchdLabel)"
        self.runLaunchctl(["stop", userTarget])
    }
}
