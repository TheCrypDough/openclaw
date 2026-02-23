/*
 * AUTO ANNOTATION
 * File: src/infra/provider-usage.fetch.claude.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { afterEach, describe, expect, it, vi } from "vitest";
import { createProviderUsageFetch, makeResponse } from "../test-utils/provider-usage-fetch.js";
import { fetchClaudeUsage } from "./provider-usage.fetch.claude.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const MISSING_SCOPE_MESSAGE = "missing scope requirement user:profile";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function makeMissingScopeResponse() {
  return makeResponse(403, {
    error: { message: MISSING_SCOPE_MESSAGE },
  });
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function expectMissingScopeError(result: Awaited<ReturnType<typeof fetchClaudeUsage>>) {
  expect(result.error).toBe(`HTTP 403: ${MISSING_SCOPE_MESSAGE}`);
  expect(result.windows).toHaveLength(0);
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function createScopeFallbackFetch(handler: (url: string) => Promise<Response> | Response) {
  return createProviderUsageFetch(async (url) => {
    if (url.includes("/api/oauth/usage")) {
      return makeMissingScopeResponse();
    }
    return handler(url);
  });
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
type ScopeFallbackFetch = ReturnType<typeof createScopeFallbackFetch>;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
async function expectMissingScopeWithoutFallback(mockFetch: ScopeFallbackFetch) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const result = await fetchClaudeUsage("token", 5000, mockFetch);
  expectMissingScopeError(result);
  expect(mockFetch).toHaveBeenCalledTimes(1);
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function makeOrgAResponse() {
  return makeResponse(200, [{ uuid: "org-a" }]);
}

describe("fetchClaudeUsage", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("parses oauth usage windows", async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const fiveHourReset = "2026-01-08T00:00:00Z";
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const weekReset = "2026-01-12T00:00:00Z";
    const mockFetch = createProviderUsageFetch(async (_url, init) => {
      const headers = (init?.headers as Record<string, string> | undefined) ?? {};
      expect(headers.Authorization).toBe("Bearer token");
      expect(headers["anthropic-beta"]).toBe("oauth-2025-04-20");

      return makeResponse(200, {
        five_hour: { utilization: 18, resets_at: fiveHourReset },
        seven_day: { utilization: 54, resets_at: weekReset },
        seven_day_sonnet: { utilization: 67 },
      });
    });

    const result = await fetchClaudeUsage("token", 5000, mockFetch);

    expect(result.windows).toEqual([
      { label: "5h", usedPercent: 18, resetAt: new Date(fiveHourReset).getTime() },
      { label: "Week", usedPercent: 54, resetAt: new Date(weekReset).getTime() },
      { label: "Sonnet", usedPercent: 67 },
    ]);
  });

  it("returns HTTP errors with provider message suffix", async () => {
    const mockFetch = createProviderUsageFetch(async () =>
      makeResponse(403, {
        error: { message: "scope not granted" },
      }),
    );

    const result = await fetchClaudeUsage("token", 5000, mockFetch);
    expect(result.error).toBe("HTTP 403: scope not granted");
    expect(result.windows).toHaveLength(0);
  });

  it("falls back to claude web usage when oauth scope is missing", async () => {
    vi.stubEnv("CLAUDE_AI_SESSION_KEY", "sk-ant-session-key");

    const mockFetch = createProviderUsageFetch(async (url, init) => {
      if (url.includes("/api/oauth/usage")) {
        return makeMissingScopeResponse();
      }

      const headers = (init?.headers as Record<string, string> | undefined) ?? {};
      expect(headers.Cookie).toBe("sessionKey=sk-ant-session-key");

      if (url.endsWith("/api/organizations")) {
        return makeResponse(200, [{ uuid: "org-123" }]);
      }

      if (url.endsWith("/api/organizations/org-123/usage")) {
        return makeResponse(200, {
          five_hour: { utilization: 12 },
        });
      }

      return makeResponse(404, "not found");
    });

    const result = await fetchClaudeUsage("token", 5000, mockFetch);

    expect(result.error).toBeUndefined();
    expect(result.windows).toEqual([{ label: "5h", usedPercent: 12, resetAt: undefined }]);
  });

  it("keeps oauth error when cookie header cannot be parsed into a session key", async () => {
    vi.stubEnv("CLAUDE_WEB_COOKIE", "sessionKey=sk-ant-cookie-session");

    const mockFetch = createScopeFallbackFetch(async (url) => {
      if (url.endsWith("/api/organizations")) {
        return makeResponse(200, [{ uuid: "org-cookie" }]);
      }
      if (url.endsWith("/api/organizations/org-cookie/usage")) {
        return makeResponse(200, { seven_day_opus: { utilization: 44 } });
      }
      return makeResponse(404, "not found");
    });

    await expectMissingScopeWithoutFallback(mockFetch);
  });

  it("keeps oauth error when fallback session key is unavailable", async () => {
    const mockFetch = createScopeFallbackFetch(async (url) => {
      if (url.endsWith("/api/organizations")) {
        return makeResponse(200, [{ uuid: "org-missing-session" }]);
      }
      return makeResponse(404, "not found");
    });

    await expectMissingScopeWithoutFallback(mockFetch);
  });

  it.each([
    {
      name: "org list request fails",
      orgResponse: () => makeResponse(500, "boom"),
      usageResponse: () => makeResponse(200, {}),
    },
    {
      name: "org list has no id",
      orgResponse: () => makeResponse(200, [{}]),
      usageResponse: () => makeResponse(200, {}),
    },
    {
      name: "usage request fails",
      orgResponse: makeOrgAResponse,
      usageResponse: () => makeResponse(503, "down"),
    },
    {
      name: "usage request has no windows",
      orgResponse: makeOrgAResponse,
      usageResponse: () => makeResponse(200, {}),
    },
  ])(
    "returns oauth error when web fallback is unavailable: $name",
    async ({ orgResponse, usageResponse }) => {
      vi.stubEnv("CLAUDE_AI_SESSION_KEY", "sk-ant-fallback");

      const mockFetch = createScopeFallbackFetch(async (url) => {
        if (url.endsWith("/api/organizations")) {
          return orgResponse();
        }
        if (url.endsWith("/api/organizations/org-a/usage")) {
          return usageResponse();
        }
        return makeResponse(404, "not found");
      });

      const result = await fetchClaudeUsage("token", 5000, mockFetch);
      expectMissingScopeError(result);
    },
  );
});
