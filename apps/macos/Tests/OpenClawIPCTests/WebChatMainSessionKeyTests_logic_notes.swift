/*
 * AUTO ANNOTATION
 * File: apps/macos/Tests/OpenClawIPCTests/WebChatMainSessionKeyTests.swift
 * Purpose: File in apps area for project orchestration/configuration/data.
 * Module area: Native apps (macOS / iOS / Android / shared app assets)
 * System effect: Change can influence native apps (macos / ios / android / shared app assets) and therefore affects build/runtime behavior indirectly.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import Foundation
import Testing
@testable import OpenClaw

@Suite struct WebChatMainSessionKeyTests {
    @Test func configGetSnapshotMainKeyFallsBackToMainWhenMissing() throws {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let json = """
        {
          "path": "/Users/pete/.openclaw/openclaw.json",
          "exists": true,
          "raw": null,
          "parsed": {},
          "valid": true,
          "config": {},
          "issues": []
        }
        """
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let key = try GatewayConnection.mainSessionKey(fromConfigGetData: Data(json.utf8))
        #expect(key == "main")
    }

    @Test func configGetSnapshotMainKeyTrimsAndUsesValue() throws {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let json = """
        {
          "path": "/Users/pete/.openclaw/openclaw.json",
          "exists": true,
          "raw": null,
          "parsed": {},
          "valid": true,
          "config": { "session": { "mainKey": "  primary  " } },
          "issues": []
        }
        """
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let key = try GatewayConnection.mainSessionKey(fromConfigGetData: Data(json.utf8))
        #expect(key == "main")
    }

    @Test func configGetSnapshotMainKeyFallsBackWhenEmptyOrWhitespace() throws {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let json = """
        {
          "config": { "session": { "mainKey": "   " } }
        }
        """
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let key = try GatewayConnection.mainSessionKey(fromConfigGetData: Data(json.utf8))
        #expect(key == "main")
    }

    @Test func configGetSnapshotMainKeyFallsBackWhenConfigNull() throws {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let json = """
        {
          "config": null
        }
        """
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let key = try GatewayConnection.mainSessionKey(fromConfigGetData: Data(json.utf8))
        #expect(key == "main")
    }

    @Test func configGetSnapshotUsesGlobalScope() throws {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let json = """
        {
          "config": { "session": { "scope": "global" } }
        }
        """
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let key = try GatewayConnection.mainSessionKey(fromConfigGetData: Data(json.utf8))
        #expect(key == "global")
    }
}
