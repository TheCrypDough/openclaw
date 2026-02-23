/*
 * AUTO ANNOTATION
 * File: src/web/reconnect.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { randomUUID } from "node:crypto";
import type { OpenClawConfig } from "../config/config.js";
import type { BackoffPolicy } from "../infra/backoff.js";
import { computeBackoff, sleepWithAbort } from "../infra/backoff.js";
import { clamp } from "../utils.js";

export type ReconnectPolicy = BackoffPolicy & {
  maxAttempts: number;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const DEFAULT_HEARTBEAT_SECONDS = 60;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const DEFAULT_RECONNECT_POLICY: ReconnectPolicy = {
  initialMs: 2_000,
  maxMs: 30_000,
  factor: 1.8,
  jitter: 0.25,
  maxAttempts: 12,
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function resolveHeartbeatSeconds(cfg: OpenClawConfig, overrideSeconds?: number): number {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const candidate = overrideSeconds ?? cfg.web?.heartbeatSeconds;
  if (typeof candidate === "number" && candidate > 0) {
    return candidate;
  }
  return DEFAULT_HEARTBEAT_SECONDS;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function resolveReconnectPolicy(
  cfg: OpenClawConfig,
  overrides?: Partial<ReconnectPolicy>,
): ReconnectPolicy {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const reconnectOverrides = cfg.web?.reconnect ?? {};
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const overrideConfig = overrides ?? {};
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const merged = {
    ...DEFAULT_RECONNECT_POLICY,
    ...reconnectOverrides,
    ...overrideConfig,
  } as ReconnectPolicy;

  merged.initialMs = Math.max(250, merged.initialMs);
  merged.maxMs = Math.max(merged.initialMs, merged.maxMs);
  merged.factor = clamp(merged.factor, 1.1, 10);
  merged.jitter = clamp(merged.jitter, 0, 1);
  merged.maxAttempts = Math.max(0, Math.floor(merged.maxAttempts));
  return merged;
}

export { computeBackoff, sleepWithAbort };

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function newConnectionId() {
  return randomUUID();
}
