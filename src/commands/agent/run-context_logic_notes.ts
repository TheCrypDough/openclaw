/*
 * AUTO ANNOTATION
 * File: src/commands/agent/run-context.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { normalizeAccountId } from "../../utils/account-id.js";
import { resolveMessageChannel } from "../../utils/message-channel.js";
import type { AgentCommandOpts, AgentRunContext } from "./types.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function resolveAgentRunContext(opts: AgentCommandOpts): AgentRunContext {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const merged: AgentRunContext = opts.runContext ? { ...opts.runContext } : {};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const normalizedChannel = resolveMessageChannel(
    merged.messageChannel ?? opts.messageChannel,
    opts.replyChannel ?? opts.channel,
  );
  if (normalizedChannel) {
    merged.messageChannel = normalizedChannel;
  }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const normalizedAccountId = normalizeAccountId(merged.accountId ?? opts.accountId);
  if (normalizedAccountId) {
    merged.accountId = normalizedAccountId;
  }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const groupId = (merged.groupId ?? opts.groupId)?.toString().trim();
  if (groupId) {
    merged.groupId = groupId;
  }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const groupChannel = (merged.groupChannel ?? opts.groupChannel)?.toString().trim();
  if (groupChannel) {
    merged.groupChannel = groupChannel;
  }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const groupSpace = (merged.groupSpace ?? opts.groupSpace)?.toString().trim();
  if (groupSpace) {
    merged.groupSpace = groupSpace;
  }

  if (
    merged.currentThreadTs == null &&
    opts.threadId != null &&
    opts.threadId !== "" &&
    opts.threadId !== null
  ) {
    merged.currentThreadTs = String(opts.threadId);
  }

  // Populate currentChannelId from the outbound target so that
  // resolveTelegramAutoThreadId can match the originating chat.
  if (!merged.currentChannelId && opts.to) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const trimmedTo = opts.to.trim();
    if (trimmedTo) {
      merged.currentChannelId = trimmedTo;
    }
  }

  return merged;
}
