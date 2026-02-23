/*
 * AUTO ANNOTATION
 * File: apps/ios/WatchExtension/Sources/OpenClawWatchApp.swift
 * Purpose: File in apps area for project orchestration/configuration/data.
 * Module area: Native apps (macOS / iOS / Android / shared app assets)
 * System effect: Change can influence native apps (macos / ios / android / shared app assets) and therefore affects build/runtime behavior indirectly.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import SwiftUI

@main
struct OpenClawWatchApp: App {
    @State private var inboxStore = WatchInboxStore()
    @State private var receiver: WatchConnectivityReceiver?

    var body: some Scene {
        WindowGroup {
            WatchInboxView(store: self.inboxStore) { action in
                guard let receiver = self.receiver else { return }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
                let draft = self.inboxStore.makeReplyDraft(action: action)
                self.inboxStore.markReplySending(actionLabel: action.label)
                Task { @MainActor in
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
                    let result = await receiver.sendReply(draft)
                    self.inboxStore.markReplyResult(result, actionLabel: action.label)
                }
            }
                .task {
                    if self.receiver == nil {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
                        let receiver = WatchConnectivityReceiver(store: self.inboxStore)
                        receiver.activate()
                        self.receiver = receiver
                    }
                }
        }
    }
}
