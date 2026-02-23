/*
 * AUTO ANNOTATION
 * File: src/commands/status-all/format.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
export { formatTimeAgo } from "../../infra/format-time/format-relative.ts";
export { formatDurationPrecise } from "../../infra/format-time/format-duration.ts";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function formatGatewayAuthUsed(
  auth: {
    token?: string;
    password?: string;
  } | null,
): "token" | "password" | "token+password" | "none" {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const hasToken = Boolean(auth?.token?.trim());
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const hasPassword = Boolean(auth?.password?.trim());
  if (hasToken && hasPassword) {
    return "token+password";
  }
  if (hasToken) {
    return "token";
  }
  if (hasPassword) {
    return "password";
  }
  return "none";
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function redactSecrets(text: string): string {
  if (!text) {
    return text;
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  let out = text;
  out = out.replace(
    /(\b(?:access[_-]?token|refresh[_-]?token|token|password|secret|api[_-]?key)\b\s*[:=]\s*)("?)([^"\\s]+)("?)/gi,
    "$1$2***$4",
  );
  out = out.replace(/\bBearer\s+[A-Za-z0-9._-]+\b/g, "Bearer ***");
  out = out.replace(/\bsk-[A-Za-z0-9]{10,}\b/g, "sk-***");
  return out;
}
