/*
 * AUTO ANNOTATION
 * File: src/browser/http-auth.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { IncomingMessage } from "node:http";
import { safeEqualSecret } from "../security/secret-equal.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function firstHeaderValue(value: string | string[] | undefined): string {
  return Array.isArray(value) ? (value[0] ?? "") : (value ?? "");
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function parseBearerToken(authorization: string): string | undefined {
  if (!authorization || !authorization.toLowerCase().startsWith("bearer ")) {
    return undefined;
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const token = authorization.slice(7).trim();
  return token || undefined;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function parseBasicPassword(authorization: string): string | undefined {
  if (!authorization || !authorization.toLowerCase().startsWith("basic ")) {
    return undefined;
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const encoded = authorization.slice(6).trim();
  if (!encoded) {
    return undefined;
  }
  try {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const decoded = Buffer.from(encoded, "base64").toString("utf8");
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const sep = decoded.indexOf(":");
    if (sep < 0) {
      return undefined;
    }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const password = decoded.slice(sep + 1).trim();
    return password || undefined;
  } catch {
    return undefined;
  }
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function isAuthorizedBrowserRequest(
  req: IncomingMessage,
  auth: { token?: string; password?: string },
): boolean {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const authorization = firstHeaderValue(req.headers.authorization).trim();

  if (auth.token) {
    const bearer = parseBearerToken(authorization);
    if (bearer && safeEqualSecret(bearer, auth.token)) {
      return true;
    }
  }

  if (auth.password) {
    const passwordHeader = firstHeaderValue(req.headers["x-openclaw-password"]).trim();
    if (passwordHeader && safeEqualSecret(passwordHeader, auth.password)) {
      return true;
    }

    const basicPassword = parseBasicPassword(authorization);
    if (basicPassword && safeEqualSecret(basicPassword, auth.password)) {
      return true;
    }
  }

  return false;
}
