/*
 * AUTO ANNOTATION
 * File: src/browser/bridge-server.auth.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { afterEach, describe, expect, it } from "vitest";
import { startBrowserBridgeServer, stopBrowserBridgeServer } from "./bridge-server.js";
import type { ResolvedBrowserConfig } from "./config.js";
import {
  DEFAULT_OPENCLAW_BROWSER_COLOR,
  DEFAULT_OPENCLAW_BROWSER_PROFILE_NAME,
} from "./constants.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function buildResolvedConfig(): ResolvedBrowserConfig {
  return {
    enabled: true,
    evaluateEnabled: false,
    controlPort: 0,
    cdpProtocol: "http",
    cdpHost: "127.0.0.1",
    cdpIsLoopback: true,
    remoteCdpTimeoutMs: 1500,
    remoteCdpHandshakeTimeoutMs: 3000,
    extraArgs: [],
    color: DEFAULT_OPENCLAW_BROWSER_COLOR,
    executablePath: undefined,
    headless: true,
    noSandbox: false,
    attachOnly: true,
    defaultProfile: DEFAULT_OPENCLAW_BROWSER_PROFILE_NAME,
    profiles: {
      [DEFAULT_OPENCLAW_BROWSER_PROFILE_NAME]: {
        cdpPort: 1,
        color: DEFAULT_OPENCLAW_BROWSER_COLOR,
      },
    },
  } as unknown as ResolvedBrowserConfig;
}

describe("startBrowserBridgeServer auth", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const servers: Array<{ stop: () => Promise<void> }> = [];

  afterEach(async () => {
    while (servers.length) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const s = servers.pop();
      if (s) {
        await s.stop();
      }
    }
  });

  it("rejects unauthenticated requests when authToken is set", async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const bridge = await startBrowserBridgeServer({
      resolved: buildResolvedConfig(),
      authToken: "secret-token",
    });
    servers.push({ stop: () => stopBrowserBridgeServer(bridge.server) });

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const unauth = await fetch(`${bridge.baseUrl}/`);
    expect(unauth.status).toBe(401);

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const authed = await fetch(`${bridge.baseUrl}/`, {
      headers: { Authorization: "Bearer secret-token" },
    });
    expect(authed.status).toBe(200);
  });

  it("accepts x-openclaw-password when authPassword is set", async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const bridge = await startBrowserBridgeServer({
      resolved: buildResolvedConfig(),
      authPassword: "secret-password",
    });
    servers.push({ stop: () => stopBrowserBridgeServer(bridge.server) });

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const unauth = await fetch(`${bridge.baseUrl}/`);
    expect(unauth.status).toBe(401);

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const authed = await fetch(`${bridge.baseUrl}/`, {
      headers: { "x-openclaw-password": "secret-password" },
    });
    expect(authed.status).toBe(200);
  });

  it("requires auth params", async () => {
    await expect(
      startBrowserBridgeServer({
        resolved: buildResolvedConfig(),
      }),
    ).rejects.toThrow(/requires auth/i);
  });
});
