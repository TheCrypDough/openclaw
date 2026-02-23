/*
 * AUTO ANNOTATION
 * File: apps/macos/Tests/OpenClawIPCTests/TailscaleIntegrationSectionTests.swift
 * Purpose: File in apps area for project orchestration/configuration/data.
 * Module area: Native apps (macOS / iOS / Android / shared app assets)
 * System effect: Change can influence native apps (macos / ios / android / shared app assets) and therefore affects build/runtime behavior indirectly.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import SwiftUI
import Testing
@testable import OpenClaw

@Suite(.serialized)
@MainActor
struct TailscaleIntegrationSectionTests {
    @Test func tailscaleSectionBuildsBodyWhenNotInstalled() {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let service = TailscaleService(isInstalled: false, isRunning: false, statusError: "not installed")
        var view = TailscaleIntegrationSection(connectionMode: .local, isPaused: false)
        view.setTestingService(service)
        view.setTestingState(mode: "off", requireCredentials: false, statusMessage: "Idle")
        _ = view.body
    }

    @Test func tailscaleSectionBuildsBodyForServeMode() {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let service = TailscaleService(
            isInstalled: true,
            isRunning: true,
            tailscaleHostname: "openclaw.tailnet.ts.net",
            tailscaleIP: "100.64.0.1")
        var view = TailscaleIntegrationSection(connectionMode: .local, isPaused: false)
        view.setTestingService(service)
        view.setTestingState(
            mode: "serve",
            requireCredentials: true,
            password: "secret",
            statusMessage: "Running")
        _ = view.body
    }

    @Test func tailscaleSectionBuildsBodyForFunnelMode() {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let service = TailscaleService(
            isInstalled: true,
            isRunning: false,
            tailscaleHostname: nil,
            tailscaleIP: nil,
            statusError: "not running")
        var view = TailscaleIntegrationSection(connectionMode: .remote, isPaused: false)
        view.setTestingService(service)
        view.setTestingState(
            mode: "funnel",
            requireCredentials: false,
            statusMessage: "Needs start",
            validationMessage: "Invalid token")
        _ = view.body
    }
}
