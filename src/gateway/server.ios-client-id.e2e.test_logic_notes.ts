/*
 * AUTO ANNOTATION
 * File: src/gateway/server.ios-client-id.e2e.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { afterAll, beforeAll, test } from "vitest";
import WebSocket from "ws";
import { PROTOCOL_VERSION } from "./protocol/index.js";
import { getFreePort, onceMessage, startGatewayServer } from "./test-helpers.server.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
let server: Awaited<ReturnType<typeof startGatewayServer>> | undefined;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
let port = 0;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
let previousToken: string | undefined;

beforeAll(async () => {
  previousToken = process.env.OPENCLAW_GATEWAY_TOKEN;
  process.env.OPENCLAW_GATEWAY_TOKEN = "test-gateway-token-1234567890";
  port = await getFreePort();
  server = await startGatewayServer(port);
});

afterAll(async () => {
  await server?.close();
  if (previousToken === undefined) {
    delete process.env.OPENCLAW_GATEWAY_TOKEN;
  } else {
    process.env.OPENCLAW_GATEWAY_TOKEN = previousToken;
  }
});

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function connectReq(
  ws: WebSocket,
  params: { clientId: string; platform: string; token?: string; password?: string },
): Promise<{ ok: boolean; error?: { message?: string } }> {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const id = `c-${Math.random().toString(16).slice(2)}`;
  ws.send(
    JSON.stringify({
      type: "req",
      id,
      method: "connect",
      params: {
        minProtocol: PROTOCOL_VERSION,
        maxProtocol: PROTOCOL_VERSION,
        client: {
          id: params.clientId,
          version: "dev",
          platform: params.platform,
          mode: "node",
        },
        auth: {
          token: params.token,
          password: params.password,
        },
        role: "node",
        scopes: [],
        caps: ["canvas"],
        commands: ["system.notify"],
        permissions: {},
      },
    }),
  );

  return onceMessage(
    ws,
    (o) => (o as { type?: string }).type === "res" && (o as { id?: string }).id === id,
  );
}

test.each([
  { clientId: "openclaw-ios", platform: "ios" },
  { clientId: "openclaw-android", platform: "android" },
])("accepts $clientId as a valid gateway client id", async ({ clientId, platform }) => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const ws = new WebSocket(`ws://127.0.0.1:${port}`);
  await new Promise<void>((resolve) => ws.once("open", resolve));

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const res = await connectReq(ws, { clientId, platform });
  // We don't care if auth fails here; we only care that schema validation accepts the client id.
  // A schema rejection would close the socket before sending a response.
  if (!res.ok) {
    // allow unauthorized error when gateway requires auth
    // but reject schema validation errors
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const message = String(res.error?.message ?? "");
    if (message.includes("invalid connect params")) {
      throw new Error(message);
    }
  }

  ws.close();
});
