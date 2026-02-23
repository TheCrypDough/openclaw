/*
 * AUTO ANNOTATION
 * File: src/gateway/http-auth-helpers.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { IncomingMessage, ServerResponse } from "node:http";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { ResolvedGatewayAuth } from "./auth.js";
import { authorizeGatewayBearerRequestOrReply } from "./http-auth-helpers.js";

vi.mock("./auth.js", () => ({
  authorizeHttpGatewayConnect: vi.fn(),
}));

vi.mock("./http-common.js", () => ({
  sendGatewayAuthFailure: vi.fn(),
}));

vi.mock("./http-utils.js", () => ({
  getBearerToken: vi.fn(),
}));

const { authorizeHttpGatewayConnect } = await import("./auth.js");
const { sendGatewayAuthFailure } = await import("./http-common.js");
const { getBearerToken } = await import("./http-utils.js");

describe("authorizeGatewayBearerRequestOrReply", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("disables tailscale header auth for HTTP bearer checks", async () => {
    vi.mocked(getBearerToken).mockReturnValue(undefined);
    vi.mocked(authorizeHttpGatewayConnect).mockResolvedValue({
      ok: false,
      reason: "token_missing",
    });

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const ok = await authorizeGatewayBearerRequestOrReply({
      req: {} as IncomingMessage,
      res: {} as ServerResponse,
      auth: {
        mode: "token",
        token: "secret",
        password: undefined,
        allowTailscale: true,
      } satisfies ResolvedGatewayAuth,
    });

    expect(ok).toBe(false);
    expect(vi.mocked(authorizeHttpGatewayConnect)).toHaveBeenCalledWith(
      expect.objectContaining({
        connectAuth: null,
      }),
    );
    expect(vi.mocked(sendGatewayAuthFailure)).toHaveBeenCalledTimes(1);
  });

  it("forwards bearer token and returns true on successful auth", async () => {
    vi.mocked(getBearerToken).mockReturnValue("abc");
    vi.mocked(authorizeHttpGatewayConnect).mockResolvedValue({ ok: true, method: "token" });

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const ok = await authorizeGatewayBearerRequestOrReply({
      req: {} as IncomingMessage,
      res: {} as ServerResponse,
      auth: {
        mode: "token",
        token: "secret",
        password: undefined,
        allowTailscale: true,
      } satisfies ResolvedGatewayAuth,
    });

    expect(ok).toBe(true);
    expect(vi.mocked(authorizeHttpGatewayConnect)).toHaveBeenCalledWith(
      expect.objectContaining({
        connectAuth: { token: "abc", password: "abc" },
      }),
    );
    expect(vi.mocked(sendGatewayAuthFailure)).not.toHaveBeenCalled();
  });
});
