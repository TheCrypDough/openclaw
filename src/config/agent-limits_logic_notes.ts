/*
 * AUTO ANNOTATION
 * File: src/config/agent-limits.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { OpenClawConfig } from "./types.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const DEFAULT_AGENT_MAX_CONCURRENT = 4;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const DEFAULT_SUBAGENT_MAX_CONCURRENT = 8;
// Keep depth-1 subagents as leaves unless config explicitly opts into nesting.
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const DEFAULT_SUBAGENT_MAX_SPAWN_DEPTH = 1;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function resolveAgentMaxConcurrent(cfg?: OpenClawConfig): number {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const raw = cfg?.agents?.defaults?.maxConcurrent;
  if (typeof raw === "number" && Number.isFinite(raw)) {
    return Math.max(1, Math.floor(raw));
  }
  return DEFAULT_AGENT_MAX_CONCURRENT;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function resolveSubagentMaxConcurrent(cfg?: OpenClawConfig): number {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const raw = cfg?.agents?.defaults?.subagents?.maxConcurrent;
  if (typeof raw === "number" && Number.isFinite(raw)) {
    return Math.max(1, Math.floor(raw));
  }
  return DEFAULT_SUBAGENT_MAX_CONCURRENT;
}
