/*
 * AUTO ANNOTATION
 * File: src/gateway/server.e2e-ws-harness.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { WebSocket } from "ws";
import { captureEnv } from "../test-utils/env.js";
import { connectOk, getFreePort, startGatewayServer } from "./test-helpers.js";

export type GatewayWsClient = {
  ws: WebSocket;
  hello: unknown;
};

export type GatewayServerHarness = {
  port: number;
  server: Awaited<ReturnType<typeof startGatewayServer>>;
  openClient: (opts?: Parameters<typeof connectOk>[1]) => Promise<GatewayWsClient>;
  close: () => Promise<void>;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function startGatewayServerHarness(): Promise<GatewayServerHarness> {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const envSnapshot = captureEnv(["OPENCLAW_GATEWAY_TOKEN"]);
  delete process.env.OPENCLAW_GATEWAY_TOKEN;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const port = await getFreePort();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const server = await startGatewayServer(port);

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const openClient = async (opts?: Parameters<typeof connectOk>[1]): Promise<GatewayWsClient> => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const ws = new WebSocket(`ws://127.0.0.1:${port}`);
    await new Promise<void>((resolve) => ws.once("open", resolve));
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const hello = await connectOk(ws, opts);
    return { ws, hello };
  };

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const close = async () => {
    await server.close();
    envSnapshot.restore();
  };

  return { port, server, openClient, close };
}
