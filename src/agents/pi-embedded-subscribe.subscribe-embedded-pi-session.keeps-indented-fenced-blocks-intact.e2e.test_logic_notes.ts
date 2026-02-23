/*
 * AUTO ANNOTATION
 * File: src/agents/pi-embedded-subscribe.subscribe-embedded-pi-session.keeps-indented-fenced-blocks-intact.e2e.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { describe, expect, it, vi } from "vitest";
import {
  createParagraphChunkedBlockReplyHarness,
  emitAssistantTextDeltaAndEnd,
  extractTextPayloads,
} from "./pi-embedded-subscribe.e2e-harness.js";

describe("subscribeEmbeddedPiSession", () => {
  it("keeps indented fenced blocks intact", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const onBlockReply = vi.fn();
    const { emit } = createParagraphChunkedBlockReplyHarness({
      onBlockReply,
      chunking: {
        minChars: 5,
        maxChars: 30,
      },
    });

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const text = "Intro\n\n  ```js\n  const x = 1;\n  ```\n\nOutro";

    emitAssistantTextDeltaAndEnd({ emit, text });

    expect(onBlockReply).toHaveBeenCalledTimes(3);
    expect(onBlockReply.mock.calls[1][0].text).toBe("  ```js\n  const x = 1;\n  ```");
  });
  it("accepts longer fence markers for close", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const onBlockReply = vi.fn();
    const { emit } = createParagraphChunkedBlockReplyHarness({
      onBlockReply,
      chunking: {
        minChars: 10,
        maxChars: 30,
      },
    });

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const text = "Intro\n\n````md\nline1\nline2\n````\n\nOutro";

    emitAssistantTextDeltaAndEnd({ emit, text });

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const payloadTexts = extractTextPayloads(onBlockReply.mock.calls);
    expect(payloadTexts.length).toBeGreaterThan(0);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const combined = payloadTexts.join(" ").replace(/\s+/g, " ").trim();
    expect(combined).toContain("````md");
    expect(combined).toContain("line1");
    expect(combined).toContain("line2");
    expect(combined).toContain("````");
    expect(combined).toContain("Intro");
    expect(combined).toContain("Outro");
  });
});
