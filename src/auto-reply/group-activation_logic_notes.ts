/*
 * AUTO ANNOTATION
 * File: src/auto-reply/group-activation.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { normalizeCommandBody } from "./commands-registry.js";

export type GroupActivationMode = "mention" | "always";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function normalizeGroupActivation(raw?: string | null): GroupActivationMode | undefined {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const value = raw?.trim().toLowerCase();
  if (value === "mention") {
    return "mention";
  }
  if (value === "always") {
    return "always";
  }
  return undefined;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function parseActivationCommand(raw?: string): {
  hasCommand: boolean;
  mode?: GroupActivationMode;
} {
  if (!raw) {
    return { hasCommand: false };
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const trimmed = raw.trim();
  if (!trimmed) {
    return { hasCommand: false };
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const normalized = normalizeCommandBody(trimmed);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const match = normalized.match(/^\/activation(?:\s+([a-zA-Z]+))?\s*$/i);
  if (!match) {
    return { hasCommand: false };
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const mode = normalizeGroupActivation(match[1]);
  return { hasCommand: true, mode };
}
