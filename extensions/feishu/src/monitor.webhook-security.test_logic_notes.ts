/*
 * AUTO ANNOTATION
 * File: extensions/feishu/src/monitor.webhook-security.test.ts
 * Purpose: Extension package component that adds a channel/tool integration or adapter.
 * Module area: Pluggable channel and service extensions
 * System effect: Alters gateway ecosystem integration points and feature surface exposed through plugin loading.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { createServer } from "node:http";
import type { AddressInfo } from "node:net";
import type { ClawdbotConfig } from "openclaw/plugin-sdk";
import { afterEach, describe, expect, it, vi } from "vitest";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const probeFeishuMock = vi.hoisted(() => vi.fn());

vi.mock("@larksuiteoapi/node-sdk", () => ({
  adaptDefault: vi.fn(
    () => (_req: unknown, res: { statusCode?: number; end: (s: string) => void }) => {
      res.statusCode = 200;
      res.end("ok");
    },
  ),
}));

vi.mock("./probe.js", () => ({
  probeFeishu: probeFeishuMock,
}));

vi.mock("./client.js", () => ({
  createFeishuWSClient: vi.fn(() => ({ start: vi.fn() })),
  createEventDispatcher: vi.fn(() => ({ register: vi.fn() })),
}));

import { monitorFeishuProvider, stopFeishuMonitor } from "./monitor.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
async function getFreePort(): Promise<number> {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const server = createServer();
  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", () => resolve()));
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const address = server.address() as AddressInfo | null;
  if (!address) {
    throw new Error("missing server address");
  }
  await new Promise<void>((resolve) => server.close(() => resolve()));
  return address.port;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
async function waitUntilServerReady(url: string): Promise<void> {
  for (let i = 0; i < 50; i += 1) {
    try {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const response = await fetch(url, { method: "GET" });
      if (response.status >= 200 && response.status < 500) {
        return;
      }
    } catch {
      // retry
    }
    await new Promise((resolve) => setTimeout(resolve, 20));
  }
  throw new Error(`server did not start: ${url}`);
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function buildConfig(params: {
  accountId: string;
  path: string;
  port: number;
  verificationToken?: string;
}): ClawdbotConfig {
  return {
    channels: {
      feishu: {
        enabled: true,
        accounts: {
          [params.accountId]: {
            enabled: true,
            appId: "cli_test",
            appSecret: "secret_test",
            connectionMode: "webhook",
            webhookHost: "127.0.0.1",
            webhookPort: params.port,
            webhookPath: params.path,
            verificationToken: params.verificationToken,
          },
        },
      },
    },
  } as ClawdbotConfig;
}

afterEach(() => {
  stopFeishuMonitor();
});

describe("Feishu webhook security hardening", () => {
  it("rejects webhook mode without verificationToken", async () => {
    probeFeishuMock.mockResolvedValue({ ok: true, botOpenId: "bot_open_id" });

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const cfg = buildConfig({
      accountId: "missing-token",
      path: "/hook-missing-token",
      port: await getFreePort(),
    });

    await expect(monitorFeishuProvider({ config: cfg })).rejects.toThrow(
      /requires verificationToken/i,
    );
  });

  it("returns 415 for POST requests without json content type", async () => {
    probeFeishuMock.mockResolvedValue({ ok: true, botOpenId: "bot_open_id" });
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const port = await getFreePort();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const path = "/hook-content-type";
    const cfg = buildConfig({
      accountId: "content-type",
      path,
      port,
      verificationToken: "verify_token",
    });

    const abortController = new AbortController();
    const runtime = { log: vi.fn(), error: vi.fn(), exit: vi.fn() };
    const monitorPromise = monitorFeishuProvider({
      config: cfg,
      runtime,
      abortSignal: abortController.signal,
    });

    await waitUntilServerReady(`http://127.0.0.1:${port}${path}`);

    const response = await fetch(`http://127.0.0.1:${port}${path}`, {
      method: "POST",
      headers: { "content-type": "text/plain" },
      body: "{}",
    });

    expect(response.status).toBe(415);
    expect(await response.text()).toBe("Unsupported Media Type");

    abortController.abort();
    await monitorPromise;
  });

  it("rate limits webhook burst traffic with 429", async () => {
    probeFeishuMock.mockResolvedValue({ ok: true, botOpenId: "bot_open_id" });
    const port = await getFreePort();
    const path = "/hook-rate-limit";
    const cfg = buildConfig({
      accountId: "rate-limit",
      path,
      port,
      verificationToken: "verify_token",
    });

    const abortController = new AbortController();
    const runtime = { log: vi.fn(), error: vi.fn(), exit: vi.fn() };
    const monitorPromise = monitorFeishuProvider({
      config: cfg,
      runtime,
      abortSignal: abortController.signal,
    });

    await waitUntilServerReady(`http://127.0.0.1:${port}${path}`);

    let saw429 = false;
    for (let i = 0; i < 130; i += 1) {
      const response = await fetch(`http://127.0.0.1:${port}${path}`, {
        method: "POST",
        headers: { "content-type": "text/plain" },
        body: "{}",
      });
      if (response.status === 429) {
        saw429 = true;
        expect(await response.text()).toBe("Too Many Requests");
        break;
      }
    }

    expect(saw429).toBe(true);

    abortController.abort();
    await monitorPromise;
  });
});
