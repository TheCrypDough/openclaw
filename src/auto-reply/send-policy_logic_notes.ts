/*
 * AUTO ANNOTATION
 * File: src/auto-reply/send-policy.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { normalizeCommandBody } from "./commands-registry.js";

export type SendPolicyOverride = "allow" | "deny";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function normalizeSendPolicyOverride(raw?: string | null): SendPolicyOverride | undefined {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const value = raw?.trim().toLowerCase();
  if (!value) {
    return undefined;
  }
  if (value === "allow" || value === "on") {
    return "allow";
  }
  if (value === "deny" || value === "off") {
    return "deny";
  }
  return undefined;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function parseSendPolicyCommand(raw?: string): {
  hasCommand: boolean;
  mode?: SendPolicyOverride | "inherit";
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
  const match = normalized.match(/^\/send(?:\s+([a-zA-Z]+))?\s*$/i);
  if (!match) {
    return { hasCommand: false };
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const token = match[1]?.trim().toLowerCase();
  if (!token) {
    return { hasCommand: true };
  }
  if (token === "inherit" || token === "default" || token === "reset") {
    return { hasCommand: true, mode: "inherit" };
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const mode = normalizeSendPolicyOverride(token);
  return { hasCommand: true, mode };
}
