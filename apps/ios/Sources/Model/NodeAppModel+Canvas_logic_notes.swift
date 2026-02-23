/*
 * AUTO ANNOTATION
 * File: apps/ios/Sources/Model/NodeAppModel+Canvas.swift
 * Purpose: File in apps area for project orchestration/configuration/data.
 * Module area: Native apps (macOS / iOS / Android / shared app assets)
 * System effect: Change can influence native apps (macos / ios / android / shared app assets) and therefore affects build/runtime behavior indirectly.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import Foundation
import Network
import os

extension NodeAppModel {
    func _test_resolveA2UIHostURL() async -> String? {
        await self.resolveA2UIHostURL()
    }

    func resolveA2UIHostURL() async -> String? {
        guard let raw = await self.gatewaySession.currentCanvasHostUrl() else { return nil }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let trimmed = raw.trimmingCharacters(in: .whitespacesAndNewlines)
        guard !trimmed.isEmpty, let base = URL(string: trimmed) else { return nil }
        if let host = base.host, Self.isLoopbackHost(host) {
            return nil
        }
        return base.appendingPathComponent("__openclaw__/a2ui/").absoluteString + "?platform=ios"
    }

    private static func isLoopbackHost(_ host: String) -> Bool {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let normalized = host.trimmingCharacters(in: .whitespacesAndNewlines).lowercased()
        if normalized.isEmpty { return true }
        if normalized == "localhost" || normalized == "::1" || normalized == "0.0.0.0" {
            return true
        }
        if normalized == "127.0.0.1" || normalized.hasPrefix("127.") {
            return true
        }
        return false
    }

    func showA2UIOnConnectIfNeeded() async {
        guard let a2uiUrl = await self.resolveA2UIHostURL() else {
            await MainActor.run {
                self.lastAutoA2uiURL = nil
                self.screen.showDefaultCanvas()
            }
            return
        }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let current = self.screen.urlString.trimmingCharacters(in: .whitespacesAndNewlines)
        if current.isEmpty || current == self.lastAutoA2uiURL {
            // Avoid navigating the WKWebView to an unreachable host: it leaves a persistent
            // "could not connect to the server" overlay even when the gateway is connected.
            if let url = URL(string: a2uiUrl),
               await Self.probeTCP(url: url, timeoutSeconds: 2.5)
            {
                self.screen.navigate(to: a2uiUrl)
                self.lastAutoA2uiURL = a2uiUrl
            } else {
                self.lastAutoA2uiURL = nil
                self.screen.showDefaultCanvas()
            }
        }
    }

    func showLocalCanvasOnDisconnect() {
        self.lastAutoA2uiURL = nil
        self.screen.showDefaultCanvas()
    }

    private static func probeTCP(url: URL, timeoutSeconds: Double) async -> Bool {
        guard let host = url.host, !host.isEmpty else { return false }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let portInt = url.port ?? ((url.scheme ?? "").lowercased() == "wss" ? 443 : 80)
        return await TCPProbe.probe(
            host: host,
            port: portInt,
            timeoutSeconds: timeoutSeconds,
            queueLabel: "a2ui.preflight")
    }
}
