/*
 * AUTO ANNOTATION
 * File: src/browser/server-middleware.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { Express } from "express";
import express from "express";
import { browserMutationGuardMiddleware } from "./csrf.js";
import { isAuthorizedBrowserRequest } from "./http-auth.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function installBrowserCommonMiddleware(app: Express) {
  app.use((req, res, next) => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const ctrl = new AbortController();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const abort = () => ctrl.abort(new Error("request aborted"));
    req.once("aborted", abort);
    res.once("close", () => {
      if (!res.writableEnded) {
        abort();
      }
    });
    // Make the signal available to browser route handlers (best-effort).
    (req as unknown as { signal?: AbortSignal }).signal = ctrl.signal;
    next();
  });
  app.use(express.json({ limit: "1mb" }));
  app.use(browserMutationGuardMiddleware());
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function installBrowserAuthMiddleware(
  app: Express,
  auth: { token?: string; password?: string },
) {
  if (!auth.token && !auth.password) {
    return;
  }
  app.use((req, res, next) => {
    if (isAuthorizedBrowserRequest(req, auth)) {
      return next();
    }
    res.status(401).send("Unauthorized");
  });
}
