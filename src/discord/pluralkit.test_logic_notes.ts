/*
 * AUTO ANNOTATION
 * File: src/discord/pluralkit.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { describe, expect, it, vi } from "vitest";
import { fetchPluralKitMessageInfo } from "./pluralkit.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
type MockResponse = {
  status: number;
  ok: boolean;
  text: () => Promise<string>;
  json: () => Promise<unknown>;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const buildResponse = (params: { status: number; body?: unknown }): MockResponse => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const body = params.body;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const textPayload = typeof body === "string" ? body : body == null ? "" : JSON.stringify(body);
  return {
    status: params.status,
    ok: params.status >= 200 && params.status < 300,
    text: async () => textPayload,
    json: async () => body ?? {},
  };
};

describe("fetchPluralKitMessageInfo", () => {
  it("returns null when disabled", async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const fetcher = vi.fn();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const result = await fetchPluralKitMessageInfo({
      messageId: "123",
      config: { enabled: false },
      fetcher: fetcher as unknown as typeof fetch,
    });
    expect(result).toBeNull();
    expect(fetcher).not.toHaveBeenCalled();
  });

  it("returns null on 404", async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const fetcher = vi.fn(async () => buildResponse({ status: 404 }));
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const result = await fetchPluralKitMessageInfo({
      messageId: "missing",
      config: { enabled: true },
      fetcher: fetcher as unknown as typeof fetch,
    });
    expect(result).toBeNull();
  });

  it("returns payload and sends token when configured", async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    let receivedHeaders: Record<string, string> | undefined;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const fetcher = vi.fn(async (_url: string, init?: RequestInit) => {
      receivedHeaders = init?.headers as Record<string, string> | undefined;
      return buildResponse({
        status: 200,
        body: {
          id: "123",
          member: { id: "mem_1", name: "Alex" },
          system: { id: "sys_1", name: "System" },
        },
      });
    });

    const result = await fetchPluralKitMessageInfo({
      messageId: "123",
      config: { enabled: true, token: "pk_test" },
      fetcher: fetcher as unknown as typeof fetch,
    });

    expect(result?.member?.id).toBe("mem_1");
    expect(receivedHeaders?.Authorization).toBe("pk_test");
  });
});
