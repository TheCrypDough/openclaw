/*
 * AUTO ANNOTATION
 * File: src/commands/status.format.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { formatDurationPrecise } from "../infra/format-time/format-duration.ts";
import { formatRuntimeStatusWithDetails } from "../infra/runtime-status.ts";
import type { SessionStatus } from "./status.types.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const formatKTokens = (value: number) =>
  `${(value / 1000).toFixed(value >= 10_000 ? 0 : 1)}k`;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const formatDuration = (ms: number | null | undefined) => {
  if (ms == null || !Number.isFinite(ms)) {
    return "unknown";
  }
  return formatDurationPrecise(ms, { decimals: 1 });
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const shortenText = (value: string, maxLen: number) => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const chars = Array.from(value);
  if (chars.length <= maxLen) {
    return value;
  }
  return `${chars.slice(0, Math.max(0, maxLen - 1)).join("")}…`;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const formatTokensCompact = (
  sess: Pick<
    SessionStatus,
    "totalTokens" | "contextTokens" | "percentUsed" | "cacheRead" | "cacheWrite"
  >,
) => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const used = sess.totalTokens;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const ctx = sess.contextTokens;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const cacheRead = sess.cacheRead;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const cacheWrite = sess.cacheWrite;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  let result = "";
  if (used == null) {
    result = ctx ? `unknown/${formatKTokens(ctx)} (?%)` : "unknown used";
  } else if (!ctx) {
    result = `${formatKTokens(used)} used`;
  } else {
    const pctLabel = sess.percentUsed != null ? `${sess.percentUsed}%` : "?%";
    result = `${formatKTokens(used)}/${formatKTokens(ctx)} (${pctLabel})`;
  }

  // Add cache hit rate if there are cached reads
  if (typeof cacheRead === "number" && cacheRead > 0) {
    const total =
      typeof used === "number"
        ? used
        : cacheRead + (typeof cacheWrite === "number" ? cacheWrite : 0);
    const hitRate = Math.round((cacheRead / total) * 100);
    result += ` · 🗄️ ${hitRate}% cached`;
  }

  return result;
};

export const formatDaemonRuntimeShort = (runtime?: {
  status?: string;
  pid?: number;
  state?: string;
  detail?: string;
  missingUnit?: boolean;
}) => {
  if (!runtime) {
    return null;
  }
  const details: string[] = [];
  const detail = runtime.detail?.replace(/\s+/g, " ").trim() || "";
  const noisyLaunchctlDetail =
    runtime.missingUnit === true && detail.toLowerCase().includes("could not find service");
  if (detail && !noisyLaunchctlDetail) {
    details.push(detail);
  }
  return formatRuntimeStatusWithDetails({
    status: runtime.status,
    pid: runtime.pid,
    state: runtime.state,
    details,
  });
};
