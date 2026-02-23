/*
 * AUTO ANNOTATION
 * File: src/browser/server.auth-token-gates-http.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import { fetch as realFetch } from "undici";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { isAuthorizedBrowserRequest } from "./http-auth.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
let server: ReturnType<typeof createServer> | null = null;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
let port = 0;

describe("browser control HTTP auth", () => {
  beforeEach(async () => {
    server = createServer((req: IncomingMessage, res: ServerResponse) => {
      if (!isAuthorizedBrowserRequest(req, { token: "browser-control-secret" })) {
        res.statusCode = 401;
        res.setHeader("Content-Type", "text/plain; charset=utf-8");
        res.end("Unauthorized");
        return;
      }
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json; charset=utf-8");
      res.end(JSON.stringify({ ok: true }));
    });
    await new Promise<void>((resolve, reject) => {
      server?.once("error", reject);
      server?.listen(0, "127.0.0.1", () => resolve());
    });
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const addr = server.address();
    if (!addr || typeof addr === "string") {
      throw new Error("server address missing");
    }
    port = addr.port;
  });

  afterEach(async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const current = server;
    server = null;
    if (!current) {
      return;
    }
    await new Promise<void>((resolve) => current.close(() => resolve()));
  });

  it("requires bearer auth for standalone browser HTTP routes", async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const base = `http://127.0.0.1:${port}`;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const missingAuth = await realFetch(`${base}/`);
    expect(missingAuth.status).toBe(401);
    expect(await missingAuth.text()).toContain("Unauthorized");

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const badAuth = await realFetch(`${base}/`, {
      headers: {
        Authorization: "Bearer wrong-token",
      },
    });
    expect(badAuth.status).toBe(401);

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const ok = await realFetch(`${base}/`, {
      headers: {
        Authorization: "Bearer browser-control-secret",
      },
    });
    expect(ok.status).toBe(200);
    expect((await ok.json()) as { ok: boolean }).toEqual({ ok: true });
  });
});
