/*
 * AUTO ANNOTATION
 * File: src/discord/token.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { afterEach, describe, expect, it, vi } from "vitest";
import type { OpenClawConfig } from "../config/config.js";
import { resolveDiscordToken } from "./token.js";

describe("resolveDiscordToken", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("prefers config token over env", () => {
    vi.stubEnv("DISCORD_BOT_TOKEN", "env-token");
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const cfg = {
      channels: { discord: { token: "cfg-token" } },
    } as OpenClawConfig;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const res = resolveDiscordToken(cfg);
    expect(res.token).toBe("cfg-token");
    expect(res.source).toBe("config");
  });

  it("uses env token when config is missing", () => {
    vi.stubEnv("DISCORD_BOT_TOKEN", "env-token");
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const cfg = {
      channels: { discord: {} },
    } as OpenClawConfig;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const res = resolveDiscordToken(cfg);
    expect(res.token).toBe("env-token");
    expect(res.source).toBe("env");
  });

  it("prefers account token for non-default accounts", () => {
    vi.stubEnv("DISCORD_BOT_TOKEN", "env-token");
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const cfg = {
      channels: {
        discord: {
          token: "base-token",
          accounts: {
            work: { token: "acct-token" },
          },
        },
      },
    } as OpenClawConfig;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const res = resolveDiscordToken(cfg, { accountId: "work" });
    expect(res.token).toBe("acct-token");
    expect(res.source).toBe("config");
  });
});
