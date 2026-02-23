/*
 * AUTO ANNOTATION
 * File: src/line/send.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { describe, expect, it } from "vitest";
import { createQuickReplyItems } from "./send.js";

describe("createQuickReplyItems", () => {
  it("limits items to 13 (LINE maximum)", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const labels = Array.from({ length: 20 }, (_, i) => `Option ${i + 1}`);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const quickReply = createQuickReplyItems(labels);

    expect(quickReply.items).toHaveLength(13);
  });
});
