/*
 * AUTO ANNOTATION
 * File: src/gateway/http-endpoint-helpers.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { IncomingMessage, ServerResponse } from "node:http";
import { describe, expect, it, vi } from "vitest";
import type { ResolvedGatewayAuth } from "./auth.js";
import { handleGatewayPostJsonEndpoint } from "./http-endpoint-helpers.js";

vi.mock("./http-auth-helpers.js", () => {
  return {
    authorizeGatewayBearerRequestOrReply: vi.fn(),
  };
});

vi.mock("./http-common.js", () => {
  return {
    readJsonBodyOrError: vi.fn(),
    sendMethodNotAllowed: vi.fn(),
  };
});

const { authorizeGatewayBearerRequestOrReply } = await import("./http-auth-helpers.js");
const { readJsonBodyOrError, sendMethodNotAllowed } = await import("./http-common.js");

describe("handleGatewayPostJsonEndpoint", () => {
  it("returns false when path does not match", async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const result = await handleGatewayPostJsonEndpoint(
      {
        url: "/nope",
        method: "POST",
        headers: { host: "localhost" },
      } as unknown as IncomingMessage,
      {} as unknown as ServerResponse,
      { pathname: "/v1/ok", auth: {} as unknown as ResolvedGatewayAuth, maxBodyBytes: 1 },
    );
    expect(result).toBe(false);
  });

  it("returns undefined and replies when method is not POST", async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const mockedSendMethodNotAllowed = vi.mocked(sendMethodNotAllowed);
    mockedSendMethodNotAllowed.mockClear();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const result = await handleGatewayPostJsonEndpoint(
      {
        url: "/v1/ok",
        method: "GET",
        headers: { host: "localhost" },
      } as unknown as IncomingMessage,
      {} as unknown as ServerResponse,
      { pathname: "/v1/ok", auth: {} as unknown as ResolvedGatewayAuth, maxBodyBytes: 1 },
    );
    expect(result).toBeUndefined();
    expect(mockedSendMethodNotAllowed).toHaveBeenCalledTimes(1);
  });

  it("returns undefined when auth fails", async () => {
    vi.mocked(authorizeGatewayBearerRequestOrReply).mockResolvedValue(false);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const result = await handleGatewayPostJsonEndpoint(
      {
        url: "/v1/ok",
        method: "POST",
        headers: { host: "localhost" },
      } as unknown as IncomingMessage,
      {} as unknown as ServerResponse,
      { pathname: "/v1/ok", auth: {} as unknown as ResolvedGatewayAuth, maxBodyBytes: 1 },
    );
    expect(result).toBeUndefined();
  });

  it("returns body when auth succeeds and JSON parsing succeeds", async () => {
    vi.mocked(authorizeGatewayBearerRequestOrReply).mockResolvedValue(true);
    vi.mocked(readJsonBodyOrError).mockResolvedValue({ hello: "world" });
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const result = await handleGatewayPostJsonEndpoint(
      {
        url: "/v1/ok",
        method: "POST",
        headers: { host: "localhost" },
      } as unknown as IncomingMessage,
      {} as unknown as ServerResponse,
      { pathname: "/v1/ok", auth: {} as unknown as ResolvedGatewayAuth, maxBodyBytes: 123 },
    );
    expect(result).toEqual({ body: { hello: "world" } });
  });
});
