/*
 * AUTO ANNOTATION
 * File: src/infra/session-maintenance-warning.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { resolveSessionAgentId } from "../agents/agent-scope.js";
import type { OpenClawConfig } from "../config/config.js";
import type { SessionEntry, SessionMaintenanceWarning } from "../config/sessions.js";
import { createSubsystemLogger } from "../logging/subsystem.js";
import { isDeliverableMessageChannel, normalizeMessageChannel } from "../utils/message-channel.js";
import { resolveSessionDeliveryTarget } from "./outbound/targets.js";
import { enqueueSystemEvent } from "./system-events.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
type WarningParams = {
  cfg: OpenClawConfig;
  sessionKey: string;
  entry: SessionEntry;
  warning: SessionMaintenanceWarning;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const warnedContexts = new Map<string, string>();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const log = createSubsystemLogger("session-maintenance-warning");

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function shouldSendWarning(): boolean {
  return !process.env.VITEST && process.env.NODE_ENV !== "test";
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function buildWarningContext(params: WarningParams): string {
  const { warning } = params;
  return [
    warning.activeSessionKey,
    warning.pruneAfterMs,
    warning.maxEntries,
    warning.wouldPrune ? "prune" : "",
    warning.wouldCap ? "cap" : "",
  ]
    .filter(Boolean)
    .join("|");
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function formatDuration(ms: number): string {
  if (ms >= 86_400_000) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const days = Math.round(ms / 86_400_000);
    return `${days} day${days === 1 ? "" : "s"}`;
  }
  if (ms >= 3_600_000) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const hours = Math.round(ms / 3_600_000);
    return `${hours} hour${hours === 1 ? "" : "s"}`;
  }
  if (ms >= 60_000) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const mins = Math.round(ms / 60_000);
    return `${mins} minute${mins === 1 ? "" : "s"}`;
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const secs = Math.round(ms / 1000);
  return `${secs} second${secs === 1 ? "" : "s"}`;
}

function buildWarningText(warning: SessionMaintenanceWarning): string {
  const reasons: string[] = [];
  if (warning.wouldPrune) {
    reasons.push(`older than ${formatDuration(warning.pruneAfterMs)}`);
  }
  if (warning.wouldCap) {
    reasons.push(`not in the most recent ${warning.maxEntries} sessions`);
  }
  const reasonText = reasons.length > 0 ? reasons.join(" and ") : "over maintenance limits";
  return (
    `⚠️ Session maintenance warning: this active session would be evicted (${reasonText}). ` +
    `Maintenance is set to warn-only, so nothing was reset. ` +
    `To enforce cleanup, set \`session.maintenance.mode: "enforce"\` or increase the limits.`
  );
}

export async function deliverSessionMaintenanceWarning(params: WarningParams): Promise<void> {
  if (!shouldSendWarning()) {
    return;
  }

  const contextKey = buildWarningContext(params);
  if (warnedContexts.get(params.sessionKey) === contextKey) {
    return;
  }
  warnedContexts.set(params.sessionKey, contextKey);

  const text = buildWarningText(params.warning);
  const target = resolveSessionDeliveryTarget({
    entry: params.entry,
    requestedChannel: "last",
  });

  if (!target.channel || !target.to) {
    enqueueSystemEvent(text, { sessionKey: params.sessionKey });
    return;
  }

  const channel = normalizeMessageChannel(target.channel) ?? target.channel;
  if (!isDeliverableMessageChannel(channel)) {
    enqueueSystemEvent(text, { sessionKey: params.sessionKey });
    return;
  }

  try {
    const { deliverOutboundPayloads } = await import("./outbound/deliver.js");
    await deliverOutboundPayloads({
      cfg: params.cfg,
      channel,
      to: target.to,
      accountId: target.accountId,
      threadId: target.threadId,
      payloads: [{ text }],
      agentId: resolveSessionAgentId({ sessionKey: params.sessionKey, config: params.cfg }),
    });
  } catch (err) {
    log.warn(`Failed to deliver session maintenance warning: ${String(err)}`);
    enqueueSystemEvent(text, { sessionKey: params.sessionKey });
  }
}
