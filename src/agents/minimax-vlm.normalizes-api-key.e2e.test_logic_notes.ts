/*
 * AUTO ANNOTATION
 * File: src/agents/minimax-vlm.normalizes-api-key.e2e.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { afterEach, describe, expect, it, vi } from "vitest";
import { withFetchPreconnect } from "../test-utils/fetch-mock.js";

describe("minimaxUnderstandImage apiKey normalization", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const priorFetch = global.fetch;

  afterEach(() => {
    global.fetch = priorFetch;
    vi.restoreAllMocks();
  });

  it("strips embedded CR/LF before sending Authorization header", async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const fetchSpy = vi.fn(async (_input: RequestInfo | URL, init?: RequestInit) => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const auth = (init?.headers as Record<string, string> | undefined)?.Authorization;
      expect(auth).toBe("Bearer minimax-test-key");

      return new Response(
        JSON.stringify({
          base_resp: { status_code: 0, status_msg: "ok" },
          content: "ok",
        }),
        { status: 200, headers: { "Content-Type": "application/json" } },
      );
    });
    global.fetch = withFetchPreconnect(fetchSpy);

    const { minimaxUnderstandImage } = await import("./minimax-vlm.js");
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const text = await minimaxUnderstandImage({
      apiKey: "minimax-test-\r\nkey",
      prompt: "hi",
      imageDataUrl: "data:image/png;base64,AAAA",
      apiHost: "https://api.minimax.io",
    });

    expect(text).toBe("ok");
    expect(fetchSpy).toHaveBeenCalled();
  });
});
