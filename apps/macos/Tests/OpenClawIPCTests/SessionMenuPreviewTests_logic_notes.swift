/*
 * AUTO ANNOTATION
 * File: apps/macos/Tests/OpenClawIPCTests/SessionMenuPreviewTests.swift
 * Purpose: File in apps area for project orchestration/configuration/data.
 * Module area: Native apps (macOS / iOS / Android / shared app assets)
 * System effect: Change can influence native apps (macos / ios / android / shared app assets) and therefore affects build/runtime behavior indirectly.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import Foundation
import Testing
@testable import OpenClaw

@Suite(.serialized)
struct SessionMenuPreviewTests {
    @Test func loaderReturnsCachedItems() async {
        await SessionPreviewCache.shared._testReset()
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let items = [SessionPreviewItem(id: "1", role: .user, text: "Hi")]
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let snapshot = SessionMenuPreviewSnapshot(items: items, status: .ready)
        await SessionPreviewCache.shared._testSet(snapshot: snapshot, for: "main")

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let loaded = await SessionMenuPreviewLoader.load(sessionKey: "main", maxItems: 10)
        #expect(loaded.status == .ready)
        #expect(loaded.items.count == 1)
        #expect(loaded.items.first?.text == "Hi")
    }

    @Test func loaderReturnsEmptyWhenCachedEmpty() async {
        await SessionPreviewCache.shared._testReset()
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let snapshot = SessionMenuPreviewSnapshot(items: [], status: .empty)
        await SessionPreviewCache.shared._testSet(snapshot: snapshot, for: "main")

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let loaded = await SessionMenuPreviewLoader.load(sessionKey: "main", maxItems: 10)
        #expect(loaded.status == .empty)
        #expect(loaded.items.isEmpty)
    }
}
