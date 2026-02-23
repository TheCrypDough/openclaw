/*
 * AUTO ANNOTATION
 * File: apps/macos/Sources/OpenClaw/CoalescingFSEventsWatcher.swift
 * Purpose: File in apps area for project orchestration/configuration/data.
 * Module area: Native apps (macOS / iOS / Android / shared app assets)
 * System effect: Change can influence native apps (macos / ios / android / shared app assets) and therefore affects build/runtime behavior indirectly.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import CoreServices
import Foundation

final class CoalescingFSEventsWatcher: @unchecked Sendable {
    private let queue: DispatchQueue
    private var stream: FSEventStreamRef?
    private var pending = false

    private let paths: [String]
    private let shouldNotify: (Int, UnsafeMutableRawPointer?) -> Bool
    private let onChange: () -> Void
    private let coalesceDelay: TimeInterval

    init(
        paths: [String],
        queueLabel: String,
        coalesceDelay: TimeInterval = 0.12,
        shouldNotify: @escaping (Int, UnsafeMutableRawPointer?) -> Bool = { _, _ in true },
        onChange: @escaping () -> Void)
    {
        self.paths = paths
        self.queue = DispatchQueue(label: queueLabel)
        self.coalesceDelay = coalesceDelay
        self.shouldNotify = shouldNotify
        self.onChange = onChange
    }

    deinit {
        self.stop()
    }

    func start() {
        guard self.stream == nil else { return }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let retainedSelf = Unmanaged.passRetained(self)
        var context = FSEventStreamContext(
            version: 0,
            info: retainedSelf.toOpaque(),
            retain: nil,
            release: { pointer in
                guard let pointer else { return }
                Unmanaged<CoalescingFSEventsWatcher>.fromOpaque(pointer).release()
            },
            copyDescription: nil)

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let paths = self.paths as CFArray
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let flags = FSEventStreamCreateFlags(
            kFSEventStreamCreateFlagFileEvents |
                kFSEventStreamCreateFlagUseCFTypes |
                kFSEventStreamCreateFlagNoDefer)

        guard let stream = FSEventStreamCreate(
            kCFAllocatorDefault,
            Self.callback,
            &context,
            paths,
            FSEventStreamEventId(kFSEventStreamEventIdSinceNow),
            0.05,
            flags)
        else {
            retainedSelf.release()
            return
        }

        self.stream = stream
        FSEventStreamSetDispatchQueue(stream, self.queue)
        if FSEventStreamStart(stream) == false {
            self.stream = nil
            FSEventStreamSetDispatchQueue(stream, nil)
            FSEventStreamInvalidate(stream)
            FSEventStreamRelease(stream)
        }
    }

    func stop() {
        guard let stream = self.stream else { return }
        self.stream = nil
        FSEventStreamStop(stream)
        FSEventStreamSetDispatchQueue(stream, nil)
        FSEventStreamInvalidate(stream)
        FSEventStreamRelease(stream)
    }
}

extension CoalescingFSEventsWatcher {
    private static let callback: FSEventStreamCallback = { _, info, numEvents, eventPaths, eventFlags, _ in
        guard let info else { return }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let watcher = Unmanaged<CoalescingFSEventsWatcher>.fromOpaque(info).takeUnretainedValue()
        watcher.handleEvents(numEvents: numEvents, eventPaths: eventPaths, eventFlags: eventFlags)
    }

    private func handleEvents(
        numEvents: Int,
        eventPaths: UnsafeMutableRawPointer?,
        eventFlags: UnsafePointer<FSEventStreamEventFlags>?)
    {
        guard numEvents > 0 else { return }
        guard eventFlags != nil else { return }
        guard self.shouldNotify(numEvents, eventPaths) else { return }

        // Coalesce rapid changes (common during builds/atomic saves).
        if self.pending { return }
        self.pending = true
        self.queue.asyncAfter(deadline: .now() + self.coalesceDelay) { [weak self] in
            guard let self else { return }
            self.pending = false
            self.onChange()
        }
    }
}
