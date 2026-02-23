/*
 * AUTO ANNOTATION
 * File: apps/shared/OpenClawKit/Tests/OpenClawKitTests/BonjourEscapesTests.swift
 * Purpose: File in apps area for project orchestration/configuration/data.
 * Module area: Native apps (macOS / iOS / Android / shared app assets)
 * System effect: Change can influence native apps (macos / ios / android / shared app assets) and therefore affects build/runtime behavior indirectly.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import OpenClawKit
import Testing

@Suite struct BonjourEscapesTests {
    @Test func decodePassThrough() {
        #expect(BonjourEscapes.decode("hello") == "hello")
        #expect(BonjourEscapes.decode("") == "")
    }

    @Test func decodeSpaces() {
        #expect(BonjourEscapes.decode("OpenClaw\\032Gateway") == "OpenClaw Gateway")
    }

    @Test func decodeMultipleEscapes() {
        #expect(BonjourEscapes.decode("A\\038B\\047C\\032D") == "A&B/C D")
    }

    @Test func decodeIgnoresInvalidEscapeSequences() {
        #expect(BonjourEscapes.decode("Hello\\03World") == "Hello\\03World")
        #expect(BonjourEscapes.decode("Hello\\XYZWorld") == "Hello\\XYZWorld")
    }

    @Test func decodeUsesDecimalUnicodeScalarValue() {
        #expect(BonjourEscapes.decode("Hello\\065World") == "HelloAWorld")
    }
}
