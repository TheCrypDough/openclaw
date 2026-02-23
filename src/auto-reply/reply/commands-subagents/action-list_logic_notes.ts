/*
 * AUTO ANNOTATION
 * File: src/auto-reply/reply/commands-subagents/action-list.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { loadSessionStore, resolveStorePath } from "../../../config/sessions.js";
import type { CommandHandlerResult } from "../commands-types.js";
import { sortSubagentRuns } from "../subagents-utils.js";
import {
  type SessionStoreCache,
  type SubagentsCommandContext,
  RECENT_WINDOW_MINUTES,
  formatSubagentListLine,
  loadSubagentSessionEntry,
  stopWithText,
} from "./shared.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function handleSubagentsListAction(ctx: SubagentsCommandContext): CommandHandlerResult {
  const { params, runs } = ctx;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const sorted = sortSubagentRuns(runs);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const now = Date.now();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const recentCutoff = now - RECENT_WINDOW_MINUTES * 60_000;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const storeCache: SessionStoreCache = new Map();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  let index = 1;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const mapRuns = (entries: typeof runs, runtimeMs: (entry: (typeof runs)[number]) => number) =>
    entries.map((entry) => {
      const { entry: sessionEntry } = loadSubagentSessionEntry(
        params,
        entry.childSessionKey,
        {
          loadSessionStore,
          resolveStorePath,
        },
        storeCache,
      );
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const line = formatSubagentListLine({
        entry,
        index,
        runtimeMs: runtimeMs(entry),
        sessionEntry,
      });
      index += 1;
      return line;
    });

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const activeEntries = sorted.filter((entry) => !entry.endedAt);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const activeLines = mapRuns(activeEntries, (entry) => now - (entry.startedAt ?? entry.createdAt));
  const recentEntries = sorted.filter(
    (entry) => !!entry.endedAt && (entry.endedAt ?? 0) >= recentCutoff,
  );
  const recentLines = mapRuns(
    recentEntries,
    (entry) => (entry.endedAt ?? now) - (entry.startedAt ?? entry.createdAt),
  );

  const lines = ["active subagents:", "-----"];
  if (activeLines.length === 0) {
    lines.push("(none)");
  } else {
    lines.push(activeLines.join("\n"));
  }
  lines.push("", `recent subagents (last ${RECENT_WINDOW_MINUTES}m):`, "-----");
  if (recentLines.length === 0) {
    lines.push("(none)");
  } else {
    lines.push(recentLines.join("\n"));
  }

  return stopWithText(lines.join("\n"));
}
