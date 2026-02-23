/*
 * AUTO ANNOTATION
 * File: src/infra/provider-usage.fetch.minimax.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { describe, expect, it } from "vitest";
import { createProviderUsageFetch, makeResponse } from "../test-utils/provider-usage-fetch.js";
import { fetchMinimaxUsage } from "./provider-usage.fetch.minimax.js";

describe("fetchMinimaxUsage", () => {
  it("returns HTTP errors for failed requests", async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const mockFetch = createProviderUsageFetch(async () => makeResponse(502, "bad gateway"));
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const result = await fetchMinimaxUsage("key", 5000, mockFetch);

    expect(result.error).toBe("HTTP 502");
    expect(result.windows).toHaveLength(0);
  });

  it("returns invalid JSON when payload cannot be parsed", async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const mockFetch = createProviderUsageFetch(async () => makeResponse(200, "{not-json"));
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const result = await fetchMinimaxUsage("key", 5000, mockFetch);

    expect(result.error).toBe("Invalid JSON");
    expect(result.windows).toHaveLength(0);
  });

  it("returns API errors from base_resp", async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const mockFetch = createProviderUsageFetch(async () =>
      makeResponse(200, {
        base_resp: {
          status_code: 1007,
          status_msg: "  auth denied  ",
        },
      }),
    );
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const result = await fetchMinimaxUsage("key", 5000, mockFetch);

    expect(result.error).toBe("auth denied");
    expect(result.windows).toHaveLength(0);
  });

  it("derives usage from used/total fields and includes reset + plan", async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const mockFetch = createProviderUsageFetch(async (_url, init) => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const headers = (init?.headers as Record<string, string> | undefined) ?? {};
      expect(headers.Authorization).toBe("Bearer key");
      expect(headers["MM-API-Source"]).toBe("OpenClaw");

      return makeResponse(200, {
        data: {
          used: 35,
          total: 100,
          window_hours: 3,
          reset_at: 1_700_000_000,
          plan_name: "Pro Max",
        },
      });
    });

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const result = await fetchMinimaxUsage("key", 5000, mockFetch);

    expect(result.plan).toBe("Pro Max");
    expect(result.windows).toEqual([
      {
        label: "3h",
        usedPercent: 35,
        resetAt: 1_700_000_000_000,
      },
    ]);
  });

  it("supports usage ratio strings with minute windows and ISO reset strings", async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const resetIso = "2026-01-08T00:00:00Z";
    const mockFetch = createProviderUsageFetch(async () =>
      makeResponse(200, {
        data: {
          nested: [
            {
              usage_ratio: "0.25",
              window_minutes: "30",
              reset_time: resetIso,
              plan: "Starter",
            },
          ],
        },
      }),
    );

    const result = await fetchMinimaxUsage("key", 5000, mockFetch);
    expect(result.plan).toBe("Starter");
    expect(result.windows).toEqual([
      {
        label: "30m",
        usedPercent: 25,
        resetAt: new Date(resetIso).getTime(),
      },
    ]);
  });

  it("derives used from total and remaining counts", async () => {
    const mockFetch = createProviderUsageFetch(async () =>
      makeResponse(200, {
        data: {
          total: "200",
          remaining: "50",
          usage_percent: 75,
          reset_at: 1_700_000_000_000,
          plan_name: "Team",
        },
      }),
    );

    const result = await fetchMinimaxUsage("key", 5000, mockFetch);
    expect(result.plan).toBe("Team");
    expect(result.windows).toEqual([
      {
        label: "5h",
        usedPercent: 75,
        resetAt: 1_700_000_000_000,
      },
    ]);
  });

  it("returns unsupported response shape when no usage fields are present", async () => {
    const mockFetch = createProviderUsageFetch(async () =>
      makeResponse(200, { data: { foo: "bar" } }),
    );
    const result = await fetchMinimaxUsage("key", 5000, mockFetch);

    expect(result.error).toBe("Unsupported response shape");
    expect(result.windows).toHaveLength(0);
  });

  it("handles repeated nested records while scanning usage candidates", async () => {
    const sharedUsage = {
      total: 100,
      used: 20,
      usage_percent: 90,
      window_hours: 1,
    };
    const dataWithSharedReference = {
      first: sharedUsage,
      nested: [sharedUsage],
    };
    const mockFetch = createProviderUsageFetch(
      async () =>
        ({
          ok: true,
          status: 200,
          json: async () => ({ data: dataWithSharedReference }),
        }) as Response,
    );

    const result = await fetchMinimaxUsage("key", 5000, mockFetch);
    expect(result.windows).toEqual([{ label: "1h", usedPercent: 20, resetAt: undefined }]);
  });
});
