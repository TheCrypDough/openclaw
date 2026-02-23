/*
 * AUTO ANNOTATION
 * File: src/discord/monitor/thread-bindings.discord-api.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { ChannelType } from "discord-api-types/v10";
import { beforeEach, describe, expect, it, vi } from "vitest";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const hoisted = vi.hoisted(() => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const restGet = vi.fn();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const createDiscordRestClient = vi.fn(() => ({
    rest: {
      get: restGet,
    },
  }));
  return {
    restGet,
    createDiscordRestClient,
  };
});

vi.mock("../client.js", () => ({
  createDiscordRestClient: hoisted.createDiscordRestClient,
}));

const { resolveChannelIdForBinding } = await import("./thread-bindings.discord-api.js");

describe("resolveChannelIdForBinding", () => {
  beforeEach(() => {
    hoisted.restGet.mockReset();
    hoisted.createDiscordRestClient.mockClear();
  });

  it("returns explicit channelId without resolving route", async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const resolved = await resolveChannelIdForBinding({
      accountId: "default",
      threadId: "thread-1",
      channelId: "channel-explicit",
    });

    expect(resolved).toBe("channel-explicit");
    expect(hoisted.createDiscordRestClient).not.toHaveBeenCalled();
    expect(hoisted.restGet).not.toHaveBeenCalled();
  });

  it("returns parent channel for thread channels", async () => {
    hoisted.restGet.mockResolvedValueOnce({
      id: "thread-1",
      type: ChannelType.PublicThread,
      parent_id: "channel-parent",
    });

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const resolved = await resolveChannelIdForBinding({
      accountId: "default",
      threadId: "thread-1",
    });

    expect(resolved).toBe("channel-parent");
  });

  it("keeps non-thread channel id even when parent_id exists", async () => {
    hoisted.restGet.mockResolvedValueOnce({
      id: "channel-text",
      type: ChannelType.GuildText,
      parent_id: "category-1",
    });

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const resolved = await resolveChannelIdForBinding({
      accountId: "default",
      threadId: "channel-text",
    });

    expect(resolved).toBe("channel-text");
  });

  it("keeps forum channel id instead of parent category", async () => {
    hoisted.restGet.mockResolvedValueOnce({
      id: "forum-1",
      type: ChannelType.GuildForum,
      parent_id: "category-1",
    });

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const resolved = await resolveChannelIdForBinding({
      accountId: "default",
      threadId: "forum-1",
    });

    expect(resolved).toBe("forum-1");
  });
});
