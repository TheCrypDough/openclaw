/*
 * AUTO ANNOTATION
 * File: extensions/tlon/src/urbit/base-url.ts
 * Purpose: Extension package component that adds a channel/tool integration or adapter.
 * Module area: Pluggable channel and service extensions
 * System effect: Alters gateway ecosystem integration points and feature surface exposed through plugin loading.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { isBlockedHostnameOrIp } from "openclaw/plugin-sdk";

export type UrbitBaseUrlValidation =
  | { ok: true; baseUrl: string; hostname: string }
  | { ok: false; error: string };

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function hasScheme(value: string): boolean {
  return /^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//.test(value);
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function validateUrbitBaseUrl(raw: string): UrbitBaseUrlValidation {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const trimmed = String(raw ?? "").trim();
  if (!trimmed) {
    return { ok: false, error: "Required" };
  }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const candidate = hasScheme(trimmed) ? trimmed : `https://${trimmed}`;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  let parsed: URL;
  try {
    parsed = new URL(candidate);
  } catch {
    return { ok: false, error: "Invalid URL" };
  }

  if (!["http:", "https:"].includes(parsed.protocol)) {
    return { ok: false, error: "URL must use http:// or https://" };
  }

  if (parsed.username || parsed.password) {
    return { ok: false, error: "URL must not include credentials" };
  }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const hostname = parsed.hostname.trim().toLowerCase().replace(/\.$/, "");
  if (!hostname) {
    return { ok: false, error: "Invalid hostname" };
  }

  // Normalize to origin so callers can't smuggle paths/query fragments into the base URL,
  // and strip a trailing dot from the hostname (DNS root label).
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const isIpv6 = hostname.includes(":");
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const host = parsed.port
    ? `${isIpv6 ? `[${hostname}]` : hostname}:${parsed.port}`
    : isIpv6
      ? `[${hostname}]`
      : hostname;

  return { ok: true, baseUrl: `${parsed.protocol}//${host}`, hostname };
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function isBlockedUrbitHostname(hostname: string): boolean {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const normalized = hostname.trim().toLowerCase().replace(/\.$/, "");
  if (!normalized) {
    return false;
  }
  return isBlockedHostnameOrIp(normalized);
}
