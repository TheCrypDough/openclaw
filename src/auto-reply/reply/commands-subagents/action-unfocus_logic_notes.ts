/*
 * AUTO ANNOTATION
 * File: src/auto-reply/reply/commands-subagents/action-unfocus.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { getThreadBindingManager } from "../../../discord/monitor/thread-bindings.js";
import type { CommandHandlerResult } from "../commands-types.js";
import {
  type SubagentsCommandContext,
  isDiscordSurface,
  resolveDiscordAccountId,
  stopWithText,
} from "./shared.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function handleSubagentsUnfocusAction(ctx: SubagentsCommandContext): CommandHandlerResult {
  const { params } = ctx;
  if (!isDiscordSurface(params)) {
    return stopWithText("⚠️ /unfocus is only available on Discord.");
  }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const threadId = params.ctx.MessageThreadId != null ? String(params.ctx.MessageThreadId) : "";
  if (!threadId.trim()) {
    return stopWithText("⚠️ /unfocus must be run inside a Discord thread.");
  }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const threadBindings = getThreadBindingManager(resolveDiscordAccountId(params));
  if (!threadBindings) {
    return stopWithText("⚠️ Discord thread bindings are unavailable for this account.");
  }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const binding = threadBindings.getByThreadId(threadId);
  if (!binding) {
    return stopWithText("ℹ️ This thread is not currently focused.");
  }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const senderId = params.command.senderId?.trim() || "";
  if (binding.boundBy && binding.boundBy !== "system" && senderId && senderId !== binding.boundBy) {
    return stopWithText(`⚠️ Only ${binding.boundBy} can unfocus this thread.`);
  }

  threadBindings.unbindThread({
    threadId,
    reason: "manual",
    sendFarewell: true,
  });
  return stopWithText("✅ Thread unfocused.");
}
