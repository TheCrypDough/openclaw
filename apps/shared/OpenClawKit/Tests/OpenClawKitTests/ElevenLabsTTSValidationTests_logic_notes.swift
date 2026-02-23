/*
 * AUTO ANNOTATION
 * File: apps/shared/OpenClawKit/Tests/OpenClawKitTests/ElevenLabsTTSValidationTests.swift
 * Purpose: File in apps area for project orchestration/configuration/data.
 * Module area: Native apps (macOS / iOS / Android / shared app assets)
 * System effect: Change can influence native apps (macos / ios / android / shared app assets) and therefore affects build/runtime behavior indirectly.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import XCTest
@testable import OpenClawKit

final class ElevenLabsTTSValidationTests: XCTestCase {
    func testValidatedOutputFormatAllowsOnlyMp3Presets() {
        XCTAssertEqual(ElevenLabsTTSClient.validatedOutputFormat("mp3_44100_128"), "mp3_44100_128")
        XCTAssertEqual(ElevenLabsTTSClient.validatedOutputFormat("pcm_16000"), "pcm_16000")
    }

    func testValidatedLanguageAcceptsTwoLetterCodes() {
        XCTAssertEqual(ElevenLabsTTSClient.validatedLanguage("EN"), "en")
        XCTAssertNil(ElevenLabsTTSClient.validatedLanguage("eng"))
    }

    func testValidatedNormalizeAcceptsKnownValues() {
        XCTAssertEqual(ElevenLabsTTSClient.validatedNormalize("AUTO"), "auto")
        XCTAssertNil(ElevenLabsTTSClient.validatedNormalize("maybe"))
    }
}
