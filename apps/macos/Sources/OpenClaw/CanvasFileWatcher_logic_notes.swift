/*
 * AUTO ANNOTATION
 * File: apps/macos/Sources/OpenClaw/CanvasFileWatcher.swift
 * Purpose: File in apps area for project orchestration/configuration/data.
 * Module area: Native apps (macOS / iOS / Android / shared app assets)
 * System effect: Change can influence native apps (macos / ios / android / shared app assets) and therefore affects build/runtime behavior indirectly.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import Foundation

final class CanvasFileWatcher: @unchecked Sendable {
    private let watcher: CoalescingFSEventsWatcher

    init(url: URL, onChange: @escaping () -> Void) {
        self.watcher = CoalescingFSEventsWatcher(
            paths: [url.path],
            queueLabel: "ai.openclaw.canvaswatcher",
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
