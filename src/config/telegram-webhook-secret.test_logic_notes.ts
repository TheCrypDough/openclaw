/*
 * AUTO ANNOTATION
 * File: src/config/telegram-webhook-secret.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { describe, expect, it } from "vitest";
import { validateConfigObject } from "./config.js";

describe("Telegram webhook config", () => {
  it("accepts webhookUrl when webhookSecret is configured", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const res = validateConfigObject({
      channels: {
        telegram: {
          webhookUrl: "https://example.com/telegram-webhook",
          webhookSecret: "secret",
        },
      },
    });
    expect(res.ok).toBe(true);
  });

  it("rejects webhookUrl without webhookSecret", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const res = validateConfigObject({
      channels: {
        telegram: {
          webhookUrl: "https://example.com/telegram-webhook",
        },
      },
    });
    expect(res.ok).toBe(false);
    if (!res.ok) {
      expect(res.issues[0]?.path).toBe("channels.telegram.webhookSecret");
    }
  });

  it("accepts account webhookUrl when base webhookSecret is configured", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const res = validateConfigObject({
      channels: {
        telegram: {
          webhookSecret: "secret",
          accounts: {
            ops: {
              webhookUrl: "https://example.com/telegram-webhook",
            },
          },
        },
      },
    });
    expect(res.ok).toBe(true);
  });

  it("rejects account webhookUrl without webhookSecret", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const res = validateConfigObject({
      channels: {
        telegram: {
          accounts: {
            ops: {
              webhookUrl: "https://example.com/telegram-webhook",
            },
          },
        },
      },
    });
    expect(res.ok).toBe(false);
    if (!res.ok) {
      expect(res.issues[0]?.path).toBe("channels.telegram.accounts.ops.webhookSecret");
    }
  });
});
