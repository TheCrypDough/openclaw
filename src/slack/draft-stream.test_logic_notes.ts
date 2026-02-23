/*
 * AUTO ANNOTATION
 * File: src/slack/draft-stream.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { describe, expect, it, vi } from "vitest";
import { createSlackDraftStream } from "./draft-stream.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
type DraftStreamParams = Parameters<typeof createSlackDraftStream>[0];
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
type DraftSendFn = NonNullable<DraftStreamParams["send"]>;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
type DraftEditFn = NonNullable<DraftStreamParams["edit"]>;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
type DraftRemoveFn = NonNullable<DraftStreamParams["remove"]>;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
type DraftWarnFn = NonNullable<DraftStreamParams["warn"]>;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function createDraftStreamHarness(
  params: {
    maxChars?: number;
    send?: DraftSendFn;
    edit?: DraftEditFn;
    remove?: DraftRemoveFn;
    warn?: DraftWarnFn;
  } = {},
) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const send =
    params.send ??
    vi.fn<DraftSendFn>(async () => ({
      channelId: "C123",
      messageId: "111.222",
    }));
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const edit = params.edit ?? vi.fn<DraftEditFn>(async () => {});
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const remove = params.remove ?? vi.fn<DraftRemoveFn>(async () => {});
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const warn = params.warn ?? vi.fn<DraftWarnFn>();
  const stream = createSlackDraftStream({
    target: "channel:C123",
    token: "xoxb-test",
    throttleMs: 250,
    maxChars: params.maxChars,
    send,
    edit,
    remove,
    warn,
  });
  return { stream, send, edit, remove, warn };
}

describe("createSlackDraftStream", () => {
  it("sends the first update and edits subsequent updates", async () => {
    const { stream, send, edit } = createDraftStreamHarness();

    stream.update("hello");
    await stream.flush();
    stream.update("hello world");
    await stream.flush();

    expect(send).toHaveBeenCalledTimes(1);
    expect(edit).toHaveBeenCalledTimes(1);
    expect(edit).toHaveBeenCalledWith("C123", "111.222", "hello world", {
      token: "xoxb-test",
      accountId: undefined,
    });
  });

  it("does not send duplicate text", async () => {
    const { stream, send, edit } = createDraftStreamHarness();

    stream.update("same");
    await stream.flush();
    stream.update("same");
    await stream.flush();

    expect(send).toHaveBeenCalledTimes(1);
    expect(edit).toHaveBeenCalledTimes(0);
  });

  it("supports forceNewMessage for subsequent assistant messages", async () => {
    const send = vi
      .fn<DraftSendFn>()
      .mockResolvedValueOnce({ channelId: "C123", messageId: "111.222" })
      .mockResolvedValueOnce({ channelId: "C123", messageId: "333.444" });
    const { stream, edit } = createDraftStreamHarness({ send });

    stream.update("first");
    await stream.flush();
    stream.forceNewMessage();
    stream.update("second");
    await stream.flush();

    expect(send).toHaveBeenCalledTimes(2);
    expect(edit).toHaveBeenCalledTimes(0);
    expect(stream.messageId()).toBe("333.444");
  });

  it("stops when text exceeds max chars", async () => {
    const { stream, send, edit, warn } = createDraftStreamHarness({ maxChars: 5 });

    stream.update("123456");
    await stream.flush();
    stream.update("ok");
    await stream.flush();

    expect(send).not.toHaveBeenCalled();
    expect(edit).not.toHaveBeenCalled();
    expect(warn).toHaveBeenCalledTimes(1);
  });

  it("clear removes preview message when one exists", async () => {
    const { stream, remove } = createDraftStreamHarness();

    stream.update("hello");
    await stream.flush();
    await stream.clear();

    expect(remove).toHaveBeenCalledTimes(1);
    expect(remove).toHaveBeenCalledWith("C123", "111.222", {
      token: "xoxb-test",
      accountId: undefined,
    });
    expect(stream.messageId()).toBeUndefined();
    expect(stream.channelId()).toBeUndefined();
  });

  it("clear is a no-op when no preview message exists", async () => {
    const { stream, remove } = createDraftStreamHarness();

    await stream.clear();

    expect(remove).not.toHaveBeenCalled();
  });

  it("clear warns when cleanup fails", async () => {
    const remove = vi.fn<DraftRemoveFn>(async () => {
      throw new Error("cleanup failed");
    });
    const warn = vi.fn<DraftWarnFn>();
    const { stream } = createDraftStreamHarness({ remove, warn });

    stream.update("hello");
    await stream.flush();
    await stream.clear();

    expect(warn).toHaveBeenCalledWith("slack stream preview cleanup failed: cleanup failed");
    expect(stream.messageId()).toBeUndefined();
    expect(stream.channelId()).toBeUndefined();
  });
});
