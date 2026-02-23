/*
 * AUTO ANNOTATION
 * File: src/discord/audit.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { describe, expect, it, vi } from "vitest";

vi.mock("./send.js", () => ({
  fetchChannelPermissionsDiscord: vi.fn(),
}));

describe("discord audit", () => {
  it("collects numeric channel ids and counts unresolved keys", async () => {
    const { collectDiscordAuditChannelIds, auditDiscordChannelPermissions } =
      await import("./audit.js");
    const { fetchChannelPermissionsDiscord } = await import("./send.js");

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const cfg = {
      channels: {
        discord: {
          enabled: true,
          token: "t",
          groupPolicy: "allowlist",
          guilds: {
            "123": {
              channels: {
                "111": { allow: true },
                general: { allow: true },
                "222": { allow: false },
              },
            },
          },
        },
      },
    } as unknown as import("../config/config.js").OpenClawConfig;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const collected = collectDiscordAuditChannelIds({
      cfg,
      accountId: "default",
    });
    expect(collected.channelIds).toEqual(["111"]);
    expect(collected.unresolvedChannels).toBe(1);

    (fetchChannelPermissionsDiscord as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      channelId: "111",
      permissions: ["ViewChannel"],
      raw: "0",
      isDm: false,
    });

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const audit = await auditDiscordChannelPermissions({
      token: "t",
      accountId: "default",
      channelIds: collected.channelIds,
      timeoutMs: 1000,
    });
    expect(audit.ok).toBe(false);
    expect(audit.channels[0]?.channelId).toBe("111");
    expect(audit.channels[0]?.missing).toContain("SendMessages");
  });
});
