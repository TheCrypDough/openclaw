/*
 * AUTO ANNOTATION
 * File: apps/macos/Sources/OpenClaw/PeekabooBridgeHostCoordinator.swift
 * Purpose: File in apps area for project orchestration/configuration/data.
 * Module area: Native apps (macOS / iOS / Android / shared app assets)
 * System effect: Change can influence native apps (macos / ios / android / shared app assets) and therefore affects build/runtime behavior indirectly.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import Foundation
import os
import PeekabooAutomationKit
import PeekabooBridge
import PeekabooFoundation
import Security

@MainActor
final class PeekabooBridgeHostCoordinator {
    static let shared = PeekabooBridgeHostCoordinator()

    private let logger = Logger(subsystem: "ai.openclaw", category: "PeekabooBridge")

    private var host: PeekabooBridgeHost?
    private var services: OpenClawPeekabooBridgeServices?
    private static var openclawSocketPath: String {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let fileManager = FileManager.default
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let base = fileManager.urls(for: .applicationSupportDirectory, in: .userDomainMask).first
            ?? fileManager.homeDirectoryForCurrentUser.appendingPathComponent("Library/Application Support")
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let directory = base.appendingPathComponent("OpenClaw", isDirectory: true)
        return directory.appendingPathComponent(PeekabooBridgeConstants.socketName, isDirectory: false).path
    }

    func setEnabled(_ enabled: Bool) async {
        if enabled {
            await self.startIfNeeded()
        } else {
            await self.stop()
        }
    }

    func stop() async {
        guard let host else { return }
        await host.stop()
        self.host = nil
        self.services = nil
        self.logger.info("PeekabooBridge host stopped")
    }

    private func startIfNeeded() async {
        guard self.host == nil else { return }

        var allowlistedTeamIDs: Set<String> = ["Y5PE65HELJ"]
        if let teamID = Self.currentTeamID() {
            allowlistedTeamIDs.insert(teamID)
        }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let allowlistedBundles: Set<String> = []

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let services = OpenClawPeekabooBridgeServices()
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let server = PeekabooBridgeServer(
            services: services,
            hostKind: .gui,
            allowlistedTeams: allowlistedTeamIDs,
            allowlistedBundles: allowlistedBundles)

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let host = PeekabooBridgeHost(
            socketPath: Self.openclawSocketPath,
            server: server,
            allowedTeamIDs: allowlistedTeamIDs,
            requestTimeoutSec: 10)

        self.services = services
        self.host = host

        await host.start()
        self.logger
            .info("PeekabooBridge host started at \(Self.openclawSocketPath, privacy: .public)")
    }

    private static func currentTeamID() -> String? {
        var code: SecCode?
        guard SecCodeCopySelf(SecCSFlags(), &code) == errSecSuccess,
              let code
        else {
            return nil
        }

        var staticCode: SecStaticCode?
        guard SecCodeCopyStaticCode(code, SecCSFlags(), &staticCode) == errSecSuccess,
              let staticCode
        else {
            return nil
        }

        var infoCF: CFDictionary?
        guard SecCodeCopySigningInformation(
            staticCode,
            SecCSFlags(rawValue: kSecCSSigningInformation),
            &infoCF) == errSecSuccess,
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
            let info = infoCF as? [String: Any]
        else {
            return nil
        }

        return info[kSecCodeInfoTeamIdentifier as String] as? String
    }
}

@MainActor
private final class OpenClawPeekabooBridgeServices: PeekabooBridgeServiceProviding {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    let permissions: PermissionsService
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    let screenCapture: any ScreenCaptureServiceProtocol
    let automation: any UIAutomationServiceProtocol
    let windows: any WindowManagementServiceProtocol
    let applications: any ApplicationServiceProtocol
    let menu: any MenuServiceProtocol
    let dock: any DockServiceProtocol
    let dialogs: any DialogServiceProtocol
    let snapshots: any SnapshotManagerProtocol

    init() {
        let logging = LoggingService(subsystem: "ai.openclaw.peekaboo")
        let feedbackClient: any AutomationFeedbackClient = NoopAutomationFeedbackClient()

        let snapshots = InMemorySnapshotManager(options: .init(
            snapshotValidityWindow: 600,
            maxSnapshots: 50,
            deleteArtifactsOnCleanup: false))
        let applications = ApplicationService(feedbackClient: feedbackClient)

        let screenCapture = ScreenCaptureService(loggingService: logging)

        self.permissions = PermissionsService()
        self.snapshots = snapshots
        self.applications = applications
        self.screenCapture = screenCapture
        self.automation = UIAutomationService(
            snapshotManager: snapshots,
            loggingService: logging,
            searchPolicy: .balanced,
            feedbackClient: feedbackClient)
        self.windows = WindowManagementService(applicationService: applications, feedbackClient: feedbackClient)
        self.menu = MenuService(applicationService: applications, feedbackClient: feedbackClient)
        self.dock = DockService(feedbackClient: feedbackClient)
        self.dialogs = DialogService(feedbackClient: feedbackClient)
    }
}
