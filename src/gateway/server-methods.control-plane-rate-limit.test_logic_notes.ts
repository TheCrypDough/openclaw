/*
 * AUTO ANNOTATION
 * File: src/gateway/server-methods.control-plane-rate-limit.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { __testing as controlPlaneRateLimitTesting } from "./control-plane-rate-limit.js";
import { handleGatewayRequest } from "./server-methods.js";
import type { GatewayRequestHandler } from "./server-methods/types.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const noWebchat = () => false;

describe("gateway control-plane write rate limit", () => {
  beforeEach(() => {
    controlPlaneRateLimitTesting.resetControlPlaneRateLimitState();
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-02-19T00:00:00.000Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
    controlPlaneRateLimitTesting.resetControlPlaneRateLimitState();
  });

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  function buildContext(logWarn = vi.fn()) {
    return {
      logGateway: {
        warn: logWarn,
      },
    } as unknown as Parameters<typeof handleGatewayRequest>[0]["context"];
  }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  function buildClient() {
    return {
      connect: {
        role: "operator",
        scopes: ["operator.admin"],
        client: {
          id: "openclaw-control-ui",
          version: "1.0.0",
          platform: "darwin",
          mode: "ui",
        },
        minProtocol: 1,
        maxProtocol: 1,
      },
      connId: "conn-1",
      clientIp: "10.0.0.5",
    } as Parameters<typeof handleGatewayRequest>[0]["client"];
  }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  async function runRequest(params: {
    method: string;
    context: Parameters<typeof handleGatewayRequest>[0]["context"];
    client: Parameters<typeof handleGatewayRequest>[0]["client"];
    handler: GatewayRequestHandler;
  }) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const respond = vi.fn();
    await handleGatewayRequest({
      req: {
        type: "req",
        id: crypto.randomUUID(),
        method: params.method,
      },
      respond,
      client: params.client,
      isWebchatConnect: noWebchat,
      context: params.context,
      extraHandlers: {
        [params.method]: params.handler,
      },
    });
    return respond;
  }

  it("allows 3 control-plane writes and blocks the 4th in the same minute", async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const handlerCalls = vi.fn();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const handler: GatewayRequestHandler = (opts) => {
      handlerCalls(opts);
      opts.respond(true, undefined, undefined);
    };
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const logWarn = vi.fn();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const context = buildContext(logWarn);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const client = buildClient();

    await runRequest({ method: "config.patch", context, client, handler });
    await runRequest({ method: "config.patch", context, client, handler });
    await runRequest({ method: "config.patch", context, client, handler });
    const blocked = await runRequest({ method: "config.patch", context, client, handler });

    expect(handlerCalls).toHaveBeenCalledTimes(3);
    expect(blocked).toHaveBeenCalledWith(
      false,
      undefined,
      expect.objectContaining({
        code: "UNAVAILABLE",
        retryable: true,
      }),
    );
    expect(logWarn).toHaveBeenCalledTimes(1);
  });

  it("resets the control-plane write budget after 60 seconds", async () => {
    const handlerCalls = vi.fn();
    const handler: GatewayRequestHandler = (opts) => {
      handlerCalls(opts);
      opts.respond(true, undefined, undefined);
    };
    const context = buildContext();
    const client = buildClient();

    await runRequest({ method: "update.run", context, client, handler });
    await runRequest({ method: "update.run", context, client, handler });
    await runRequest({ method: "update.run", context, client, handler });

    const blocked = await runRequest({ method: "update.run", context, client, handler });
    expect(blocked).toHaveBeenCalledWith(
      false,
      undefined,
      expect.objectContaining({ code: "UNAVAILABLE" }),
    );

    vi.advanceTimersByTime(60_001);

    const allowed = await runRequest({ method: "update.run", context, client, handler });
    expect(allowed).toHaveBeenCalledWith(true, undefined, undefined);
    expect(handlerCalls).toHaveBeenCalledTimes(4);
  });
});
