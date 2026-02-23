/*
 * AUTO ANNOTATION
 * File: src/agents/timeout.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { OpenClawConfig } from "../config/config.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const DEFAULT_AGENT_TIMEOUT_SECONDS = 600;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const MAX_SAFE_TIMEOUT_MS = 2_147_000_000;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const normalizeNumber = (value: unknown): number | undefined =>
  typeof value === "number" && Number.isFinite(value) ? Math.floor(value) : undefined;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function resolveAgentTimeoutSeconds(cfg?: OpenClawConfig): number {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const raw = normalizeNumber(cfg?.agents?.defaults?.timeoutSeconds);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const seconds = raw ?? DEFAULT_AGENT_TIMEOUT_SECONDS;
  return Math.max(seconds, 1);
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function resolveAgentTimeoutMs(opts: {
  cfg?: OpenClawConfig;
  overrideMs?: number | null;
  overrideSeconds?: number | null;
  minMs?: number;
}): number {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const minMs = Math.max(normalizeNumber(opts.minMs) ?? 1, 1);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const clampTimeoutMs = (valueMs: number) =>
    Math.min(Math.max(valueMs, minMs), MAX_SAFE_TIMEOUT_MS);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const defaultMs = clampTimeoutMs(resolveAgentTimeoutSeconds(opts.cfg) * 1000);
  // Use the maximum timer-safe timeout to represent "no timeout" when explicitly set to 0.
  const NO_TIMEOUT_MS = MAX_SAFE_TIMEOUT_MS;
  const overrideMs = normalizeNumber(opts.overrideMs);
  if (overrideMs !== undefined) {
    if (overrideMs === 0) {
      return NO_TIMEOUT_MS;
    }
    if (overrideMs < 0) {
      return defaultMs;
    }
    return clampTimeoutMs(overrideMs);
  }
  const overrideSeconds = normalizeNumber(opts.overrideSeconds);
  if (overrideSeconds !== undefined) {
    if (overrideSeconds === 0) {
      return NO_TIMEOUT_MS;
    }
    if (overrideSeconds < 0) {
      return defaultMs;
    }
    return clampTimeoutMs(overrideSeconds * 1000);
  }
  return defaultMs;
}
