/*
 * AUTO ANNOTATION
 * File: src/slack/resolve-channels.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { describe, expect, it, vi } from "vitest";
import { resolveSlackChannelAllowlist } from "./resolve-channels.js";

describe("resolveSlackChannelAllowlist", () => {
  it("resolves by name and prefers active channels", async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const client = {
      conversations: {
        list: vi.fn().mockResolvedValue({
          channels: [
            { id: "C1", name: "general", is_archived: true },
            { id: "C2", name: "general", is_archived: false },
          ],
        }),
      },
    };

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const res = await resolveSlackChannelAllowlist({
      token: "xoxb-test",
      entries: ["#general"],
      client: client as never,
    });

    expect(res[0]?.resolved).toBe(true);
    expect(res[0]?.id).toBe("C2");
  });

  it("keeps unresolved entries", async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const client = {
      conversations: {
        list: vi.fn().mockResolvedValue({ channels: [] }),
      },
    };

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const res = await resolveSlackChannelAllowlist({
      token: "xoxb-test",
      entries: ["#does-not-exist"],
      client: client as never,
    });

    expect(res[0]?.resolved).toBe(false);
  });
});
