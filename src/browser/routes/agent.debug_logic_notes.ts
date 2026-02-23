/*
 * AUTO ANNOTATION
 * File: src/browser/routes/agent.debug.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import type { BrowserRouteContext } from "../server-context.js";
import {
  readBody,
  resolveTargetIdFromBody,
  resolveTargetIdFromQuery,
  withPlaywrightRouteContext,
} from "./agent.shared.js";
import { DEFAULT_TRACE_DIR, resolvePathWithinRoot } from "./path-output.js";
import type { BrowserRouteRegistrar } from "./types.js";
import { toBoolean, toStringOrEmpty } from "./utils.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function registerBrowserAgentDebugRoutes(
  app: BrowserRouteRegistrar,
  ctx: BrowserRouteContext,
) {
  app.get("/console", async (req, res) => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const targetId = resolveTargetIdFromQuery(req.query);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const level = typeof req.query.level === "string" ? req.query.level : "";

    await withPlaywrightRouteContext({
      req,
      res,
      ctx,
      targetId,
      feature: "console messages",
      run: async ({ cdpUrl, tab, pw }) => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        const messages = await pw.getConsoleMessagesViaPlaywright({
          cdpUrl,
          targetId: tab.targetId,
          level: level.trim() || undefined,
        });
        res.json({ ok: true, messages, targetId: tab.targetId });
      },
    });
  });

  app.get("/errors", async (req, res) => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const targetId = resolveTargetIdFromQuery(req.query);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const clear = toBoolean(req.query.clear) ?? false;

    await withPlaywrightRouteContext({
      req,
      res,
      ctx,
      targetId,
      feature: "page errors",
      run: async ({ cdpUrl, tab, pw }) => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        const result = await pw.getPageErrorsViaPlaywright({
          cdpUrl,
          targetId: tab.targetId,
          clear,
        });
        res.json({ ok: true, targetId: tab.targetId, ...result });
      },
    });
  });

  app.get("/requests", async (req, res) => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const targetId = resolveTargetIdFromQuery(req.query);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const filter = typeof req.query.filter === "string" ? req.query.filter : "";
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const clear = toBoolean(req.query.clear) ?? false;

    await withPlaywrightRouteContext({
      req,
      res,
      ctx,
      targetId,
      feature: "network requests",
      run: async ({ cdpUrl, tab, pw }) => {
        const result = await pw.getNetworkRequestsViaPlaywright({
          cdpUrl,
          targetId: tab.targetId,
          filter: filter.trim() || undefined,
          clear,
        });
        res.json({ ok: true, targetId: tab.targetId, ...result });
      },
    });
  });

  app.post("/trace/start", async (req, res) => {
    const body = readBody(req);
    const targetId = resolveTargetIdFromBody(body);
    const screenshots = toBoolean(body.screenshots) ?? undefined;
    const snapshots = toBoolean(body.snapshots) ?? undefined;
    const sources = toBoolean(body.sources) ?? undefined;

    await withPlaywrightRouteContext({
      req,
      res,
      ctx,
      targetId,
      feature: "trace start",
      run: async ({ cdpUrl, tab, pw }) => {
        await pw.traceStartViaPlaywright({
          cdpUrl,
          targetId: tab.targetId,
          screenshots,
          snapshots,
          sources,
        });
        res.json({ ok: true, targetId: tab.targetId });
      },
    });
  });

  app.post("/trace/stop", async (req, res) => {
    const body = readBody(req);
    const targetId = resolveTargetIdFromBody(body);
    const out = toStringOrEmpty(body.path) || "";

    await withPlaywrightRouteContext({
      req,
      res,
      ctx,
      targetId,
      feature: "trace stop",
      run: async ({ cdpUrl, tab, pw }) => {
        const id = crypto.randomUUID();
        const dir = DEFAULT_TRACE_DIR;
        await fs.mkdir(dir, { recursive: true });
        const tracePathResult = resolvePathWithinRoot({
          rootDir: dir,
          requestedPath: out,
          scopeLabel: "trace directory",
          defaultFileName: `browser-trace-${id}.zip`,
        });
        if (!tracePathResult.ok) {
          res.status(400).json({ error: tracePathResult.error });
          return;
        }
        const tracePath = tracePathResult.path;
        await pw.traceStopViaPlaywright({
          cdpUrl,
          targetId: tab.targetId,
          path: tracePath,
        });
        res.json({
          ok: true,
          targetId: tab.targetId,
          path: path.resolve(tracePath),
        });
      },
    });
  });
}
