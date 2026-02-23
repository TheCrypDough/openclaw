/*
 * AUTO ANNOTATION
 * File: apps/shared/OpenClawKit/Tests/OpenClawKitTests/DeepLinksSecurityTests.swift
 * Purpose: File in apps area for project orchestration/configuration/data.
 * Module area: Native apps (macOS / iOS / Android / shared app assets)
 * System effect: Change can influence native apps (macos / ios / android / shared app assets) and therefore affects build/runtime behavior indirectly.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import Foundation
import OpenClawKit
import Testing

@Suite struct DeepLinksSecurityTests {
    @Test func gatewayDeepLinkRejectsInsecureNonLoopbackWs() {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let url = URL(
            string: "openclaw://gateway?host=attacker.example&port=18789&tls=0&token=abc")!
        #expect(DeepLinkParser.parse(url) == nil)
    }

    @Test func gatewayDeepLinkRejectsInsecurePrefixBypassHost() {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let url = URL(
            string: "openclaw://gateway?host=127.attacker.example&port=18789&tls=0&token=abc")!
        #expect(DeepLinkParser.parse(url) == nil)
    }

    @Test func gatewayDeepLinkAllowsLoopbackWs() {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let url = URL(
            string: "openclaw://gateway?host=127.0.0.1&port=18789&tls=0&token=abc")!
        #expect(
            DeepLinkParser.parse(url) == .gateway(
                .init(host: "127.0.0.1", port: 18789, tls: false, token: "abc", password: nil)))
    }

    @Test func setupCodeRejectsInsecureNonLoopbackWs() {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let payload = #"{"url":"ws://attacker.example:18789","token":"tok"}"#
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let encoded = Data(payload.utf8)
            .base64EncodedString()
            .replacingOccurrences(of: "+", with: "-")
            .replacingOccurrences(of: "/", with: "_")
            .replacingOccurrences(of: "=", with: "")
        #expect(GatewayConnectDeepLink.fromSetupCode(encoded) == nil)
    }

    @Test func setupCodeRejectsInsecurePrefixBypassHost() {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let payload = #"{"url":"ws://127.attacker.example:18789","token":"tok"}"#
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let encoded = Data(payload.utf8)
            .base64EncodedString()
            .replacingOccurrences(of: "+", with: "-")
            .replacingOccurrences(of: "/", with: "_")
            .replacingOccurrences(of: "=", with: "")
        #expect(GatewayConnectDeepLink.fromSetupCode(encoded) == nil)
    }

    @Test func setupCodeAllowsLoopbackWs() {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let payload = #"{"url":"ws://127.0.0.1:18789","token":"tok"}"#
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let encoded = Data(payload.utf8)
            .base64EncodedString()
            .replacingOccurrences(of: "+", with: "-")
            .replacingOccurrences(of: "/", with: "_")
            .replacingOccurrences(of: "=", with: "")
        #expect(
            GatewayConnectDeepLink.fromSetupCode(encoded) == .init(
                host: "127.0.0.1",
                port: 18789,
                tls: false,
                token: "tok",
                password: nil))
    }
}
