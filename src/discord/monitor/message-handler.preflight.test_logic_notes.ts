/*
 * AUTO ANNOTATION
 * File: src/discord/monitor/message-handler.preflight.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { ChannelType } from "@buape/carbon";
import { beforeEach, describe, expect, it } from "vitest";
import {
  preflightDiscordMessage,
  resolvePreflightMentionRequirement,
  shouldIgnoreBoundThreadWebhookMessage,
} from "./message-handler.preflight.js";
import {
  __testing as threadBindingTesting,
  createThreadBindingManager,
} from "./thread-bindings.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function createThreadBinding(
  overrides?: Partial<import("./thread-bindings.js").ThreadBindingRecord>,
) {
  return {
    accountId: "default",
    channelId: "parent-1",
    threadId: "thread-1",
    targetKind: "subagent",
    targetSessionKey: "agent:main:subagent:child-1",
    agentId: "main",
    boundBy: "test",
    boundAt: 1,
    webhookId: "wh-1",
    webhookToken: "tok-1",
    ...overrides,
  } satisfies import("./thread-bindings.js").ThreadBindingRecord;
}

describe("resolvePreflightMentionRequirement", () => {
  it("requires mention when config requires mention and thread is not bound", () => {
    expect(
      resolvePreflightMentionRequirement({
        shouldRequireMention: true,
        isBoundThreadSession: false,
      }),
    ).toBe(true);
  });

  it("disables mention requirement for bound thread sessions", () => {
    expect(
      resolvePreflightMentionRequirement({
        shouldRequireMention: true,
        isBoundThreadSession: true,
      }),
    ).toBe(false);
  });

  it("keeps mention requirement disabled when config already disables it", () => {
    expect(
      resolvePreflightMentionRequirement({
        shouldRequireMention: false,
        isBoundThreadSession: false,
      }),
    ).toBe(false);
  });
});

describe("preflightDiscordMessage", () => {
  it("bypasses mention gating in bound threads for allowed bot senders", async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const threadBinding = createThreadBinding();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const threadId = "thread-bot-focus";
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const parentId = "channel-parent-focus";
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const client = {
      fetchChannel: async (channelId: string) => {
        if (channelId === threadId) {
          return {
            id: threadId,
            type: ChannelType.PublicThread,
            name: "focus",
            parentId,
            ownerId: "owner-1",
          };
        }
        if (channelId === parentId) {
          return {
            id: parentId,
            type: ChannelType.GuildText,
            name: "general",
          };
        }
        return null;
      },
    } as unknown as import("@buape/carbon").Client;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const message = {
      id: "m-bot-1",
      content: "relay message without mention",
      timestamp: new Date().toISOString(),
      channelId: threadId,
      attachments: [],
      mentionedUsers: [],
      mentionedRoles: [],
      mentionedEveryone: false,
      author: {
        id: "relay-bot-1",
        bot: true,
        username: "Relay",
      },
    } as unknown as import("@buape/carbon").Message;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const result = await preflightDiscordMessage({
      cfg: {
        session: {
          mainKey: "main",
          scope: "per-sender",
        },
      } as import("../../config/config.js").OpenClawConfig,
      discordConfig: {
        allowBots: true,
      } as NonNullable<import("../../config/config.js").OpenClawConfig["channels"]>["discord"],
      accountId: "default",
      token: "token",
      runtime: {} as import("../../runtime.js").RuntimeEnv,
      botUserId: "openclaw-bot",
      guildHistories: new Map(),
      historyLimit: 0,
      mediaMaxBytes: 1_000_000,
      textLimit: 2_000,
      replyToMode: "all",
      dmEnabled: true,
      groupDmEnabled: true,
      ackReactionScope: "direct",
      groupPolicy: "open",
      threadBindings: {
        getByThreadId: (id: string) => (id === threadId ? threadBinding : undefined),
      } as import("./thread-bindings.js").ThreadBindingManager,
      data: {
        channel_id: threadId,
        guild_id: "guild-1",
        guild: {
          id: "guild-1",
          name: "Guild One",
        },
        author: message.author,
        message,
      } as unknown as import("./listeners.js").DiscordMessageEvent,
      client,
    });

    expect(result).not.toBeNull();
    expect(result?.boundSessionKey).toBe(threadBinding.targetSessionKey);
    expect(result?.shouldRequireMention).toBe(false);
  });
});

describe("shouldIgnoreBoundThreadWebhookMessage", () => {
  beforeEach(() => {
    threadBindingTesting.resetThreadBindingsForTests();
  });

  it("returns true when inbound webhook id matches the bound thread webhook", () => {
    expect(
      shouldIgnoreBoundThreadWebhookMessage({
        webhookId: "wh-1",
        threadBinding: createThreadBinding(),
      }),
    ).toBe(true);
  });

  it("returns false when webhook ids differ", () => {
    expect(
      shouldIgnoreBoundThreadWebhookMessage({
        webhookId: "wh-other",
        threadBinding: createThreadBinding(),
      }),
    ).toBe(false);
  });

  it("returns false when there is no bound thread webhook", () => {
    expect(
      shouldIgnoreBoundThreadWebhookMessage({
        webhookId: "wh-1",
        threadBinding: createThreadBinding({ webhookId: undefined }),
      }),
    ).toBe(false);
  });

  it("returns true for recently unbound thread webhook echoes", async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const manager = createThreadBindingManager({
      accountId: "default",
      persist: false,
      enableSweeper: false,
    });
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const binding = await manager.bindTarget({
      threadId: "thread-1",
      channelId: "parent-1",
      targetKind: "subagent",
      targetSessionKey: "agent:main:subagent:child-1",
      agentId: "main",
      webhookId: "wh-1",
      webhookToken: "tok-1",
    });
    expect(binding).not.toBeNull();

    manager.unbindThread({
      threadId: "thread-1",
      sendFarewell: false,
    });

    expect(
      shouldIgnoreBoundThreadWebhookMessage({
        accountId: "default",
        threadId: "thread-1",
        webhookId: "wh-1",
      }),
    ).toBe(true);
  });
});
