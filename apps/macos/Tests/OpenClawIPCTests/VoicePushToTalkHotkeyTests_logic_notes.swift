/*
 * AUTO ANNOTATION
 * File: apps/macos/Tests/OpenClawIPCTests/VoicePushToTalkHotkeyTests.swift
 * Purpose: File in apps area for project orchestration/configuration/data.
 * Module area: Native apps (macOS / iOS / Android / shared app assets)
 * System effect: Change can influence native apps (macos / ios / android / shared app assets) and therefore affects build/runtime behavior indirectly.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import AppKit
import Testing
@testable import OpenClaw

@Suite(.serialized) struct VoicePushToTalkHotkeyTests {
    actor Counter {
        private(set) var began = 0
        private(set) var ended = 0

        func incBegin() { self.began += 1 }
        func incEnd() { self.ended += 1 }
        func snapshot() -> (began: Int, ended: Int) { (self.began, self.ended) }
    }

    @Test func beginEndFiresOncePerHold() async {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let counter = Counter()
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let hotkey = VoicePushToTalkHotkey(
            beginAction: { await counter.incBegin() },
            endAction: { await counter.incEnd() })

        await MainActor.run {
            hotkey._testUpdateModifierState(keyCode: 61, modifierFlags: [.option])
            hotkey._testUpdateModifierState(keyCode: 61, modifierFlags: [.option])
            hotkey._testUpdateModifierState(keyCode: 61, modifierFlags: [])
        }

        for _ in 0..<50 {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
            let snap = await counter.snapshot()
            if snap.began == 1, snap.ended == 1 { break }
            try? await Task.sleep(nanoseconds: 10_000_000)
        }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let snap = await counter.snapshot()
        #expect(snap.began == 1)
        #expect(snap.ended == 1)
    }
}
