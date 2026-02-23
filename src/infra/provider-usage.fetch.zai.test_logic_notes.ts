/*
 * AUTO ANNOTATION
 * File: src/infra/provider-usage.fetch.zai.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { describe, expect, it } from "vitest";
import { createProviderUsageFetch, makeResponse } from "../test-utils/provider-usage-fetch.js";
import { fetchZaiUsage } from "./provider-usage.fetch.zai.js";

describe("fetchZaiUsage", () => {
  it("returns HTTP errors for failed requests", async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const mockFetch = createProviderUsageFetch(async () => makeResponse(503, "unavailable"));
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const result = await fetchZaiUsage("key", 5000, mockFetch);

    expect(result.error).toBe("HTTP 503");
    expect(result.windows).toHaveLength(0);
  });

  it("returns API message errors for unsuccessful payloads", async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const mockFetch = createProviderUsageFetch(async () =>
      makeResponse(200, {
        success: false,
        code: 500,
        msg: "quota endpoint disabled",
      }),
    );

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const result = await fetchZaiUsage("key", 5000, mockFetch);
    expect(result.error).toBe("quota endpoint disabled");
    expect(result.windows).toHaveLength(0);
  });

  it("parses token and monthly windows with reset times", async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const tokenReset = "2026-01-08T00:00:00Z";
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const minuteReset = "2026-01-08T00:30:00Z";
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const monthlyReset = "2026-01-31T12:00:00Z";
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const mockFetch = createProviderUsageFetch(async () =>
      makeResponse(200, {
        success: true,
        code: 200,
        data: {
          planName: "Team",
          limits: [
            {
              type: "TOKENS_LIMIT",
              percentage: 32,
              unit: 3,
              number: 6,
              nextResetTime: tokenReset,
            },
            {
              type: "TOKENS_LIMIT",
              percentage: 8,
              unit: 5,
              number: 15,
              nextResetTime: minuteReset,
            },
            {
              type: "TIME_LIMIT",
              percentage: 12.5,
              unit: 1,
              number: 30,
              nextResetTime: monthlyReset,
            },
          ],
        },
      }),
    );

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const result = await fetchZaiUsage("key", 5000, mockFetch);

    expect(result.plan).toBe("Team");
    expect(result.windows).toEqual([
      {
        label: "Tokens (6h)",
        usedPercent: 32,
        resetAt: new Date(tokenReset).getTime(),
      },
      {
        label: "Tokens (15m)",
        usedPercent: 8,
        resetAt: new Date(minuteReset).getTime(),
      },
      {
        label: "Monthly",
        usedPercent: 12.5,
        resetAt: new Date(monthlyReset).getTime(),
      },
    ]);
  });
});
