# AUTOPLACEHOLDER_ANNOTATION: apps/macos/Sources/OpenClaw/ConfigFileWatcher.swift
# Purpose: File in apps area for project orchestration/configuration/data.
# Area: Native apps (macOS / iOS / Android / shared app assets)
# System effect: Change can influence native apps (macos / ios / android / shared app assets) and therefore affects build/runtime behavior indirectly.
import Foundation

final class ConfigFileWatcher: @unchecked Sendable {
    private let url: URL
    private let watchedDir: URL
    private let targetPath: String
    private let targetName: String
    private let watcher: CoalescingFSEventsWatcher

    init(url: URL, onChange: @escaping () -> Void) {
        self.url = url
        self.watchedDir = url.deletingLastPathComponent()
        self.targetPath = url.path
        self.targetName = url.lastPathComponent
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let watchedDirPath = self.watchedDir.path
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let targetPath = self.targetPath
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let targetName = self.targetName
        self.watcher = CoalescingFSEventsWatcher(
            paths: [watchedDirPath],
            queueLabel: "ai.openclaw.configwatcher",
            shouldNotify: { _, eventPaths in
                guard let eventPaths else { return true }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
                let paths = unsafeBitCast(eventPaths, to: NSArray.self)
                for case let path as String in paths {
                    if path == targetPath { return true }
                    if path.hasSuffix("/\(targetName)") { return true }
                    if path == watchedDirPath { return true }
                }
                return false
            },
            onChange: onChange)
    }

    deinit {
        self.stop()
    }

    func start() {
        self.watcher.start()
    }

    func stop() {
        self.watcher.stop()
    }
}
