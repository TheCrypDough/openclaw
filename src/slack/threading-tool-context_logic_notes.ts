/*
 * AUTO ANNOTATION
 * File: src/slack/threading-tool-context.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type {
  ChannelThreadingContext,
  ChannelThreadingToolContext,
} from "../channels/plugins/types.js";
import type { OpenClawConfig } from "../config/config.js";
import { resolveSlackAccount, resolveSlackReplyToMode } from "./accounts.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function buildSlackThreadingToolContext(params: {
  cfg: OpenClawConfig;
  accountId?: string | null;
  context: ChannelThreadingContext;
  hasRepliedRef?: { value: boolean };
}): ChannelThreadingToolContext {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const account = resolveSlackAccount({
    cfg: params.cfg,
    accountId: params.accountId,
  });
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const configuredReplyToMode = resolveSlackReplyToMode(account, params.context.ChatType);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const effectiveReplyToMode = params.context.ThreadLabel ? "all" : configuredReplyToMode;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const threadId = params.context.MessageThreadId ?? params.context.ReplyToId;
  return {
    currentChannelId: params.context.To?.startsWith("channel:")
      ? params.context.To.slice("channel:".length)
      : undefined,
    currentThreadTs: threadId != null ? String(threadId) : undefined,
    replyToMode: effectiveReplyToMode,
    hasRepliedRef: params.hasRepliedRef,
  };
}
