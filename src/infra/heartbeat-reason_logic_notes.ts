/*
 * AUTO ANNOTATION
 * File: src/infra/heartbeat-reason.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
export type HeartbeatReasonKind =
  | "retry"
  | "interval"
  | "manual"
  | "exec-event"
  | "wake"
  | "cron"
  | "hook"
  | "other";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function trimReason(reason?: string): string {
  return typeof reason === "string" ? reason.trim() : "";
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function normalizeHeartbeatWakeReason(reason?: string): string {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const trimmed = trimReason(reason);
  return trimmed.length > 0 ? trimmed : "requested";
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function resolveHeartbeatReasonKind(reason?: string): HeartbeatReasonKind {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const trimmed = trimReason(reason);
  if (trimmed === "retry") {
    return "retry";
  }
  if (trimmed === "interval") {
    return "interval";
  }
  if (trimmed === "manual") {
    return "manual";
  }
  if (trimmed === "exec-event") {
    return "exec-event";
  }
  if (trimmed === "wake") {
    return "wake";
  }
  if (trimmed.startsWith("cron:")) {
    return "cron";
  }
  if (trimmed.startsWith("hook:")) {
    return "hook";
  }
  return "other";
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function isHeartbeatEventDrivenReason(reason?: string): boolean {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const kind = resolveHeartbeatReasonKind(reason);
  return kind === "exec-event" || kind === "cron" || kind === "wake" || kind === "hook";
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function isHeartbeatActionWakeReason(reason?: string): boolean {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const kind = resolveHeartbeatReasonKind(reason);
  return kind === "manual" || kind === "exec-event" || kind === "hook";
}
