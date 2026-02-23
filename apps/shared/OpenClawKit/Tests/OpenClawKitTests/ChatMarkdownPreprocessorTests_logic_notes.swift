/*
 * AUTO ANNOTATION
 * File: apps/shared/OpenClawKit/Tests/OpenClawKitTests/ChatMarkdownPreprocessorTests.swift
 * Purpose: File in apps area for project orchestration/configuration/data.
 * Module area: Native apps (macOS / iOS / Android / shared app assets)
 * System effect: Change can influence native apps (macos / ios / android / shared app assets) and therefore affects build/runtime behavior indirectly.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import Testing
@testable import OpenClawChatUI

@Suite("ChatMarkdownPreprocessor")
struct ChatMarkdownPreprocessorTests {
    @Test func extractsDataURLImages() {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let base64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIHWP4////GQAJ+wP/2hN8NwAAAABJRU5ErkJggg=="
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let markdown = """
        Hello

        ![Pixel](data:image/png;base64,\(base64))
        """

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let result = ChatMarkdownPreprocessor.preprocess(markdown: markdown)

        #expect(result.cleaned == "Hello")
        #expect(result.images.count == 1)
        #expect(result.images.first?.image != nil)
    }

    @Test func stripsInboundUntrustedContextBlocks() {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let markdown = """
        Conversation info (untrusted metadata):
        ```json
        {
          "message_id": "123",
          "sender": "openclaw-ios"
        }
        ```

        Sender (untrusted metadata):
        ```json
        {
          "label": "Razor"
        }
        ```

        Razor?
        """

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let result = ChatMarkdownPreprocessor.preprocess(markdown: markdown)

        #expect(result.cleaned == "Razor?")
    }

    @Test func stripsSingleConversationInfoBlock() {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let text = """
        Conversation info (untrusted metadata):
        ```json
        {"x": 1}
        ```

        User message
        """

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let result = ChatMarkdownPreprocessor.preprocess(markdown: text)

        #expect(result.cleaned == "User message")
    }

    @Test func stripsAllKnownInboundMetadataSentinels() {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let sentinels = [
            "Conversation info (untrusted metadata):",
            "Sender (untrusted metadata):",
            "Thread starter (untrusted, for context):",
            "Replied message (untrusted, for context):",
            "Forwarded message context (untrusted metadata):",
            "Chat history since last reply (untrusted, for context):",
        ]

        for sentinel in sentinels {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
            let markdown = """
            \(sentinel)
            ```json
            {"x": 1}
            ```

            User content
            """
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
            let result = ChatMarkdownPreprocessor.preprocess(markdown: markdown)
            #expect(result.cleaned == "User content")
        }
    }

    @Test func preservesNonMetadataJsonFence() {
        let markdown = """
        Here is some json:
        ```json
        {"x": 1}
        ```
        """

        let result = ChatMarkdownPreprocessor.preprocess(markdown: markdown)

        #expect(result.cleaned == markdown.trimmingCharacters(in: .whitespacesAndNewlines))
    }

    @Test func stripsLeadingTimestampPrefix() {
        let markdown = """
        [Fri 2026-02-20 18:45 GMT+1] How's it going?
        """

        let result = ChatMarkdownPreprocessor.preprocess(markdown: markdown)

        #expect(result.cleaned == "How's it going?")
    }
}
