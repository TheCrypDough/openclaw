/*
 * AUTO ANNOTATION
 * File: src/channels/plugins/outbound/imessage.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { describe, expect, it, vi } from "vitest";
import type { OpenClawConfig } from "../../../config/config.js";
import { imessageOutbound } from "./imessage.js";

describe("imessageOutbound", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const cfg: OpenClawConfig = {
    channels: {
      imessage: {
        mediaMaxMb: 2,
      },
    },
  };

  it("passes replyToId through sendText", async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const sendIMessage = vi.fn().mockResolvedValue({ messageId: "text-1" });
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const sendText = imessageOutbound.sendText;
    expect(sendText).toBeDefined();

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const result = await sendText!({
      cfg,
      to: "chat_id:123",
      text: "hello",
      accountId: "default",
      replyToId: "msg-123",
      deps: { sendIMessage },
    });

    expect(sendIMessage).toHaveBeenCalledWith(
      "chat_id:123",
      "hello",
      expect.objectContaining({
        replyToId: "msg-123",
        accountId: "default",
        maxBytes: 2 * 1024 * 1024,
      }),
    );
    expect(result).toEqual({ channel: "imessage", messageId: "text-1" });
  });

  it("passes replyToId through sendMedia", async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const sendIMessage = vi.fn().mockResolvedValue({ messageId: "media-1" });
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const sendMedia = imessageOutbound.sendMedia;
    expect(sendMedia).toBeDefined();

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const result = await sendMedia!({
      cfg,
      to: "chat_id:123",
      text: "caption",
      mediaUrl: "https://example.com/file.jpg",
      mediaLocalRoots: ["/tmp"],
      accountId: "acct-1",
      replyToId: "msg-456",
      deps: { sendIMessage },
    });

    expect(sendIMessage).toHaveBeenCalledWith(
      "chat_id:123",
      "caption",
      expect.objectContaining({
        mediaUrl: "https://example.com/file.jpg",
        mediaLocalRoots: ["/tmp"],
        replyToId: "msg-456",
        accountId: "acct-1",
        maxBytes: 2 * 1024 * 1024,
      }),
    );
    expect(result).toEqual({ channel: "imessage", messageId: "media-1" });
  });
});
