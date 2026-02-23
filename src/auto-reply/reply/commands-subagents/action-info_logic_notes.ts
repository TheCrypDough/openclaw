/*
 * AUTO ANNOTATION
 * File: src/auto-reply/reply/commands-subagents/action-info.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { loadSessionStore, resolveStorePath } from "../../../config/sessions.js";
import { formatDurationCompact } from "../../../shared/subagents-format.js";
import type { CommandHandlerResult } from "../commands-types.js";
import { formatRunLabel } from "../subagents-utils.js";
import {
  type SubagentsCommandContext,
  formatTimestampWithAge,
  loadSubagentSessionEntry,
  resolveDisplayStatus,
  resolveSubagentEntryForToken,
  stopWithText,
} from "./shared.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function handleSubagentsInfoAction(ctx: SubagentsCommandContext): CommandHandlerResult {
  const { params, runs, restTokens } = ctx;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const target = restTokens[0];
  if (!target) {
    return stopWithText("ℹ️ Usage: /subagents info <id|#>");
  }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const targetResolution = resolveSubagentEntryForToken(runs, target);
  if ("reply" in targetResolution) {
    return targetResolution.reply;
  }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const run = targetResolution.entry;
  const { entry: sessionEntry } = loadSubagentSessionEntry(params, run.childSessionKey, {
    loadSessionStore,
    resolveStorePath,
  });
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const runtime =
    run.startedAt && Number.isFinite(run.startedAt)
      ? (formatDurationCompact((run.endedAt ?? Date.now()) - run.startedAt) ?? "n/a")
      : "n/a";
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const outcome = run.outcome
    ? `${run.outcome.status}${run.outcome.error ? ` (${run.outcome.error})` : ""}`
    : "n/a";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const lines = [
    "ℹ️ Subagent info",
    `Status: ${resolveDisplayStatus(run)}`,
    `Label: ${formatRunLabel(run)}`,
    `Task: ${run.task}`,
    `Run: ${run.runId}`,
    `Session: ${run.childSessionKey}`,
    `SessionId: ${sessionEntry?.sessionId ?? "n/a"}`,
    `Transcript: ${sessionEntry?.sessionFile ?? "n/a"}`,
    `Runtime: ${runtime}`,
    `Created: ${formatTimestampWithAge(run.createdAt)}`,
    `Started: ${formatTimestampWithAge(run.startedAt)}`,
    `Ended: ${formatTimestampWithAge(run.endedAt)}`,
    `Cleanup: ${run.cleanup}`,
    run.archiveAtMs ? `Archive: ${formatTimestampWithAge(run.archiveAtMs)}` : undefined,
    run.cleanupHandled ? "Cleanup handled: yes" : undefined,
    `Outcome: ${outcome}`,
  ].filter(Boolean);

  return stopWithText(lines.join("\n"));
}
