/*
 * AUTO ANNOTATION
 * File: apps/ios/Tests/GatewayEndpointIDTests.swift
 * Purpose: File in apps area for project orchestration/configuration/data.
 * Module area: Native apps (macOS / iOS / Android / shared app assets)
 * System effect: Change can influence native apps (macos / ios / android / shared app assets) and therefore affects build/runtime behavior indirectly.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import OpenClawKit
import Network
import Testing
@testable import OpenClaw

@Suite struct GatewayEndpointIDTests {
    @Test func stableIDForServiceDecodesAndNormalizesName() {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let endpoint = NWEndpoint.service(
            name: "OpenClaw\\032Gateway   \\032  Node\n",
            type: "_openclaw-gw._tcp",
            domain: "local.",
            interface: nil)

        #expect(GatewayEndpointID.stableID(endpoint) == "_openclaw-gw._tcp|local.|OpenClaw Gateway Node")
    }

    @Test func stableIDForNonServiceUsesEndpointDescription() {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let endpoint = NWEndpoint.hostPort(host: NWEndpoint.Host("127.0.0.1"), port: 4242)
        #expect(GatewayEndpointID.stableID(endpoint) == String(describing: endpoint))
    }

    @Test func prettyDescriptionDecodesBonjourEscapes() {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let endpoint = NWEndpoint.service(
            name: "OpenClaw\\032Gateway",
            type: "_openclaw-gw._tcp",
            domain: "local.",
            interface: nil)

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let pretty = GatewayEndpointID.prettyDescription(endpoint)
        #expect(pretty == BonjourEscapes.decode(String(describing: endpoint)))
        #expect(!pretty.localizedCaseInsensitiveContains("\\032"))
    }
}
