/*
 * AUTO ANNOTATION
 * File: src/auto-reply/reply/commands-subagents/action-focus.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import {
  getThreadBindingManager,
  resolveThreadBindingIntroText,
  resolveThreadBindingThreadName,
} from "../../../discord/monitor/thread-bindings.js";
import type { CommandHandlerResult } from "../commands-types.js";
import {
  type SubagentsCommandContext,
  isDiscordSurface,
  resolveDiscordAccountId,
  resolveDiscordChannelIdForFocus,
  resolveFocusTargetSession,
  stopWithText,
} from "./shared.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function handleSubagentsFocusAction(
  ctx: SubagentsCommandContext,
): Promise<CommandHandlerResult> {
  const { params, runs, restTokens } = ctx;
  if (!isDiscordSurface(params)) {
    return stopWithText("⚠️ /focus is only available on Discord.");
  }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const token = restTokens.join(" ").trim();
  if (!token) {
    return stopWithText("Usage: /focus <subagent-label|session-key|session-id|session-label>");
  }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const accountId = resolveDiscordAccountId(params);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const threadBindings = getThreadBindingManager(accountId);
  if (!threadBindings) {
    return stopWithText("⚠️ Discord thread bindings are unavailable for this account.");
  }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const focusTarget = await resolveFocusTargetSession({ runs, token });
  if (!focusTarget) {
    return stopWithText(`⚠️ Unable to resolve focus target: ${token}`);
  }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const currentThreadId =
    params.ctx.MessageThreadId != null ? String(params.ctx.MessageThreadId).trim() : "";
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const parentChannelId = currentThreadId ? undefined : resolveDiscordChannelIdForFocus(params);
  if (!currentThreadId && !parentChannelId) {
    return stopWithText("⚠️ Could not resolve a Discord channel for /focus.");
  }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const senderId = params.command.senderId?.trim() || "";
  if (currentThreadId) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const existingBinding = threadBindings.getByThreadId(currentThreadId);
    if (
      existingBinding &&
      existingBinding.boundBy &&
      existingBinding.boundBy !== "system" &&
      senderId &&
      senderId !== existingBinding.boundBy
    ) {
      return stopWithText(`⚠️ Only ${existingBinding.boundBy} can refocus this thread.`);
    }
  }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const label = focusTarget.label || token;
  const binding = await threadBindings.bindTarget({
    threadId: currentThreadId || undefined,
    channelId: parentChannelId,
    createThread: !currentThreadId,
    threadName: resolveThreadBindingThreadName({
      agentId: focusTarget.agentId,
      label,
    }),
    targetKind: focusTarget.targetKind,
    targetSessionKey: focusTarget.targetSessionKey,
    agentId: focusTarget.agentId,
    label,
    boundBy: senderId || "unknown",
    introText: resolveThreadBindingIntroText({
      agentId: focusTarget.agentId,
      label,
      sessionTtlMs: threadBindings.getSessionTtlMs(),
    }),
  });

  if (!binding) {
    return stopWithText("⚠️ Failed to bind a Discord thread to the target session.");
  }

  const actionText = currentThreadId
    ? `bound this thread to ${binding.targetSessionKey}`
    : `created thread ${binding.threadId} and bound it to ${binding.targetSessionKey}`;
  return stopWithText(`✅ ${actionText} (${binding.targetKind}).`);
}
