/*
 * AUTO ANNOTATION
 * File: apps/shared/OpenClawKit/Tests/OpenClawKitTests/ToolResultTextFormatterTests.swift
 * Purpose: File in apps area for project orchestration/configuration/data.
 * Module area: Native apps (macOS / iOS / Android / shared app assets)
 * System effect: Change can influence native apps (macos / ios / android / shared app assets) and therefore affects build/runtime behavior indirectly.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import Testing
@testable import OpenClawChatUI

@Suite("ToolResultTextFormatter")
struct ToolResultTextFormatterTests {
    @Test func leavesPlainTextUntouched() {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let result = ToolResultTextFormatter.format(text: "All good", toolName: "nodes")
        #expect(result == "All good")
    }

    @Test func summarizesNodesListJSON() {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let json = """
        {
          "ts": 1771610031380,
          "nodes": [
            {
              "displayName": "iPhone 16 Pro Max",
              "connected": true,
              "platform": "ios"
            }
          ]
        }
        """

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let result = ToolResultTextFormatter.format(text: json, toolName: "nodes")
        #expect(result.contains("1 node found."))
        #expect(result.contains("iPhone 16 Pro Max"))
        #expect(result.contains("connected"))
    }

    @Test func summarizesErrorJSONAndDropsAgentPrefix() {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let json = """
        {
          "status": "error",
          "tool": "nodes",
          "error": "agent=main node=iPhone gateway=default action=invoke: pairing required"
        }
        """

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let result = ToolResultTextFormatter.format(text: json, toolName: "nodes")
        #expect(result == "Error: pairing required")
    }

    @Test func suppressesUnknownStructuredPayload() {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let json = """
        {
          "foo": "bar"
        }
        """

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let result = ToolResultTextFormatter.format(text: json, toolName: "nodes")
        #expect(result.isEmpty)
    }
}
