/*
 * AUTO ANNOTATION
 * File: src/logging/redact-identifier.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import crypto from "node:crypto";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function sha256HexPrefix(value: string, len = 12): string {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const safeLen = Number.isFinite(len) ? Math.max(1, Math.floor(len)) : 12;
  return crypto.createHash("sha256").update(value).digest("hex").slice(0, safeLen);
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function redactIdentifier(value: string | undefined, opts?: { len?: number }): string {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const trimmed = value?.trim();
  if (!trimmed) {
    return "-";
  }
  return `sha256:${sha256HexPrefix(trimmed, opts?.len ?? 12)}`;
}
