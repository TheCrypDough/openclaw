/*
 * AUTO ANNOTATION
 * File: apps/macos/Tests/OpenClawIPCTests/PermissionManagerLocationTests.swift
 * Purpose: File in apps area for project orchestration/configuration/data.
 * Module area: Native apps (macOS / iOS / Android / shared app assets)
 * System effect: Change can influence native apps (macos / ios / android / shared app assets) and therefore affects build/runtime behavior indirectly.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import CoreLocation
import Testing

@testable import OpenClaw

@Suite("PermissionManager Location")
struct PermissionManagerLocationTests {
    @Test("authorizedAlways counts for both modes")
    func authorizedAlwaysCountsForBothModes() {
        #expect(PermissionManager.isLocationAuthorized(status: .authorizedAlways, requireAlways: false))
        #expect(PermissionManager.isLocationAuthorized(status: .authorizedAlways, requireAlways: true))
    }

    @Test("other statuses not authorized")
    func otherStatusesNotAuthorized() {
        #expect(!PermissionManager.isLocationAuthorized(status: .notDetermined, requireAlways: false))
        #expect(!PermissionManager.isLocationAuthorized(status: .denied, requireAlways: false))
        #expect(!PermissionManager.isLocationAuthorized(status: .restricted, requireAlways: false))
    }
}
