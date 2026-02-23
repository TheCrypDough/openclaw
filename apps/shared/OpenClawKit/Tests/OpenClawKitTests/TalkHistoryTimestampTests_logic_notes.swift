/*
 * AUTO ANNOTATION
 * File: apps/shared/OpenClawKit/Tests/OpenClawKitTests/TalkHistoryTimestampTests.swift
 * Purpose: File in apps area for project orchestration/configuration/data.
 * Module area: Native apps (macOS / iOS / Android / shared app assets)
 * System effect: Change can influence native apps (macos / ios / android / shared app assets) and therefore affects build/runtime behavior indirectly.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import XCTest
@testable import OpenClawKit

final class TalkHistoryTimestampTests: XCTestCase {
    func testSecondsTimestampsAreAcceptedWithSmallTolerance() {
        XCTAssertTrue(TalkHistoryTimestamp.isAfter(999.6, sinceSeconds: 1000))
        XCTAssertFalse(TalkHistoryTimestamp.isAfter(999.4, sinceSeconds: 1000))
    }

    func testMillisecondsTimestampsAreAcceptedWithSmallTolerance() {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let sinceSeconds = 1_700_000_000.0
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let sinceMs = sinceSeconds * 1000
        XCTAssertTrue(TalkHistoryTimestamp.isAfter(sinceMs - 500, sinceSeconds: sinceSeconds))
        XCTAssertFalse(TalkHistoryTimestamp.isAfter(sinceMs - 501, sinceSeconds: sinceSeconds))
    }
}
