/*
 * AUTO ANNOTATION
 * File: extensions/googlechat/src/monitor.webhook-routing.test.ts
 * Purpose: Extension package component that adds a channel/tool integration or adapter.
 * Module area: Pluggable channel and service extensions
 * System effect: Alters gateway ecosystem integration points and feature surface exposed through plugin loading.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { EventEmitter } from "node:events";
import type { IncomingMessage } from "node:http";
import type { OpenClawConfig, PluginRuntime } from "openclaw/plugin-sdk";
import { describe, expect, it, vi } from "vitest";
import { createMockServerResponse } from "../../../src/test-utils/mock-http-response.js";
import type { ResolvedGoogleChatAccount } from "./accounts.js";
import { verifyGoogleChatRequest } from "./auth.js";
import { handleGoogleChatWebhookRequest, registerGoogleChatWebhookTarget } from "./monitor.js";

vi.mock("./auth.js", () => ({
  verifyGoogleChatRequest: vi.fn(),
}));

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function createWebhookRequest(params: {
  authorization?: string;
  payload: unknown;
  path?: string;
}): IncomingMessage {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const req = new EventEmitter() as IncomingMessage & {
    destroyed?: boolean;
    destroy: (error?: Error) => IncomingMessage;
  };
  req.method = "POST";
  req.url = params.path ?? "/googlechat";
  req.headers = {
    authorization: params.authorization ?? "",
    "content-type": "application/json",
  };
  req.destroyed = false;
  req.destroy = () => {
    req.destroyed = true;
    return req;
  };

  void Promise.resolve().then(() => {
    req.emit("data", Buffer.from(JSON.stringify(params.payload), "utf-8"));
    if (!req.destroyed) {
      req.emit("end");
    }
  });

  return req;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const baseAccount = (accountId: string) =>
  ({
    accountId,
    enabled: true,
    credentialSource: "none",
    config: {},
  }) as ResolvedGoogleChatAccount;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function registerTwoTargets() {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const sinkA = vi.fn();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const sinkB = vi.fn();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const core = {} as PluginRuntime;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const config = {} as OpenClawConfig;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const unregisterA = registerGoogleChatWebhookTarget({
    account: baseAccount("A"),
    config,
    runtime: {},
    core,
    path: "/googlechat",
    statusSink: sinkA,
    mediaMaxMb: 5,
  });
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const unregisterB = registerGoogleChatWebhookTarget({
    account: baseAccount("B"),
    config,
    runtime: {},
    core,
    path: "/googlechat",
    statusSink: sinkB,
    mediaMaxMb: 5,
  });

  return {
    sinkA,
    sinkB,
    unregister: () => {
      unregisterA();
      unregisterB();
    },
  };
}

describe("Google Chat webhook routing", () => {
  it("rejects ambiguous routing when multiple targets on the same path verify successfully", async () => {
    vi.mocked(verifyGoogleChatRequest).mockResolvedValue({ ok: true });

    const { sinkA, sinkB, unregister } = registerTwoTargets();

    try {
      const res = createMockServerResponse();
      const handled = await handleGoogleChatWebhookRequest(
        createWebhookRequest({
          authorization: "Bearer test-token",
          payload: { type: "ADDED_TO_SPACE", space: { name: "spaces/AAA" } },
        }),
        res,
      );

      expect(handled).toBe(true);
      expect(res.statusCode).toBe(401);
      expect(sinkA).not.toHaveBeenCalled();
      expect(sinkB).not.toHaveBeenCalled();
    } finally {
      unregister();
    }
  });

  it("routes to the single verified target when earlier targets fail verification", async () => {
    vi.mocked(verifyGoogleChatRequest)
      .mockResolvedValueOnce({ ok: false, reason: "invalid" })
      .mockResolvedValueOnce({ ok: true });

    const { sinkA, sinkB, unregister } = registerTwoTargets();

    try {
      const res = createMockServerResponse();
      const handled = await handleGoogleChatWebhookRequest(
        createWebhookRequest({
          authorization: "Bearer test-token",
          payload: { type: "ADDED_TO_SPACE", space: { name: "spaces/BBB" } },
        }),
        res,
      );

      expect(handled).toBe(true);
      expect(res.statusCode).toBe(200);
      expect(sinkA).not.toHaveBeenCalled();
      expect(sinkB).toHaveBeenCalledTimes(1);
    } finally {
      unregister();
    }
  });
});
