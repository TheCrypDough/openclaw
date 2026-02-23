/*
 * AUTO ANNOTATION
 * File: src/auto-reply/reply/commands-subagents.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { listSubagentRunsForRequester } from "../../agents/subagent-registry.js";
import { logVerbose } from "../../globals.js";
import { handleSubagentsAgentsAction } from "./commands-subagents/action-agents.js";
import { handleSubagentsFocusAction } from "./commands-subagents/action-focus.js";
import { handleSubagentsHelpAction } from "./commands-subagents/action-help.js";
import { handleSubagentsInfoAction } from "./commands-subagents/action-info.js";
import { handleSubagentsKillAction } from "./commands-subagents/action-kill.js";
import { handleSubagentsListAction } from "./commands-subagents/action-list.js";
import { handleSubagentsLogAction } from "./commands-subagents/action-log.js";
import { handleSubagentsSendAction } from "./commands-subagents/action-send.js";
import { handleSubagentsSpawnAction } from "./commands-subagents/action-spawn.js";
import { handleSubagentsUnfocusAction } from "./commands-subagents/action-unfocus.js";
import {
  type SubagentsCommandContext,
  extractMessageText,
  resolveHandledPrefix,
  resolveRequesterSessionKey,
  resolveSubagentsAction,
  stopWithText,
} from "./commands-subagents/shared.js";
import type { CommandHandler } from "./commands-types.js";

export { extractMessageText };

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const handleSubagentsCommand: CommandHandler = async (params, allowTextCommands) => {
  if (!allowTextCommands) {
    return null;
  }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const normalized = params.command.commandBodyNormalized;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const handledPrefix = resolveHandledPrefix(normalized);
  if (!handledPrefix) {
    return null;
  }

  if (!params.command.isAuthorizedSender) {
    logVerbose(
      `Ignoring ${handledPrefix} from unauthorized sender: ${params.command.senderId || "<unknown>"}`,
    );
    return { shouldContinue: false };
  }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const rest = normalized.slice(handledPrefix.length).trim();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const restTokens = rest.split(/\s+/).filter(Boolean);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const action = resolveSubagentsAction({ handledPrefix, restTokens });
  if (!action) {
    return handleSubagentsHelpAction();
  }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const requesterKey = resolveRequesterSessionKey(params, {
    preferCommandTarget: action === "spawn",
  });
  if (!requesterKey) {
    return stopWithText("⚠️ Missing session key.");
  }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const ctx: SubagentsCommandContext = {
    params,
    handledPrefix,
    requesterKey,
    runs: listSubagentRunsForRequester(requesterKey),
    restTokens,
  };

  switch (action) {
    case "help":
      return handleSubagentsHelpAction();
    case "agents":
      return handleSubagentsAgentsAction(ctx);
    case "focus":
      return await handleSubagentsFocusAction(ctx);
    case "unfocus":
      return handleSubagentsUnfocusAction(ctx);
    case "list":
      return handleSubagentsListAction(ctx);
    case "kill":
      return await handleSubagentsKillAction(ctx);
    case "info":
      return handleSubagentsInfoAction(ctx);
    case "log":
      return await handleSubagentsLogAction(ctx);
    case "send":
      return await handleSubagentsSendAction(ctx, false);
    case "steer":
      return await handleSubagentsSendAction(ctx, true);
    case "spawn":
      return await handleSubagentsSpawnAction(ctx);
    default:
      return handleSubagentsHelpAction();
  }
};
