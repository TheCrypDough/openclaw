/*
 * AUTO ANNOTATION
 * File: src/infra/heartbeat-events.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
export type HeartbeatIndicatorType = "ok" | "alert" | "error";

export type HeartbeatEventPayload = {
  ts: number;
  status: "sent" | "ok-empty" | "ok-token" | "skipped" | "failed";
  to?: string;
  accountId?: string;
  preview?: string;
  durationMs?: number;
  hasMedia?: boolean;
  reason?: string;
  /** The channel this heartbeat was sent to. */
  channel?: string;
  /** Whether the message was silently suppressed (showOk: false). */
  silent?: boolean;
  /** Indicator type for UI status display. */
  indicatorType?: HeartbeatIndicatorType;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function resolveIndicatorType(
  status: HeartbeatEventPayload["status"],
): HeartbeatIndicatorType | undefined {
  switch (status) {
    case "ok-empty":
    case "ok-token":
      return "ok";
    case "sent":
      return "alert";
    case "failed":
      return "error";
    case "skipped":
      return undefined;
  }
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
let lastHeartbeat: HeartbeatEventPayload | null = null;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const listeners = new Set<(evt: HeartbeatEventPayload) => void>();

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function emitHeartbeatEvent(evt: Omit<HeartbeatEventPayload, "ts">) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const enriched: HeartbeatEventPayload = { ts: Date.now(), ...evt };
  lastHeartbeat = enriched;
  for (const listener of listeners) {
    try {
      listener(enriched);
    } catch {
      /* ignore */
    }
  }
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function onHeartbeatEvent(listener: (evt: HeartbeatEventPayload) => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function getLastHeartbeatEvent(): HeartbeatEventPayload | null {
  return lastHeartbeat;
}
