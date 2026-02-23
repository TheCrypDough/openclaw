/*
 * AUTO ANNOTATION
 * File: ui/src/ui/presenter.ts
 * Purpose: UI source/configuration for one of OpenClaw frontend surfaces.
 * Module area: Web UI package and frontend runtime
 * System effect: Changes impact interaction layer and operator experience.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { formatRelativeTimestamp, formatDurationHuman, formatMs } from "./format.ts";
import type { CronJob, GatewaySessionRow, PresenceEntry } from "./types.ts";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function formatPresenceSummary(entry: PresenceEntry): string {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const host = entry.host ?? "unknown";
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const ip = entry.ip ? `(${entry.ip})` : "";
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const mode = entry.mode ?? "";
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const version = entry.version ?? "";
  return `${host} ${ip} ${mode} ${version}`.trim();
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function formatPresenceAge(entry: PresenceEntry): string {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const ts = entry.ts ?? null;
  return ts ? formatRelativeTimestamp(ts) : "n/a";
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function formatNextRun(ms?: number | null) {
  if (!ms) {
    return "n/a";
  }
  return `${formatMs(ms)} (${formatRelativeTimestamp(ms)})`;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function formatSessionTokens(row: GatewaySessionRow) {
  if (row.totalTokens == null) {
    return "n/a";
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const total = row.totalTokens ?? 0;
  const ctx = row.contextTokens ?? 0;
  return ctx ? `${total} / ${ctx}` : String(total);
}

export function formatEventPayload(payload: unknown): string {
  if (payload == null) {
    return "";
  }
  try {
    return JSON.stringify(payload, null, 2);
  } catch {
    // oxlint-disable typescript/no-base-to-string
    return String(payload);
  }
}

export function formatCronState(job: CronJob) {
  const state = job.state ?? {};
  const next = state.nextRunAtMs ? formatMs(state.nextRunAtMs) : "n/a";
  const last = state.lastRunAtMs ? formatMs(state.lastRunAtMs) : "n/a";
  const status = state.lastStatus ?? "n/a";
  return `${status} · next ${next} · last ${last}`;
}

export function formatCronSchedule(job: CronJob) {
  const s = job.schedule;
  if (s.kind === "at") {
    const atMs = Date.parse(s.at);
    return Number.isFinite(atMs) ? `At ${formatMs(atMs)}` : `At ${s.at}`;
  }
  if (s.kind === "every") {
    return `Every ${formatDurationHuman(s.everyMs)}`;
  }
  return `Cron ${s.expr}${s.tz ? ` (${s.tz})` : ""}`;
}

export function formatCronPayload(job: CronJob) {
  const p = job.payload;
  if (p.kind === "systemEvent") {
    return `System: ${p.text}`;
  }
  const base = `Agent: ${p.message}`;
  const delivery = job.delivery;
  if (delivery && delivery.mode !== "none") {
    const target =
      delivery.mode === "webhook"
        ? delivery.to
          ? ` (${delivery.to})`
          : ""
        : delivery.channel || delivery.to
          ? ` (${delivery.channel ?? "last"}${delivery.to ? ` -> ${delivery.to}` : ""})`
          : "";
    return `${base} · ${delivery.mode}${target}`;
  }
  return base;
}
