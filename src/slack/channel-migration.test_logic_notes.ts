/*
 * AUTO ANNOTATION
 * File: src/slack/channel-migration.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { describe, expect, it } from "vitest";
import { migrateSlackChannelConfig } from "./channel-migration.js";

describe("migrateSlackChannelConfig", () => {
  it("migrates global channel ids", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const cfg = {
      channels: {
        slack: {
          channels: {
            C123: { requireMention: false },
          },
        },
      },
    };

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const result = migrateSlackChannelConfig({
      cfg,
      accountId: "default",
      oldChannelId: "C123",
      newChannelId: "C999",
    });

    expect(result.migrated).toBe(true);
    expect(cfg.channels.slack.channels).toEqual({
      C999: { requireMention: false },
    });
  });

  it("migrates account-scoped channels", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const cfg = {
      channels: {
        slack: {
          accounts: {
            primary: {
              channels: {
                C123: { requireMention: true },
              },
            },
          },
        },
      },
    };

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const result = migrateSlackChannelConfig({
      cfg,
      accountId: "primary",
      oldChannelId: "C123",
      newChannelId: "C999",
    });

    expect(result.migrated).toBe(true);
    expect(result.scopes).toEqual(["account"]);
    expect(cfg.channels.slack.accounts.primary.channels).toEqual({
      C999: { requireMention: true },
    });
  });

  it("matches account ids case-insensitively", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const cfg = {
      channels: {
        slack: {
          accounts: {
            Primary: {
              channels: {
                C123: {},
              },
            },
          },
        },
      },
    };

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const result = migrateSlackChannelConfig({
      cfg,
      accountId: "primary",
      oldChannelId: "C123",
      newChannelId: "C999",
    });

    expect(result.migrated).toBe(true);
    expect(cfg.channels.slack.accounts.Primary.channels).toEqual({
      C999: {},
    });
  });

  it("skips migration when new id already exists", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const cfg = {
      channels: {
        slack: {
          channels: {
            C123: { requireMention: true },
            C999: { requireMention: false },
          },
        },
      },
    };

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const result = migrateSlackChannelConfig({
      cfg,
      accountId: "default",
      oldChannelId: "C123",
      newChannelId: "C999",
    });

    expect(result.migrated).toBe(false);
    expect(result.skippedExisting).toBe(true);
    expect(cfg.channels.slack.channels).toEqual({
      C123: { requireMention: true },
      C999: { requireMention: false },
    });
  });
});
