/*
 * AUTO ANNOTATION
 * File: src/tui/tui-status-summary.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { formatTimeAgo } from "../infra/format-time/format-relative.ts";
import { formatTokenCount } from "../utils/usage-format.js";
import { formatContextUsageLine } from "./tui-formatters.js";
import type { GatewayStatusSummary } from "./tui-types.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function formatStatusSummary(summary: GatewayStatusSummary) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const lines: string[] = [];
  lines.push("Gateway status");

  if (!summary.linkChannel) {
    lines.push("Link channel: unknown");
  } else {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const linkLabel = summary.linkChannel.label ?? "Link channel";
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const linked = summary.linkChannel.linked === true;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const authAge =
      linked && typeof summary.linkChannel.authAgeMs === "number"
        ? ` (last refreshed ${formatTimeAgo(summary.linkChannel.authAgeMs)})`
        : "";
    lines.push(`${linkLabel}: ${linked ? "linked" : "not linked"}${authAge}`);
  }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const providerSummary = Array.isArray(summary.providerSummary) ? summary.providerSummary : [];
  if (providerSummary.length > 0) {
    lines.push("");
    lines.push("System:");
    for (const line of providerSummary) {
      lines.push(`  ${line}`);
    }
  }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const heartbeatAgents = summary.heartbeat?.agents ?? [];
  if (heartbeatAgents.length > 0) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const heartbeatParts = heartbeatAgents.map((agent) => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const agentId = agent.agentId ?? "unknown";
      if (!agent.enabled || !agent.everyMs) {
        return `disabled (${agentId})`;
      }
      return `${agent.every ?? "unknown"} (${agentId})`;
    });
    lines.push("");
    lines.push(`Heartbeat: ${heartbeatParts.join(", ")}`);
  }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const sessionPaths = summary.sessions?.paths ?? [];
  if (sessionPaths.length === 1) {
    lines.push(`Session store: ${sessionPaths[0]}`);
  } else if (sessionPaths.length > 1) {
    lines.push(`Session stores: ${sessionPaths.length}`);
  }

  const defaults = summary.sessions?.defaults;
  const defaultModel = defaults?.model ?? "unknown";
  const defaultCtx =
    typeof defaults?.contextTokens === "number"
      ? ` (${formatTokenCount(defaults.contextTokens)} ctx)`
      : "";
  lines.push(`Default model: ${defaultModel}${defaultCtx}`);

  const sessionCount = summary.sessions?.count ?? 0;
  lines.push(`Active sessions: ${sessionCount}`);

  const recent = Array.isArray(summary.sessions?.recent) ? summary.sessions?.recent : [];
  if (recent.length > 0) {
    lines.push("Recent sessions:");
    for (const entry of recent) {
      const ageLabel = typeof entry.age === "number" ? formatTimeAgo(entry.age) : "no activity";
      const model = entry.model ?? "unknown";
      const usage = formatContextUsageLine({
        total: entry.totalTokens ?? null,
        context: entry.contextTokens ?? null,
        remaining: entry.remainingTokens ?? null,
        percent: entry.percentUsed ?? null,
      });
      const flags = entry.flags?.length ? ` | flags: ${entry.flags.join(", ")}` : "";
      lines.push(
        `- ${entry.key}${entry.kind ? ` [${entry.kind}]` : ""} | ${ageLabel} | model ${model} | ${usage}${flags}`,
      );
    }
  }

  const queued = Array.isArray(summary.queuedSystemEvents) ? summary.queuedSystemEvents : [];
  if (queued.length > 0) {
    const preview = queued.slice(0, 3).join(" | ");
    lines.push(`Queued system events (${queued.length}): ${preview}`);
  }

  return lines;
}
