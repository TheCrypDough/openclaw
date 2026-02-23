/*
 * AUTO ANNOTATION
 * File: src/agents/cli-session.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { SessionEntry } from "../config/sessions.js";
import { normalizeProviderId } from "./model-selection.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function getCliSessionId(
  entry: SessionEntry | undefined,
  provider: string,
): string | undefined {
  if (!entry) {
    return undefined;
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const normalized = normalizeProviderId(provider);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const fromMap = entry.cliSessionIds?.[normalized];
  if (fromMap?.trim()) {
    return fromMap.trim();
  }
  if (normalized === "claude-cli") {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const legacy = entry.claudeCliSessionId?.trim();
    if (legacy) {
      return legacy;
    }
  }
  return undefined;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function setCliSessionId(entry: SessionEntry, provider: string, sessionId: string): void {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const normalized = normalizeProviderId(provider);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const trimmed = sessionId.trim();
  if (!trimmed) {
    return;
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const existing = entry.cliSessionIds ?? {};
  entry.cliSessionIds = { ...existing };
  entry.cliSessionIds[normalized] = trimmed;
  if (normalized === "claude-cli") {
    entry.claudeCliSessionId = trimmed;
  }
}
