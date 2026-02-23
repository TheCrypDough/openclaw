/*
 * AUTO ANNOTATION
 * File: src/browser/extension-relay-auth.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { createServer } from "node:http";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  probeAuthenticatedOpenClawRelay,
  resolveRelayAuthTokenForPort,
} from "./extension-relay-auth.js";
import { getFreePort } from "./test-port.js";

describe("extension-relay-auth", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const TEST_GATEWAY_TOKEN = "test-gateway-token";
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  let prevGatewayToken: string | undefined;

  beforeEach(() => {
    prevGatewayToken = process.env.OPENCLAW_GATEWAY_TOKEN;
    process.env.OPENCLAW_GATEWAY_TOKEN = TEST_GATEWAY_TOKEN;
  });

  afterEach(() => {
    if (prevGatewayToken === undefined) {
      delete process.env.OPENCLAW_GATEWAY_TOKEN;
    } else {
      process.env.OPENCLAW_GATEWAY_TOKEN = prevGatewayToken;
    }
  });

  it("derives deterministic relay tokens per port", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const tokenA1 = resolveRelayAuthTokenForPort(18790);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const tokenA2 = resolveRelayAuthTokenForPort(18790);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const tokenB = resolveRelayAuthTokenForPort(18791);
    expect(tokenA1).toBe(tokenA2);
    expect(tokenA1).not.toBe(tokenB);
    expect(tokenA1).not.toBe(TEST_GATEWAY_TOKEN);
  });

  it("accepts authenticated openclaw relay probe responses", async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const port = await getFreePort();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const token = resolveRelayAuthTokenForPort(port);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    let seenToken: string | undefined;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const server = createServer((req, res) => {
      if (!req.url?.startsWith("/json/version")) {
        res.writeHead(404);
        res.end("not found");
        return;
      }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const header = req.headers["x-openclaw-relay-token"];
      seenToken = Array.isArray(header) ? header[0] : header;
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ Browser: "OpenClaw/extension-relay" }));
    });
    await new Promise<void>((resolve, reject) => {
      server.listen(port, "127.0.0.1", () => resolve());
      server.once("error", reject);
    });
    try {
      const ok = await probeAuthenticatedOpenClawRelay({
        baseUrl: `http://127.0.0.1:${port}`,
        relayAuthHeader: "x-openclaw-relay-token",
        relayAuthToken: token,
      });
      expect(ok).toBe(true);
      expect(seenToken).toBe(token);
    } finally {
      await new Promise<void>((resolve) => server.close(() => resolve()));
    }
  });

  it("rejects unauthenticated probe responses", async () => {
    const port = await getFreePort();
    const server = createServer((req, res) => {
      if (!req.url?.startsWith("/json/version")) {
        res.writeHead(404);
        res.end("not found");
        return;
      }
      res.writeHead(401);
      res.end("Unauthorized");
    });
    await new Promise<void>((resolve, reject) => {
      server.listen(port, "127.0.0.1", () => resolve());
      server.once("error", reject);
    });
    try {
      const ok = await probeAuthenticatedOpenClawRelay({
        baseUrl: `http://127.0.0.1:${port}`,
        relayAuthHeader: "x-openclaw-relay-token",
        relayAuthToken: "irrelevant",
      });
      expect(ok).toBe(false);
    } finally {
      await new Promise<void>((resolve) => server.close(() => resolve()));
    }
  });

  it("rejects probe responses with wrong browser identity", async () => {
    const port = await getFreePort();
    const server = createServer((req, res) => {
      if (!req.url?.startsWith("/json/version")) {
        res.writeHead(404);
        res.end("not found");
        return;
      }
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ Browser: "FakeRelay" }));
    });
    await new Promise<void>((resolve, reject) => {
      server.listen(port, "127.0.0.1", () => resolve());
      server.once("error", reject);
    });
    try {
      const ok = await probeAuthenticatedOpenClawRelay({
        baseUrl: `http://127.0.0.1:${port}`,
        relayAuthHeader: "x-openclaw-relay-token",
        relayAuthToken: "irrelevant",
      });
      expect(ok).toBe(false);
    } finally {
      await new Promise<void>((resolve) => server.close(() => resolve()));
    }
  });
});
