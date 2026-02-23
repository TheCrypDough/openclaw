/*
 * AUTO ANNOTATION
 * File: src/telegram/reaction-level.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import type { OpenClawConfig } from "../config/config.js";
import { resolveTelegramReactionLevel } from "./reaction-level.js";

describe("resolveTelegramReactionLevel", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const prevTelegramToken = process.env.TELEGRAM_BOT_TOKEN;

  beforeAll(() => {
    process.env.TELEGRAM_BOT_TOKEN = "test-token";
  });

  afterAll(() => {
    if (prevTelegramToken === undefined) {
      delete process.env.TELEGRAM_BOT_TOKEN;
    } else {
      process.env.TELEGRAM_BOT_TOKEN = prevTelegramToken;
    }
  });

  it("defaults to minimal level when reactionLevel is not set", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const cfg: OpenClawConfig = {
      channels: { telegram: {} },
    };

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const result = resolveTelegramReactionLevel({ cfg });
    expect(result.level).toBe("minimal");
    expect(result.ackEnabled).toBe(false);
    expect(result.agentReactionsEnabled).toBe(true);
    expect(result.agentReactionGuidance).toBe("minimal");
  });

  it("returns off level with no reactions enabled", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const cfg: OpenClawConfig = {
      channels: { telegram: { reactionLevel: "off" } },
    };

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const result = resolveTelegramReactionLevel({ cfg });
    expect(result.level).toBe("off");
    expect(result.ackEnabled).toBe(false);
    expect(result.agentReactionsEnabled).toBe(false);
    expect(result.agentReactionGuidance).toBeUndefined();
  });

  it("returns ack level with only ackEnabled", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const cfg: OpenClawConfig = {
      channels: { telegram: { reactionLevel: "ack" } },
    };

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const result = resolveTelegramReactionLevel({ cfg });
    expect(result.level).toBe("ack");
    expect(result.ackEnabled).toBe(true);
    expect(result.agentReactionsEnabled).toBe(false);
    expect(result.agentReactionGuidance).toBeUndefined();
  });

  it("returns minimal level with agent reactions enabled and minimal guidance", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const cfg: OpenClawConfig = {
      channels: { telegram: { reactionLevel: "minimal" } },
    };

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const result = resolveTelegramReactionLevel({ cfg });
    expect(result.level).toBe("minimal");
    expect(result.ackEnabled).toBe(false);
    expect(result.agentReactionsEnabled).toBe(true);
    expect(result.agentReactionGuidance).toBe("minimal");
  });

  it("returns extensive level with agent reactions enabled and extensive guidance", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const cfg: OpenClawConfig = {
      channels: { telegram: { reactionLevel: "extensive" } },
    };

    const result = resolveTelegramReactionLevel({ cfg });
    expect(result.level).toBe("extensive");
    expect(result.ackEnabled).toBe(false);
    expect(result.agentReactionsEnabled).toBe(true);
    expect(result.agentReactionGuidance).toBe("extensive");
  });

  it("resolves reaction level from a specific account", () => {
    const cfg: OpenClawConfig = {
      channels: {
        telegram: {
          reactionLevel: "ack",
          accounts: {
            work: { botToken: "tok-work", reactionLevel: "extensive" },
          },
        },
      },
    };

    const result = resolveTelegramReactionLevel({ cfg, accountId: "work" });
    expect(result.level).toBe("extensive");
    expect(result.ackEnabled).toBe(false);
    expect(result.agentReactionsEnabled).toBe(true);
    expect(result.agentReactionGuidance).toBe("extensive");
  });

  it("falls back to global level when account has no reactionLevel", () => {
    const cfg: OpenClawConfig = {
      channels: {
        telegram: {
          reactionLevel: "minimal",
          accounts: {
            work: { botToken: "tok-work" },
          },
        },
      },
    };

    const result = resolveTelegramReactionLevel({ cfg, accountId: "work" });
    expect(result.level).toBe("minimal");
    expect(result.agentReactionsEnabled).toBe(true);
    expect(result.agentReactionGuidance).toBe("minimal");
  });
});
