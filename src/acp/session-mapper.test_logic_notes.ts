/*
 * AUTO ANNOTATION
 * File: src/acp/session-mapper.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { describe, expect, it, vi } from "vitest";
import type { GatewayClient } from "../gateway/client.js";
import { parseSessionMeta, resolveSessionKey } from "./session-mapper.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function createGateway(resolveLabelKey = "agent:main:label"): {
  gateway: GatewayClient;
  request: ReturnType<typeof vi.fn>;
} {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const request = vi.fn(async (method: string, params: Record<string, unknown>) => {
    if (method === "sessions.resolve" && "label" in params) {
      return { ok: true, key: resolveLabelKey };
    }
    if (method === "sessions.resolve" && "key" in params) {
      return { ok: true, key: params.key as string };
    }
    return { ok: true };
  });

  return {
    gateway: { request } as unknown as GatewayClient,
    request,
  };
}

describe("acp session mapper", () => {
  it("prefers explicit sessionLabel over sessionKey", async () => {
    const { gateway, request } = createGateway();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const meta = parseSessionMeta({ sessionLabel: "support", sessionKey: "agent:main:main" });

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const key = await resolveSessionKey({
      meta,
      fallbackKey: "acp:fallback",
      gateway,
      opts: {},
    });

    expect(key).toBe("agent:main:label");
    expect(request).toHaveBeenCalledTimes(1);
    expect(request).toHaveBeenCalledWith("sessions.resolve", { label: "support" });
  });

  it("lets meta sessionKey override default label", async () => {
    const { gateway, request } = createGateway();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const meta = parseSessionMeta({ sessionKey: "agent:main:override" });

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const key = await resolveSessionKey({
      meta,
      fallbackKey: "acp:fallback",
      gateway,
      opts: { defaultSessionLabel: "default-label" },
    });

    expect(key).toBe("agent:main:override");
    expect(request).not.toHaveBeenCalled();
  });
});
