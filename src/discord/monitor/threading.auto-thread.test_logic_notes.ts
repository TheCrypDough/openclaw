/*
 * AUTO ANNOTATION
 * File: src/discord/monitor/threading.auto-thread.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { ChannelType } from "@buape/carbon";
import { describe, it, expect, vi } from "vitest";
import { maybeCreateDiscordAutoThread } from "./threading.js";

describe("maybeCreateDiscordAutoThread", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const postMock = vi.fn();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const getMock = vi.fn();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const mockClient = {
    rest: { post: postMock, get: getMock },
  } as unknown as Parameters<typeof maybeCreateDiscordAutoThread>[0]["client"];
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const mockMessage = {
    id: "msg1",
    timestamp: "123",
  } as unknown as Parameters<typeof maybeCreateDiscordAutoThread>[0]["message"];

  it("skips auto-thread if channelType is GuildForum", async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const result = await maybeCreateDiscordAutoThread({
      client: mockClient,
      message: mockMessage,
      messageChannelId: "forum1",
      isGuildMessage: true,
      channelConfig: { allowed: true, autoThread: true },
      channelType: ChannelType.GuildForum,
      baseText: "test",
      combinedBody: "test",
    });
    expect(result).toBeUndefined();
    expect(postMock).not.toHaveBeenCalled();
  });

  it("skips auto-thread if channelType is GuildMedia", async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const result = await maybeCreateDiscordAutoThread({
      client: mockClient,
      message: mockMessage,
      messageChannelId: "media1",
      isGuildMessage: true,
      channelConfig: { allowed: true, autoThread: true },
      channelType: ChannelType.GuildMedia,
      baseText: "test",
      combinedBody: "test",
    });
    expect(result).toBeUndefined();
    expect(postMock).not.toHaveBeenCalled();
  });

  it("skips auto-thread if channelType is GuildVoice", async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const result = await maybeCreateDiscordAutoThread({
      client: mockClient,
      message: mockMessage,
      messageChannelId: "voice1",
      isGuildMessage: true,
      channelConfig: { allowed: true, autoThread: true },
      channelType: ChannelType.GuildVoice,
      baseText: "test",
      combinedBody: "test",
    });
    expect(result).toBeUndefined();
    expect(postMock).not.toHaveBeenCalled();
  });

  it("skips auto-thread if channelType is GuildStageVoice", async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const result = await maybeCreateDiscordAutoThread({
      client: mockClient,
      message: mockMessage,
      messageChannelId: "stage1",
      isGuildMessage: true,
      channelConfig: { allowed: true, autoThread: true },
      channelType: ChannelType.GuildStageVoice,
      baseText: "test",
      combinedBody: "test",
    });
    expect(result).toBeUndefined();
    expect(postMock).not.toHaveBeenCalled();
  });

  it("creates auto-thread if channelType is GuildText", async () => {
    postMock.mockResolvedValueOnce({ id: "thread1" });
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const result = await maybeCreateDiscordAutoThread({
      client: mockClient,
      message: mockMessage,
      messageChannelId: "text1",
      isGuildMessage: true,
      channelConfig: { allowed: true, autoThread: true },
      channelType: ChannelType.GuildText,
      baseText: "test",
      combinedBody: "test",
    });
    expect(result).toBe("thread1");
    expect(postMock).toHaveBeenCalled();
  });
});
