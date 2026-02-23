/*
 * AUTO ANNOTATION
 * File: src/browser/extension-relay-auth.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { createHmac } from "node:crypto";
import { loadConfig } from "../config/config.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const RELAY_TOKEN_CONTEXT = "openclaw-extension-relay-v1";
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const DEFAULT_RELAY_PROBE_TIMEOUT_MS = 500;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const OPENCLAW_RELAY_BROWSER = "OpenClaw/extension-relay";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function resolveGatewayAuthToken(): string | null {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const envToken =
    process.env.OPENCLAW_GATEWAY_TOKEN?.trim() || process.env.CLAWDBOT_GATEWAY_TOKEN?.trim();
  if (envToken) {
    return envToken;
  }
  try {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const cfg = loadConfig();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const configToken = cfg.gateway?.auth?.token?.trim();
    if (configToken) {
      return configToken;
    }
  } catch {
    // ignore config read failures; caller can fallback to per-process random token
  }
  return null;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function deriveRelayAuthToken(gatewayToken: string, port: number): string {
  return createHmac("sha256", gatewayToken).update(`${RELAY_TOKEN_CONTEXT}:${port}`).digest("hex");
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function resolveRelayAuthTokenForPort(port: number): string {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const gatewayToken = resolveGatewayAuthToken();
  if (gatewayToken) {
    return deriveRelayAuthToken(gatewayToken, port);
  }
  throw new Error(
    "extension relay requires gateway auth token (set gateway.auth.token or OPENCLAW_GATEWAY_TOKEN)",
  );
}

export async function probeAuthenticatedOpenClawRelay(params: {
  baseUrl: string;
  relayAuthHeader: string;
  relayAuthToken: string;
  timeoutMs?: number;
}): Promise<boolean> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), params.timeoutMs ?? DEFAULT_RELAY_PROBE_TIMEOUT_MS);
  try {
    const versionUrl = new URL("/json/version", `${params.baseUrl}/`).toString();
    const res = await fetch(versionUrl, {
      signal: ctrl.signal,
      headers: { [params.relayAuthHeader]: params.relayAuthToken },
    });
    if (!res.ok) {
      return false;
    }
    const body = (await res.json()) as { Browser?: unknown };
    const browserName = typeof body?.Browser === "string" ? body.Browser.trim() : "";
    return browserName === OPENCLAW_RELAY_BROWSER;
  } catch {
    return false;
  } finally {
    clearTimeout(timer);
  }
}
