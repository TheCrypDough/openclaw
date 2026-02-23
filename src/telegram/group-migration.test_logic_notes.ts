/*
 * AUTO ANNOTATION
 * File: src/telegram/group-migration.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { describe, expect, it } from "vitest";
import { migrateTelegramGroupConfig } from "./group-migration.js";

describe("migrateTelegramGroupConfig", () => {
  it("migrates global group ids", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const cfg = {
      channels: {
        telegram: {
          groups: {
            "-123": { requireMention: false },
          },
        },
      },
    };

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const result = migrateTelegramGroupConfig({
      cfg,
      accountId: "default",
      oldChatId: "-123",
      newChatId: "-100123",
    });

    expect(result.migrated).toBe(true);
    expect(cfg.channels.telegram.groups).toEqual({
      "-100123": { requireMention: false },
    });
  });

  it("migrates account-scoped groups", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const cfg = {
      channels: {
        telegram: {
          accounts: {
            primary: {
              groups: {
                "-123": { requireMention: true },
              },
            },
          },
        },
      },
    };

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const result = migrateTelegramGroupConfig({
      cfg,
      accountId: "primary",
      oldChatId: "-123",
      newChatId: "-100123",
    });

    expect(result.migrated).toBe(true);
    expect(result.scopes).toEqual(["account"]);
    expect(cfg.channels.telegram.accounts.primary.groups).toEqual({
      "-100123": { requireMention: true },
    });
  });

  it("matches account ids case-insensitively", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const cfg = {
      channels: {
        telegram: {
          accounts: {
            Primary: {
              groups: {
                "-123": {},
              },
            },
          },
        },
      },
    };

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const result = migrateTelegramGroupConfig({
      cfg,
      accountId: "primary",
      oldChatId: "-123",
      newChatId: "-100123",
    });

    expect(result.migrated).toBe(true);
    expect(cfg.channels.telegram.accounts.Primary.groups).toEqual({
      "-100123": {},
    });
  });

  it("skips migration when new id already exists", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const cfg = {
      channels: {
        telegram: {
          groups: {
            "-123": { requireMention: true },
            "-100123": { requireMention: false },
          },
        },
      },
    };

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const result = migrateTelegramGroupConfig({
      cfg,
      accountId: "default",
      oldChatId: "-123",
      newChatId: "-100123",
    });

    expect(result.migrated).toBe(false);
    expect(result.skippedExisting).toBe(true);
    expect(cfg.channels.telegram.groups).toEqual({
      "-123": { requireMention: true },
      "-100123": { requireMention: false },
    });
  });
});
