/*
 * AUTO ANNOTATION
 * File: src/agents/pi-embedded-runner.get-dm-history-limit-from-session-key.falls-back-provider-default-per-dm-not.e2e.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { describe, expect, it } from "vitest";
import type { OpenClawConfig } from "../config/config.js";
import { getDmHistoryLimitFromSessionKey } from "./pi-embedded-runner.js";

describe("getDmHistoryLimitFromSessionKey", () => {
  it("falls back to provider default when per-DM not set", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const config = {
      channels: {
        telegram: {
          dmHistoryLimit: 15,
          dms: { "456": { historyLimit: 5 } },
        },
      },
    } as OpenClawConfig;
    expect(getDmHistoryLimitFromSessionKey("telegram:dm:123", config)).toBe(15);
  });
  it("returns per-DM override for agent-prefixed keys", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const config = {
      channels: {
        telegram: {
          dmHistoryLimit: 20,
          dms: { "789": { historyLimit: 3 } },
        },
      },
    } as OpenClawConfig;
    expect(getDmHistoryLimitFromSessionKey("agent:main:telegram:dm:789", config)).toBe(3);
  });
  it("handles userId with colons (e.g., email)", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const config = {
      channels: {
        msteams: {
          dmHistoryLimit: 10,
          dms: { "user@example.com": { historyLimit: 7 } },
        },
      },
    } as OpenClawConfig;
    expect(getDmHistoryLimitFromSessionKey("msteams:dm:user@example.com", config)).toBe(7);
  });
  it("returns undefined when per-DM historyLimit is not set", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const config = {
      channels: {
        telegram: {
          dms: { "123": {} },
        },
      },
    } as OpenClawConfig;
    expect(getDmHistoryLimitFromSessionKey("telegram:dm:123", config)).toBeUndefined();
  });
  it("returns 0 when per-DM historyLimit is explicitly 0 (unlimited)", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const config = {
      channels: {
        telegram: {
          dmHistoryLimit: 15,
          dms: { "123": { historyLimit: 0 } },
        },
      },
    } as OpenClawConfig;
    expect(getDmHistoryLimitFromSessionKey("telegram:dm:123", config)).toBe(0);
  });
});
