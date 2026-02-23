/*
 * AUTO ANNOTATION
 * File: src/auto-reply/reply/commands-subagents/action-spawn.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { spawnSubagentDirect } from "../../../agents/subagent-spawn.js";
import type { CommandHandlerResult } from "../commands-types.js";
import { type SubagentsCommandContext, stopWithText } from "./shared.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function handleSubagentsSpawnAction(
  ctx: SubagentsCommandContext,
): Promise<CommandHandlerResult> {
  const { params, requesterKey, restTokens } = ctx;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const agentId = restTokens[0];

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const taskParts: string[] = [];
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  let model: string | undefined;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  let thinking: string | undefined;
  for (let i = 1; i < restTokens.length; i++) {
    if (restTokens[i] === "--model" && i + 1 < restTokens.length) {
      i += 1;
      model = restTokens[i];
    } else if (restTokens[i] === "--thinking" && i + 1 < restTokens.length) {
      i += 1;
      thinking = restTokens[i];
    } else {
      taskParts.push(restTokens[i]);
    }
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const task = taskParts.join(" ").trim();
  if (!agentId || !task) {
    return stopWithText(
      "Usage: /subagents spawn <agentId> <task> [--model <model>] [--thinking <level>]",
    );
  }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const commandTo = typeof params.command.to === "string" ? params.command.to.trim() : "";
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const originatingTo =
    typeof params.ctx.OriginatingTo === "string" ? params.ctx.OriginatingTo.trim() : "";
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const fallbackTo = typeof params.ctx.To === "string" ? params.ctx.To.trim() : "";
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const normalizedTo = originatingTo || commandTo || fallbackTo || undefined;

  const result = await spawnSubagentDirect(
    {
      task,
      agentId,
      model,
      thinking,
      mode: "run",
      cleanup: "keep",
      expectsCompletionMessage: true,
    },
    {
      agentSessionKey: requesterKey,
      agentChannel: params.ctx.OriginatingChannel ?? params.command.channel,
      agentAccountId: params.ctx.AccountId,
      agentTo: normalizedTo,
      agentThreadId: params.ctx.MessageThreadId,
      agentGroupId: params.sessionEntry?.groupId ?? null,
      agentGroupChannel: params.sessionEntry?.groupChannel ?? null,
      agentGroupSpace: params.sessionEntry?.space ?? null,
    },
  );
  if (result.status === "accepted") {
    return stopWithText(
      `Spawned subagent ${agentId} (session ${result.childSessionKey}, run ${result.runId?.slice(0, 8)}).`,
    );
  }
  return stopWithText(`Spawn failed: ${result.error ?? result.status}`);
}
