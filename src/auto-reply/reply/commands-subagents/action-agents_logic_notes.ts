/*
 * AUTO ANNOTATION
 * File: src/auto-reply/reply/commands-subagents/action-agents.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { getThreadBindingManager } from "../../../discord/monitor/thread-bindings.js";
import type { CommandHandlerResult } from "../commands-types.js";
import { formatRunLabel, sortSubagentRuns } from "../subagents-utils.js";
import {
  type SubagentsCommandContext,
  isDiscordSurface,
  resolveDiscordAccountId,
  stopWithText,
} from "./shared.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function handleSubagentsAgentsAction(ctx: SubagentsCommandContext): CommandHandlerResult {
  const { params, requesterKey, runs } = ctx;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const isDiscord = isDiscordSurface(params);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const accountId = isDiscord ? resolveDiscordAccountId(params) : undefined;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const threadBindings = accountId ? getThreadBindingManager(accountId) : null;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const visibleRuns = sortSubagentRuns(runs).filter((entry) => {
    if (!entry.endedAt) {
      return true;
    }
    return Boolean(threadBindings?.listBySessionKey(entry.childSessionKey)[0]);
  });

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const lines = ["agents:", "-----"];
  if (visibleRuns.length === 0) {
    lines.push("(none)");
  } else {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    let index = 1;
    for (const entry of visibleRuns) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const threadBinding = threadBindings?.listBySessionKey(entry.childSessionKey)[0];
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const bindingText = threadBinding
        ? `thread:${threadBinding.threadId}`
        : isDiscord
          ? "unbound"
          : "bindings available on discord";
      lines.push(`${index}. ${formatRunLabel(entry)} (${bindingText})`);
      index += 1;
    }
  }

  if (threadBindings) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const acpBindings = threadBindings
      .listBindings()
      .filter((entry) => entry.targetKind === "acp" && entry.targetSessionKey === requesterKey);
    if (acpBindings.length > 0) {
      lines.push("", "acp/session bindings:", "-----");
      for (const binding of acpBindings) {
        lines.push(
          `- ${binding.label ?? binding.targetSessionKey} (thread:${binding.threadId}, session:${binding.targetSessionKey})`,
        );
      }
    }
  }

  return stopWithText(lines.join("\n"));
}
