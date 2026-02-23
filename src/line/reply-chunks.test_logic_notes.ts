/*
 * AUTO ANNOTATION
 * File: src/line/reply-chunks.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { describe, expect, it, vi } from "vitest";
import { sendLineReplyChunks } from "./reply-chunks.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function createReplyChunksHarness() {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const replyMessageLine = vi.fn(async () => ({}));
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const pushMessageLine = vi.fn(async () => ({}));
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const pushTextMessageWithQuickReplies = vi.fn(async () => ({}));
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const createTextMessageWithQuickReplies = vi.fn((text: string, _quickReplies: string[]) => ({
    type: "text" as const,
    text,
  }));

  return {
    replyMessageLine,
    pushMessageLine,
    pushTextMessageWithQuickReplies,
    createTextMessageWithQuickReplies,
  };
}

describe("sendLineReplyChunks", () => {
  it("uses reply token for all chunks when possible", async () => {
    const {
      replyMessageLine,
      pushMessageLine,
      pushTextMessageWithQuickReplies,
      createTextMessageWithQuickReplies,
    } = createReplyChunksHarness();

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const result = await sendLineReplyChunks({
      to: "line:group:1",
      chunks: ["one", "two", "three"],
      quickReplies: ["A", "B"],
      replyToken: "token",
      replyTokenUsed: false,
      accountId: "default",
      replyMessageLine,
      pushMessageLine,
      pushTextMessageWithQuickReplies,
      createTextMessageWithQuickReplies,
    });

    expect(result.replyTokenUsed).toBe(true);
    expect(replyMessageLine).toHaveBeenCalledTimes(1);
    expect(createTextMessageWithQuickReplies).toHaveBeenCalledWith("three", ["A", "B"]);
    expect(replyMessageLine).toHaveBeenCalledWith(
      "token",
      [
        { type: "text", text: "one" },
        { type: "text", text: "two" },
        { type: "text", text: "three" },
      ],
      { accountId: "default" },
    );
    expect(pushMessageLine).not.toHaveBeenCalled();
    expect(pushTextMessageWithQuickReplies).not.toHaveBeenCalled();
  });

  it("attaches quick replies to a single reply chunk", async () => {
    const { replyMessageLine, pushMessageLine, pushTextMessageWithQuickReplies } =
      createReplyChunksHarness();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const createTextMessageWithQuickReplies = vi.fn((text: string, _quickReplies: string[]) => ({
      type: "text" as const,
      text,
      quickReply: { items: [] },
    }));

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const result = await sendLineReplyChunks({
      to: "line:user:1",
      chunks: ["only"],
      quickReplies: ["A"],
      replyToken: "token",
      replyTokenUsed: false,
      replyMessageLine,
      pushMessageLine,
      pushTextMessageWithQuickReplies,
      createTextMessageWithQuickReplies,
    });

    expect(result.replyTokenUsed).toBe(true);
    expect(createTextMessageWithQuickReplies).toHaveBeenCalledWith("only", ["A"]);
    expect(replyMessageLine).toHaveBeenCalledTimes(1);
    expect(pushMessageLine).not.toHaveBeenCalled();
    expect(pushTextMessageWithQuickReplies).not.toHaveBeenCalled();
  });

  it("replies with up to five chunks before pushing the rest", async () => {
    const {
      replyMessageLine,
      pushMessageLine,
      pushTextMessageWithQuickReplies,
      createTextMessageWithQuickReplies,
    } = createReplyChunksHarness();

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const chunks = ["1", "2", "3", "4", "5", "6", "7"];
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const result = await sendLineReplyChunks({
      to: "line:group:1",
      chunks,
      quickReplies: ["A"],
      replyToken: "token",
      replyTokenUsed: false,
      replyMessageLine,
      pushMessageLine,
      pushTextMessageWithQuickReplies,
      createTextMessageWithQuickReplies,
    });

    expect(result.replyTokenUsed).toBe(true);
    expect(replyMessageLine).toHaveBeenCalledTimes(1);
    expect(replyMessageLine).toHaveBeenCalledWith(
      "token",
      [
        { type: "text", text: "1" },
        { type: "text", text: "2" },
        { type: "text", text: "3" },
        { type: "text", text: "4" },
        { type: "text", text: "5" },
      ],
      { accountId: undefined },
    );
    expect(pushMessageLine).toHaveBeenCalledTimes(1);
    expect(pushMessageLine).toHaveBeenCalledWith("line:group:1", "6", { accountId: undefined });
    expect(pushTextMessageWithQuickReplies).toHaveBeenCalledTimes(1);
    expect(pushTextMessageWithQuickReplies).toHaveBeenCalledWith("line:group:1", "7", ["A"], {
      accountId: undefined,
    });
    expect(createTextMessageWithQuickReplies).not.toHaveBeenCalled();
  });

  it("falls back to push flow when replying fails", async () => {
    const {
      replyMessageLine,
      pushMessageLine,
      pushTextMessageWithQuickReplies,
      createTextMessageWithQuickReplies,
    } = createReplyChunksHarness();
    const onReplyError = vi.fn();
    replyMessageLine.mockRejectedValueOnce(new Error("reply failed"));

    const result = await sendLineReplyChunks({
      to: "line:group:1",
      chunks: ["1", "2", "3"],
      quickReplies: ["A"],
      replyToken: "token",
      replyTokenUsed: false,
      accountId: "default",
      replyMessageLine,
      pushMessageLine,
      pushTextMessageWithQuickReplies,
      createTextMessageWithQuickReplies,
      onReplyError,
    });

    expect(result.replyTokenUsed).toBe(true);
    expect(onReplyError).toHaveBeenCalledWith(expect.any(Error));
    expect(pushMessageLine).toHaveBeenNthCalledWith(1, "line:group:1", "1", {
      accountId: "default",
    });
    expect(pushMessageLine).toHaveBeenNthCalledWith(2, "line:group:1", "2", {
      accountId: "default",
    });
    expect(pushTextMessageWithQuickReplies).toHaveBeenCalledWith("line:group:1", "3", ["A"], {
      accountId: "default",
    });
  });
});
