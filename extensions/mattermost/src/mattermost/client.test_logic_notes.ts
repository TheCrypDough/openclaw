/*
 * AUTO ANNOTATION
 * File: extensions/mattermost/src/mattermost/client.test.ts
 * Purpose: Extension package component that adds a channel/tool integration or adapter.
 * Module area: Pluggable channel and service extensions
 * System effect: Alters gateway ecosystem integration points and feature surface exposed through plugin loading.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { describe, expect, it, vi } from "vitest";
import { createMattermostClient } from "./client.js";

describe("mattermost client", () => {
  it("request returns undefined on 204 responses", async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const fetchImpl = vi.fn(async () => {
      return new Response(null, { status: 204 });
    });

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const client = createMattermostClient({
      baseUrl: "https://chat.example.com",
      botToken: "test-token",
      fetchImpl: fetchImpl as any,
    });

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const result = await client.request<unknown>("/anything", { method: "DELETE" });
    expect(result).toBeUndefined();
  });
});
