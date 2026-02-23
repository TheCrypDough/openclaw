/*
 * AUTO ANNOTATION
 * File: src/agents/pi-embedded-runner.history-limit-from-session-key.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { describe, expect, it } from "vitest";
import type { OpenClawConfig } from "../config/config.js";
import { getDmHistoryLimitFromSessionKey } from "./pi-embedded-runner.js";

describe("getDmHistoryLimitFromSessionKey", () => {
  it("keeps backward compatibility for dm/direct session kinds", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const config = {
      channels: { telegram: { dmHistoryLimit: 10 } },
    } as OpenClawConfig;

    expect(getDmHistoryLimitFromSessionKey("telegram:dm:123", config)).toBe(10);
    expect(getDmHistoryLimitFromSessionKey("telegram:direct:123", config)).toBe(10);
  });

  it("returns historyLimit for channel and group session kinds", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const config = {
      channels: { discord: { historyLimit: 12, dmHistoryLimit: 5 } },
    } as OpenClawConfig;

    expect(getDmHistoryLimitFromSessionKey("discord:channel:123", config)).toBe(12);
    expect(getDmHistoryLimitFromSessionKey("discord:group:456", config)).toBe(12);
  });

  it("returns undefined for unsupported session kinds", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const config = {
      channels: { discord: { historyLimit: 12, dmHistoryLimit: 5 } },
    } as OpenClawConfig;

    expect(getDmHistoryLimitFromSessionKey("discord:slash:123", config)).toBeUndefined();
  });
});
