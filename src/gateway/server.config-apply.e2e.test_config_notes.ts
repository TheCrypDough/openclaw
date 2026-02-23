# AUTOPLACEHOLDER_ANNOTATION: src/gateway/server.config-apply.e2e.test.ts
# Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
# Area: Core application source (gateway, CLI, providers, channels)
# System effect: When changed, core execution path for message, session, or provider behavior may change.
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { WebSocket } from "ws";
import {
  connectOk,
  getFreePort,
  installGatewayTestHooks,
  onceMessage,
  startGatewayServer,
} from "./test-helpers.js";

installGatewayTestHooks({ scope: "suite" });

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
let server: Awaited<ReturnType<typeof startGatewayServer>>;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
let port = 0;

beforeAll(async () => {
  port = await getFreePort();
  server = await startGatewayServer(port, { controlUiEnabled: true });
});

afterAll(async () => {
  await server.close();
});

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const openClient = async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const ws = new WebSocket(`ws://127.0.0.1:${port}`);
  await new Promise<void>((resolve) => ws.once("open", resolve));
  await connectOk(ws);
  return ws;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const sendConfigApply = async (ws: WebSocket, id: string, raw: unknown) => {
  ws.send(
    JSON.stringify({
      type: "req",
      id,
      method: "config.apply",
      params: { raw },
    }),
  );
  return onceMessage<{ ok: boolean; error?: { message?: string } }>(ws, (o) => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const msg = o as { type?: string; id?: string };
    return msg.type === "res" && msg.id === id;
  });
};

describe("gateway config.apply", () => {
  it("rejects invalid raw config", async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const ws = await openClient();
    try {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const id = "req-1";
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const res = await sendConfigApply(ws, id, "{");
      expect(res.ok).toBe(false);
      expect(res.error?.message ?? "").toMatch(/invalid|SyntaxError/i);
    } finally {
      ws.close();
    }
  });

  it("requires raw to be a string", async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const ws = await openClient();
    try {
      const id = "req-2";
      const res = await sendConfigApply(ws, id, { gateway: { mode: "local" } });
      expect(res.ok).toBe(false);
      expect(res.error?.message ?? "").toContain("raw");
    } finally {
      ws.close();
    }
  });
});
