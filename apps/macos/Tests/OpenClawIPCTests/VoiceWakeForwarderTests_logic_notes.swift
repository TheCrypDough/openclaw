/*
 * AUTO ANNOTATION
 * File: apps/macos/Tests/OpenClawIPCTests/VoiceWakeForwarderTests.swift
 * Purpose: File in apps area for project orchestration/configuration/data.
 * Module area: Native apps (macOS / iOS / Android / shared app assets)
 * System effect: Change can influence native apps (macos / ios / android / shared app assets) and therefore affects build/runtime behavior indirectly.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import Testing
@testable import OpenClaw

@Suite(.serialized) struct VoiceWakeForwarderTests {
    @Test func prefixedTranscriptUsesMachineName() {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let transcript = "hello world"
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let prefixed = VoiceWakeForwarder.prefixedTranscript(transcript, machineName: "My-Mac")

        #expect(prefixed.starts(with: "User talked via voice recognition on"))
        #expect(prefixed.contains("My-Mac"))
        #expect(prefixed.hasSuffix("\n\nhello world"))
    }

    @Test func forwardOptionsDefaults() {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let opts = VoiceWakeForwarder.ForwardOptions()
        #expect(opts.sessionKey == "main")
        #expect(opts.thinking == "low")
        #expect(opts.deliver == true)
        #expect(opts.to == nil)
        #expect(opts.channel == .last)
    }
}
