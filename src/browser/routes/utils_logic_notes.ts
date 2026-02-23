/*
 * AUTO ANNOTATION
 * File: src/browser/routes/utils.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { parseBooleanValue } from "../../utils/boolean.js";
import type { BrowserRouteContext, ProfileContext } from "../server-context.js";
import type { BrowserRequest, BrowserResponse } from "./types.js";

/**
 * Extract profile name from query string or body and get profile context.
 * Query string takes precedence over body for consistency with GET routes.
 */
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function getProfileContext(
  req: BrowserRequest,
  ctx: BrowserRouteContext,
): ProfileContext | { error: string; status: number } {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  let profileName: string | undefined;

  // Check query string first (works for GET and POST)
  if (typeof req.query.profile === "string") {
    profileName = req.query.profile.trim() || undefined;
  }

  // Fall back to body for POST requests
  if (!profileName && req.body && typeof req.body === "object") {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const body = req.body as Record<string, unknown>;
    if (typeof body.profile === "string") {
      profileName = body.profile.trim() || undefined;
    }
  }

  try {
    return ctx.forProfile(profileName);
  } catch (err) {
    return { error: String(err), status: 404 };
  }
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function jsonError(res: BrowserResponse, status: number, message: string) {
  res.status(status).json({ error: message });
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function toStringOrEmpty(value: unknown) {
  if (typeof value === "string") {
    return value.trim();
  }
  if (typeof value === "number" || typeof value === "boolean") {
    return String(value).trim();
  }
  return "";
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function toNumber(value: unknown) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === "string" && value.trim()) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : undefined;
  }
  return undefined;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function toBoolean(value: unknown) {
  return parseBooleanValue(value, {
    truthy: ["true", "1", "yes"],
    falsy: ["false", "0", "no"],
  });
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function toStringArray(value: unknown): string[] | undefined {
  if (!Array.isArray(value)) {
    return undefined;
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const strings = value.map((v) => toStringOrEmpty(v)).filter(Boolean);
  return strings.length ? strings : undefined;
}
