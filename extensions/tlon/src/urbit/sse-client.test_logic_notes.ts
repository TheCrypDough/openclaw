/*
 * AUTO ANNOTATION
 * File: extensions/tlon/src/urbit/sse-client.test.ts
 * Purpose: Extension package component that adds a channel/tool integration or adapter.
 * Module area: Pluggable channel and service extensions
 * System effect: Alters gateway ecosystem integration points and feature surface exposed through plugin loading.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { LookupFn } from "openclaw/plugin-sdk";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { UrbitSSEClient } from "./sse-client.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const mockFetch = vi.fn();

describe("UrbitSSEClient", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", mockFetch);
    mockFetch.mockReset();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("sends subscriptions added after connect", async () => {
    mockFetch.mockResolvedValue({ ok: true, status: 200, text: async () => "" });
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const lookupFn = (async () => [{ address: "1.1.1.1", family: 4 }]) as unknown as LookupFn;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const client = new UrbitSSEClient("https://example.com", "urbauth-~zod=123", {
      lookupFn,
    });
    (client as { isConnected: boolean }).isConnected = true;

    await client.subscribe({
      app: "chat",
      path: "/dm/~zod",
      event: () => {},
    });

    expect(mockFetch).toHaveBeenCalledTimes(1);
    const [url, init] = mockFetch.mock.calls[0];
    expect(url).toBe(client.channelUrl);
    expect(init.method).toBe("PUT");
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const body = JSON.parse(init.body as string);
    expect(body).toHaveLength(1);
    expect(body[0]).toMatchObject({
      action: "subscribe",
      app: "chat",
      path: "/dm/~zod",
    });
  });
});
