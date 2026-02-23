/*
 * AUTO ANNOTATION
 * File: src/agents/pi-embedded-subscribe.subscribe-embedded-pi-session.streams-soft-chunks-paragraph-preference.e2e.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { describe, expect, it, vi } from "vitest";
import {
  createParagraphChunkedBlockReplyHarness,
  emitAssistantTextDeltaAndEnd,
} from "./pi-embedded-subscribe.e2e-harness.js";

describe("subscribeEmbeddedPiSession", () => {
  it("streams soft chunks with paragraph preference", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const onBlockReply = vi.fn();
    const { emit, subscription } = createParagraphChunkedBlockReplyHarness({
      onBlockReply,
      chunking: {
        minChars: 5,
        maxChars: 25,
      },
    });

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const text = "First block line\n\nSecond block line";

    emitAssistantTextDeltaAndEnd({ emit, text });

    expect(onBlockReply).toHaveBeenCalledTimes(2);
    expect(onBlockReply.mock.calls[0][0].text).toBe("First block line");
    expect(onBlockReply.mock.calls[1][0].text).toBe("Second block line");
    expect(subscription.assistantTexts).toEqual(["First block line", "Second block line"]);
  });
  it("avoids splitting inside fenced code blocks", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const onBlockReply = vi.fn();
    const { emit } = createParagraphChunkedBlockReplyHarness({
      onBlockReply,
      chunking: {
        minChars: 5,
        maxChars: 25,
      },
    });

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const text = "Intro\n\n```bash\nline1\nline2\n```\n\nOutro";

    emitAssistantTextDeltaAndEnd({ emit, text });

    expect(onBlockReply).toHaveBeenCalledTimes(3);
    expect(onBlockReply.mock.calls[0][0].text).toBe("Intro");
    expect(onBlockReply.mock.calls[1][0].text).toBe("```bash\nline1\nline2\n```");
    expect(onBlockReply.mock.calls[2][0].text).toBe("Outro");
  });
});
