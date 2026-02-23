/*
 * AUTO ANNOTATION
 * File: src/channels/plugins/outbound/slack.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { OpenClawConfig } from "../../../config/config.js";

vi.mock("../../../slack/send.js", () => ({
  sendMessageSlack: vi.fn().mockResolvedValue({ messageId: "1234.5678", channelId: "C123" }),
}));

vi.mock("../../../plugins/hook-runner-global.js", () => ({
  getGlobalHookRunner: vi.fn(),
}));

import { getGlobalHookRunner } from "../../../plugins/hook-runner-global.js";
import { sendMessageSlack } from "../../../slack/send.js";
import { slackOutbound } from "./slack.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const sendSlackText = async (ctx: {
  to: string;
  text: string;
  accountId: string;
  replyToId: string;
  identity?: {
    name?: string;
    avatarUrl?: string;
    emoji?: string;
  };
}) => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const sendText = slackOutbound.sendText as NonNullable<typeof slackOutbound.sendText>;
  return await sendText({
    cfg: {} as OpenClawConfig,
    ...ctx,
  });
};

describe("slack outbound hook wiring", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("calls send without hooks when no hooks registered", async () => {
    vi.mocked(getGlobalHookRunner).mockReturnValue(null);

    await sendSlackText({
      to: "C123",
      text: "hello",
      accountId: "default",
      replyToId: "1111.2222",
    });

    expect(sendMessageSlack).toHaveBeenCalledWith("C123", "hello", {
      threadTs: "1111.2222",
      accountId: "default",
    });
  });

  it("forwards identity opts when present", async () => {
    vi.mocked(getGlobalHookRunner).mockReturnValue(null);

    await sendSlackText({
      to: "C123",
      text: "hello",
      accountId: "default",
      replyToId: "1111.2222",
      identity: {
        name: "My Agent",
        avatarUrl: "https://example.com/avatar.png",
        emoji: ":should_not_send:",
      },
    });

    expect(sendMessageSlack).toHaveBeenCalledWith("C123", "hello", {
      threadTs: "1111.2222",
      accountId: "default",
      identity: { username: "My Agent", iconUrl: "https://example.com/avatar.png" },
    });
  });

  it("forwards icon_emoji only when icon_url is absent", async () => {
    vi.mocked(getGlobalHookRunner).mockReturnValue(null);

    await sendSlackText({
      to: "C123",
      text: "hello",
      accountId: "default",
      replyToId: "1111.2222",
      identity: { emoji: ":lobster:" },
    });

    expect(sendMessageSlack).toHaveBeenCalledWith("C123", "hello", {
      threadTs: "1111.2222",
      accountId: "default",
      identity: { iconEmoji: ":lobster:" },
    });
  });

  it("calls message_sending hook before sending", async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const mockRunner = {
      hasHooks: vi.fn().mockReturnValue(true),
      runMessageSending: vi.fn().mockResolvedValue(undefined),
    };
    // oxlint-disable-next-line typescript/no-explicit-any
    vi.mocked(getGlobalHookRunner).mockReturnValue(mockRunner as any);

    await sendSlackText({
      to: "C123",
      text: "hello",
      accountId: "default",
      replyToId: "1111.2222",
    });

    expect(mockRunner.hasHooks).toHaveBeenCalledWith("message_sending");
    expect(mockRunner.runMessageSending).toHaveBeenCalledWith(
      { to: "C123", content: "hello", metadata: { threadTs: "1111.2222", channelId: "C123" } },
      { channelId: "slack", accountId: "default" },
    );
    expect(sendMessageSlack).toHaveBeenCalledWith("C123", "hello", {
      threadTs: "1111.2222",
      accountId: "default",
    });
  });

  it("cancels send when hook returns cancel:true", async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const mockRunner = {
      hasHooks: vi.fn().mockReturnValue(true),
      runMessageSending: vi.fn().mockResolvedValue({ cancel: true }),
    };
    // oxlint-disable-next-line typescript/no-explicit-any
    vi.mocked(getGlobalHookRunner).mockReturnValue(mockRunner as any);

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const result = await sendSlackText({
      to: "C123",
      text: "hello",
      accountId: "default",
      replyToId: "1111.2222",
    });

    expect(sendMessageSlack).not.toHaveBeenCalled();
    expect(result.channel).toBe("slack");
  });

  it("modifies text when hook returns content", async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const mockRunner = {
      hasHooks: vi.fn().mockReturnValue(true),
      runMessageSending: vi.fn().mockResolvedValue({ content: "modified" }),
    };
    // oxlint-disable-next-line typescript/no-explicit-any
    vi.mocked(getGlobalHookRunner).mockReturnValue(mockRunner as any);

    await sendSlackText({
      to: "C123",
      text: "original",
      accountId: "default",
      replyToId: "1111.2222",
    });

    expect(sendMessageSlack).toHaveBeenCalledWith("C123", "modified", {
      threadTs: "1111.2222",
      accountId: "default",
    });
  });

  it("skips hooks when runner has no message_sending hooks", async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const mockRunner = {
      hasHooks: vi.fn().mockReturnValue(false),
      runMessageSending: vi.fn(),
    };
    // oxlint-disable-next-line typescript/no-explicit-any
    vi.mocked(getGlobalHookRunner).mockReturnValue(mockRunner as any);

    await sendSlackText({
      to: "C123",
      text: "hello",
      accountId: "default",
      replyToId: "1111.2222",
    });

    expect(mockRunner.runMessageSending).not.toHaveBeenCalled();
    expect(sendMessageSlack).toHaveBeenCalled();
  });
});
