/*
 * AUTO ANNOTATION
 * File: src/browser/csrf.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { NextFunction, Request, Response } from "express";
import { isLoopbackHost } from "../gateway/net.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function firstHeader(value: string | string[] | undefined): string {
  return Array.isArray(value) ? (value[0] ?? "") : (value ?? "");
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function isMutatingMethod(method: string): boolean {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const m = (method || "").trim().toUpperCase();
  return m === "POST" || m === "PUT" || m === "PATCH" || m === "DELETE";
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function isLoopbackUrl(value: string): boolean {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const v = value.trim();
  if (!v || v === "null") {
    return false;
  }
  try {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const parsed = new URL(v);
    return isLoopbackHost(parsed.hostname);
  } catch {
    return false;
  }
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function shouldRejectBrowserMutation(params: {
  method: string;
  origin?: string;
  referer?: string;
  secFetchSite?: string;
}): boolean {
  if (!isMutatingMethod(params.method)) {
    return false;
  }

  // Strong signal when present: browser says this is cross-site.
  // Avoid being overly clever with "same-site" since localhost vs 127.0.0.1 may differ.
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const secFetchSite = (params.secFetchSite ?? "").trim().toLowerCase();
  if (secFetchSite === "cross-site") {
    return true;
  }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const origin = (params.origin ?? "").trim();
  if (origin) {
    return !isLoopbackUrl(origin);
  }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const referer = (params.referer ?? "").trim();
  if (referer) {
    return !isLoopbackUrl(referer);
  }

  // Non-browser clients (curl/undici/Node) typically send no Origin/Referer.
  return false;
}

export function browserMutationGuardMiddleware(): (
  req: Request,
  res: Response,
  next: NextFunction,
) => void {
  return (req: Request, res: Response, next: NextFunction) => {
    // OPTIONS is used for CORS preflight. Even if cross-origin, the preflight isn't mutating.
    const method = (req.method || "").trim().toUpperCase();
    if (method === "OPTIONS") {
      return next();
    }

    const origin = firstHeader(req.headers.origin);
    const referer = firstHeader(req.headers.referer);
    const secFetchSite = firstHeader(req.headers["sec-fetch-site"]);

    if (
      shouldRejectBrowserMutation({
        method,
        origin,
        referer,
        secFetchSite,
      })
    ) {
      res.status(403).send("Forbidden");
      return;
    }

    next();
  };
}
