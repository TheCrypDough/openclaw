/*
 * AUTO ANNOTATION
 * File: src/discord/api.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { describe, expect, it } from "vitest";
import { withFetchPreconnect } from "../test-utils/fetch-mock.js";
import { fetchDiscord } from "./api.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status });
}

describe("fetchDiscord", () => {
  it("formats rate limit payloads without raw JSON", async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const fetcher = withFetchPreconnect(async () =>
      jsonResponse(
        {
          message: "You are being rate limited.",
          retry_after: 0.631,
          global: false,
        },
        429,
      ),
    );

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    let error: unknown;
    try {
      await fetchDiscord("/users/@me/guilds", "test", fetcher, {
        retry: { attempts: 1 },
      });
    } catch (err) {
      error = err;
    }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const message = String(error);
    expect(message).toContain("Discord API /users/@me/guilds failed (429)");
    expect(message).toContain("You are being rate limited.");
    expect(message).toContain("retry after 0.6s");
    expect(message).not.toContain("{");
    expect(message).not.toContain("retry_after");
  });

  it("preserves non-JSON error text", async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const fetcher = withFetchPreconnect(async () => new Response("Not Found", { status: 404 }));
    await expect(
      fetchDiscord("/users/@me/guilds", "test", fetcher, {
        retry: { attempts: 1 },
      }),
    ).rejects.toThrow("Discord API /users/@me/guilds failed (404): Not Found");
  });

  it("retries rate limits before succeeding", async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    let calls = 0;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const fetcher = withFetchPreconnect(async () => {
      calls += 1;
      if (calls === 1) {
        return jsonResponse(
          {
            message: "You are being rate limited.",
            retry_after: 0,
            global: false,
          },
          429,
        );
      }
      return jsonResponse([{ id: "1", name: "Guild" }], 200);
    });

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const result = await fetchDiscord<Array<{ id: string; name: string }>>(
      "/users/@me/guilds",
      "test",
      fetcher,
      { retry: { attempts: 2, minDelayMs: 0, maxDelayMs: 0 } },
    );

    expect(result).toHaveLength(1);
    expect(calls).toBe(2);
  });
});
