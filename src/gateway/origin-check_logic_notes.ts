/*
 * AUTO ANNOTATION
 * File: src/gateway/origin-check.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { isLoopbackHost, normalizeHostHeader, resolveHostName } from "./net.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
type OriginCheckResult = { ok: true } | { ok: false; reason: string };

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function parseOrigin(
  originRaw?: string,
): { origin: string; host: string; hostname: string } | null {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const trimmed = (originRaw ?? "").trim();
  if (!trimmed || trimmed === "null") {
    return null;
  }
  try {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const url = new URL(trimmed);
    return {
      origin: url.origin.toLowerCase(),
      host: url.host.toLowerCase(),
      hostname: url.hostname.toLowerCase(),
    };
  } catch {
    return null;
  }
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function checkBrowserOrigin(params: {
  requestHost?: string;
  origin?: string;
  allowedOrigins?: string[];
}): OriginCheckResult {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const parsedOrigin = parseOrigin(params.origin);
  if (!parsedOrigin) {
    return { ok: false, reason: "origin missing or invalid" };
  }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const allowlist = (params.allowedOrigins ?? [])
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);
  if (allowlist.includes(parsedOrigin.origin)) {
    return { ok: true };
  }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const requestHost = normalizeHostHeader(params.requestHost);
  if (requestHost && parsedOrigin.host === requestHost) {
    return { ok: true };
  }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const requestHostname = resolveHostName(requestHost);
  if (isLoopbackHost(parsedOrigin.hostname) && isLoopbackHost(requestHostname)) {
    return { ok: true };
  }

  return { ok: false, reason: "origin not allowed" };
}
