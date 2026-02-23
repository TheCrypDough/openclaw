/*
 * AUTO ANNOTATION
 * File: src/agents/tools/web-fetch.firecrawl-api-key-normalization.e2e.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { afterEach, describe, expect, it, vi } from "vitest";
import { withFetchPreconnect } from "../../test-utils/fetch-mock.js";

vi.mock("../../infra/net/fetch-guard.js", () => {
  return {
    fetchWithSsrFGuard: vi.fn(async () => {
      throw new Error("network down");
    }),
  };
});

describe("web_fetch firecrawl apiKey normalization", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const priorFetch = global.fetch;

  afterEach(() => {
    global.fetch = priorFetch;
    vi.restoreAllMocks();
  });

  it("strips embedded CR/LF before sending Authorization header", async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const fetchSpy = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const url = typeof input === "string" ? input : input instanceof URL ? input.toString() : "";
      expect(url).toContain("/v2/scrape");

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const auth = (init?.headers as Record<string, string> | undefined)?.Authorization;
      expect(auth).toBe("Bearer firecrawl-test-key");

      return new Response(
        JSON.stringify({
          success: true,
          data: { markdown: "ok", metadata: { title: "t" } },
        }),
        { status: 200, headers: { "Content-Type": "application/json" } },
      );
    });

    global.fetch = withFetchPreconnect(fetchSpy);

    const { createWebFetchTool } = await import("./web-tools.js");
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const tool = createWebFetchTool({
      config: {
        tools: {
          web: {
            fetch: {
              cacheTtlMinutes: 0,
              firecrawl: { apiKey: "firecrawl-test-\r\nkey" },
              readability: false,
            },
          },
        },
      },
    });

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const result = await tool?.execute?.("call", {
      url: "https://example.com",
      extractMode: "text",
    });
    expect(result?.details).toMatchObject({ extractor: "firecrawl" });
    expect(fetchSpy).toHaveBeenCalled();
  });
});
