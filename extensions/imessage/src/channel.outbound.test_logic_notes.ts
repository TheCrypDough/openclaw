/*
 * AUTO ANNOTATION
 * File: extensions/imessage/src/channel.outbound.test.ts
 * Purpose: Extension package component that adds a channel/tool integration or adapter.
 * Module area: Pluggable channel and service extensions
 * System effect: Alters gateway ecosystem integration points and feature surface exposed through plugin loading.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { describe, expect, it, vi } from "vitest";
import { imessagePlugin } from "./channel.js";

describe("imessagePlugin outbound", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const cfg = {
    channels: {
      imessage: {
        mediaMaxMb: 3,
      },
    },
  };

  it("forwards replyToId on direct sendText adapter path", async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const sendIMessage = vi.fn().mockResolvedValue({ messageId: "m-text" });
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const sendText = imessagePlugin.outbound?.sendText;
    expect(sendText).toBeDefined();

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const result = await sendText!({
      cfg,
      to: "chat_id:12",
      text: "hello",
      accountId: "default",
      replyToId: "reply-1",
      deps: { sendIMessage },
    });

    expect(sendIMessage).toHaveBeenCalledWith(
      "chat_id:12",
      "hello",
      expect.objectContaining({
        accountId: "default",
        replyToId: "reply-1",
        maxBytes: 3 * 1024 * 1024,
      }),
    );
    expect(result).toEqual({ channel: "imessage", messageId: "m-text" });
  });

  it("forwards replyToId on direct sendMedia adapter path", async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const sendIMessage = vi.fn().mockResolvedValue({ messageId: "m-media" });
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const sendMedia = imessagePlugin.outbound?.sendMedia;
    expect(sendMedia).toBeDefined();

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const result = await sendMedia!({
      cfg,
      to: "chat_id:77",
      text: "caption",
      mediaUrl: "https://example.com/pic.png",
      accountId: "acct-1",
      replyToId: "reply-2",
      deps: { sendIMessage },
    });

    expect(sendIMessage).toHaveBeenCalledWith(
      "chat_id:77",
      "caption",
      expect.objectContaining({
        mediaUrl: "https://example.com/pic.png",
        accountId: "acct-1",
        replyToId: "reply-2",
        maxBytes: 3 * 1024 * 1024,
      }),
    );
    expect(result).toEqual({ channel: "imessage", messageId: "m-media" });
  });
});
