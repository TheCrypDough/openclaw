/*
 * AUTO ANNOTATION
 * File: src/discord/monitor/thread-bindings.messages.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { DEFAULT_FAREWELL_TEXT, type ThreadBindingRecord } from "./thread-bindings.types.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function normalizeThreadBindingMessageTtlMs(raw: unknown): number {
  if (typeof raw !== "number" || !Number.isFinite(raw)) {
    return 0;
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const ttlMs = Math.floor(raw);
  if (ttlMs < 0) {
    return 0;
  }
  return ttlMs;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function formatThreadBindingTtlLabel(ttlMs: number): string {
  if (ttlMs <= 0) {
    return "disabled";
  }
  if (ttlMs < 60_000) {
    return "<1m";
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const totalMinutes = Math.floor(ttlMs / 60_000);
  if (totalMinutes % 60 === 0) {
    return `${Math.floor(totalMinutes / 60)}h`;
  }
  return `${totalMinutes}m`;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function resolveThreadBindingThreadName(params: {
  agentId?: string;
  label?: string;
}): string {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const label = params.label?.trim();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const base = label || params.agentId?.trim() || "agent";
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const raw = `🤖 ${base}`.replace(/\s+/g, " ").trim();
  return raw.slice(0, 100);
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function resolveThreadBindingIntroText(params: {
  agentId?: string;
  label?: string;
  sessionTtlMs?: number;
}): string {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const label = params.label?.trim();
  const base = label || params.agentId?.trim() || "agent";
  const normalized = base.replace(/\s+/g, " ").trim().slice(0, 100) || "agent";
  const ttlMs = normalizeThreadBindingMessageTtlMs(params.sessionTtlMs);
  if (ttlMs > 0) {
    return `🤖 ${normalized} session active (auto-unfocus in ${formatThreadBindingTtlLabel(ttlMs)}). Messages here go directly to this session.`;
  }
  return `🤖 ${normalized} session active. Messages here go directly to this session.`;
}

export function resolveThreadBindingFarewellText(params: {
  reason?: string;
  farewellText?: string;
  sessionTtlMs: number;
}): string {
  const custom = params.farewellText?.trim();
  if (custom) {
    return custom;
  }
  if (params.reason === "ttl-expired") {
    return `Session ended automatically after ${formatThreadBindingTtlLabel(params.sessionTtlMs)}. Messages here will no longer be routed.`;
  }
  return DEFAULT_FAREWELL_TEXT;
}

export function summarizeBindingPersona(record: ThreadBindingRecord): string {
  const label = record.label?.trim();
  const base = label || record.agentId;
  return (`🤖 ${base}`.trim() || "🤖 agent").slice(0, 80);
}
