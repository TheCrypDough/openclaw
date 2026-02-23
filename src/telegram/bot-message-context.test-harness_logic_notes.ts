/*
 * AUTO ANNOTATION
 * File: src/telegram/bot-message-context.test-harness.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { vi } from "vitest";
import { buildTelegramMessageContext } from "./bot-message-context.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const baseTelegramMessageContextConfig = {
  agents: { defaults: { model: "anthropic/claude-opus-4-5", workspace: "/tmp/openclaw" } },
  channels: { telegram: {} },
  messages: { groupChat: { mentionPatterns: [] } },
} as never;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
type BuildTelegramMessageContextForTestParams = {
  message: Record<string, unknown>;
  options?: Record<string, unknown>;
  resolveGroupActivation?: () => boolean | undefined;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function buildTelegramMessageContextForTest(
  params: BuildTelegramMessageContextForTestParams,
): Promise<Awaited<ReturnType<typeof buildTelegramMessageContext>>> {
  return await buildTelegramMessageContext({
    primaryCtx: {
      message: {
        message_id: 1,
        date: 1_700_000_000,
        text: "hello",
        from: { id: 42, first_name: "Alice" },
        ...params.message,
      },
      me: { id: 7, username: "bot" },
    } as never,
    allMedia: [],
    storeAllowFrom: [],
    options: params.options ?? {},
    bot: {
      api: {
        sendChatAction: vi.fn(),
        setMessageReaction: vi.fn(),
      },
    } as never,
    cfg: baseTelegramMessageContextConfig,
    account: { accountId: "default" } as never,
    historyLimit: 0,
    groupHistories: new Map(),
    dmPolicy: "open",
    allowFrom: [],
    groupAllowFrom: [],
    ackReactionScope: "off",
    logger: { info: vi.fn() },
    resolveGroupActivation: params.resolveGroupActivation ?? (() => undefined),
    resolveGroupRequireMention: () => false,
    resolveTelegramGroupConfig: () => ({
      groupConfig: { requireMention: false },
      topicConfig: undefined,
    }),
  });
}
