/*
 * AUTO ANNOTATION
 * File: src/auto-reply/reply/commands-subagents/action-log.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { callGateway } from "../../../gateway/call.js";
import type { CommandHandlerResult } from "../commands-types.js";
import { formatRunLabel } from "../subagents-utils.js";
import {
  type ChatMessage,
  type SubagentsCommandContext,
  formatLogLines,
  resolveSubagentEntryForToken,
  stopWithText,
  stripToolMessages,
} from "./shared.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function handleSubagentsLogAction(
  ctx: SubagentsCommandContext,
): Promise<CommandHandlerResult> {
  const { runs, restTokens } = ctx;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const target = restTokens[0];
  if (!target) {
    return stopWithText("📜 Usage: /subagents log <id|#> [limit]");
  }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const includeTools = restTokens.some((token) => token.toLowerCase() === "tools");
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const limitToken = restTokens.find((token) => /^\d+$/.test(token));
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const limit = limitToken ? Math.min(200, Math.max(1, Number.parseInt(limitToken, 10))) : 20;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const targetResolution = resolveSubagentEntryForToken(runs, target);
  if ("reply" in targetResolution) {
    return targetResolution.reply;
  }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const history = await callGateway<{ messages: Array<unknown> }>({
    method: "chat.history",
    params: { sessionKey: targetResolution.entry.childSessionKey, limit },
  });
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const rawMessages = Array.isArray(history?.messages) ? history.messages : [];
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const filtered = includeTools ? rawMessages : stripToolMessages(rawMessages);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const lines = formatLogLines(filtered as ChatMessage[]);
  const header = `📜 Subagent log: ${formatRunLabel(targetResolution.entry)}`;
  if (lines.length === 0) {
    return stopWithText(`${header}\n(no messages)`);
  }
  return stopWithText([header, ...lines].join("\n"));
}
