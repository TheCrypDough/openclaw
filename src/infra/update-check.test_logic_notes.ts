/*
 * AUTO ANNOTATION
 * File: src/infra/update-check.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { resolveNpmChannelTag } from "./update-check.js";

describe("resolveNpmChannelTag", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  let versionByTag: Record<string, string | null>;

  beforeEach(() => {
    versionByTag = {};
    vi.stubGlobal(
      "fetch",
      vi.fn(async (input: RequestInfo | URL) => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        const url =
          typeof input === "string" ? input : input instanceof URL ? input.toString() : input.url;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        const tag = decodeURIComponent(url.split("/").pop() ?? "");
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        const version = versionByTag[tag] ?? null;
        return {
          ok: version != null,
          status: version != null ? 200 : 404,
          json: async () => ({ version }),
        } as Response;
      }),
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("falls back to latest when beta is older", async () => {
    versionByTag.beta = "1.0.0-beta.1";
    versionByTag.latest = "1.0.1-1";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const resolved = await resolveNpmChannelTag({ channel: "beta", timeoutMs: 1000 });

    expect(resolved).toEqual({ tag: "latest", version: "1.0.1-1" });
  });

  it("keeps beta when beta is not older", async () => {
    versionByTag.beta = "1.0.2-beta.1";
    versionByTag.latest = "1.0.1-1";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const resolved = await resolveNpmChannelTag({ channel: "beta", timeoutMs: 1000 });

    expect(resolved).toEqual({ tag: "beta", version: "1.0.2-beta.1" });
  });
});
