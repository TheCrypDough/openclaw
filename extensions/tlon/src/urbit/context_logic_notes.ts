/*
 * AUTO ANNOTATION
 * File: extensions/tlon/src/urbit/context.ts
 * Purpose: Extension package component that adds a channel/tool integration or adapter.
 * Module area: Pluggable channel and service extensions
 * System effect: Alters gateway ecosystem integration points and feature surface exposed through plugin loading.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { SsrFPolicy } from "openclaw/plugin-sdk";
import { validateUrbitBaseUrl } from "./base-url.js";
import { UrbitUrlError } from "./errors.js";

export type UrbitContext = {
  baseUrl: string;
  hostname: string;
  ship: string;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function resolveShipFromHostname(hostname: string): string {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const trimmed = hostname.trim().toLowerCase().replace(/\.$/, "");
  if (!trimmed) {
    return "";
  }
  if (trimmed.includes(".")) {
    return trimmed.split(".")[0] ?? trimmed;
  }
  return trimmed;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function normalizeUrbitShip(ship: string | undefined, hostname: string): string {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const raw = ship?.replace(/^~/, "") ?? resolveShipFromHostname(hostname);
  return raw.trim();
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function normalizeUrbitCookie(cookie: string): string {
  return cookie.split(";")[0] ?? cookie;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function getUrbitContext(url: string, ship?: string): UrbitContext {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const validated = validateUrbitBaseUrl(url);
  if (!validated.ok) {
    throw new UrbitUrlError(validated.error);
  }
  return {
    baseUrl: validated.baseUrl,
    hostname: validated.hostname,
    ship: normalizeUrbitShip(ship, validated.hostname),
  };
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function ssrfPolicyFromAllowPrivateNetwork(
  allowPrivateNetwork: boolean | null | undefined,
): SsrFPolicy | undefined {
  return allowPrivateNetwork ? { allowPrivateNetwork: true } : undefined;
}
