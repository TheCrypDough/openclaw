/*
 * AUTO ANNOTATION
 * File: extensions/synology-chat/src/accounts.test.ts
 * Purpose: Extension package component that adds a channel/tool integration or adapter.
 * Module area: Pluggable channel and service extensions
 * System effect: Alters gateway ecosystem integration points and feature surface exposed through plugin loading.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { listAccountIds, resolveAccount } from "./accounts.js";

// Save and restore env vars
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const originalEnv = { ...process.env };

beforeEach(() => {
  // Clean synology-related env vars before each test
  delete process.env.SYNOLOGY_CHAT_TOKEN;
  delete process.env.SYNOLOGY_CHAT_INCOMING_URL;
  delete process.env.SYNOLOGY_NAS_HOST;
  delete process.env.SYNOLOGY_ALLOWED_USER_IDS;
  delete process.env.SYNOLOGY_RATE_LIMIT;
  delete process.env.OPENCLAW_BOT_NAME;
});

describe("listAccountIds", () => {
  it("returns empty array when no channel config", () => {
    expect(listAccountIds({})).toEqual([]);
    expect(listAccountIds({ channels: {} })).toEqual([]);
  });

  it("returns ['default'] when base config has token", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const cfg = { channels: { "synology-chat": { token: "abc" } } };
    expect(listAccountIds(cfg)).toEqual(["default"]);
  });

  it("returns ['default'] when env var has token", () => {
    process.env.SYNOLOGY_CHAT_TOKEN = "env-token";
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const cfg = { channels: { "synology-chat": {} } };
    expect(listAccountIds(cfg)).toEqual(["default"]);
  });

  it("returns named accounts", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const cfg = {
      channels: {
        "synology-chat": {
          accounts: { work: { token: "t1" }, home: { token: "t2" } },
        },
      },
    };
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const ids = listAccountIds(cfg);
    expect(ids).toContain("work");
    expect(ids).toContain("home");
  });

  it("returns default + named accounts", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const cfg = {
      channels: {
        "synology-chat": {
          token: "base-token",
          accounts: { work: { token: "t1" } },
        },
      },
    };
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const ids = listAccountIds(cfg);
    expect(ids).toContain("default");
    expect(ids).toContain("work");
  });
});

describe("resolveAccount", () => {
  it("returns full defaults for empty config", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const cfg = { channels: { "synology-chat": {} } };
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const account = resolveAccount(cfg, "default");
    expect(account.accountId).toBe("default");
    expect(account.enabled).toBe(true);
    expect(account.webhookPath).toBe("/webhook/synology");
    expect(account.dmPolicy).toBe("allowlist");
    expect(account.rateLimitPerMinute).toBe(30);
    expect(account.botName).toBe("OpenClaw");
  });

  it("uses env var fallbacks", () => {
    process.env.SYNOLOGY_CHAT_TOKEN = "env-tok";
    process.env.SYNOLOGY_CHAT_INCOMING_URL = "https://nas/incoming";
    process.env.SYNOLOGY_NAS_HOST = "192.0.2.1";
    process.env.OPENCLAW_BOT_NAME = "TestBot";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const cfg = { channels: { "synology-chat": {} } };
    const account = resolveAccount(cfg);
    expect(account.token).toBe("env-tok");
    expect(account.incomingUrl).toBe("https://nas/incoming");
    expect(account.nasHost).toBe("192.0.2.1");
    expect(account.botName).toBe("TestBot");
  });

  it("config overrides env vars", () => {
    process.env.SYNOLOGY_CHAT_TOKEN = "env-tok";
    const cfg = {
      channels: { "synology-chat": { token: "config-tok" } },
    };
    const account = resolveAccount(cfg);
    expect(account.token).toBe("config-tok");
  });

  it("account override takes priority over base config", () => {
    const cfg = {
      channels: {
        "synology-chat": {
          token: "base-tok",
          botName: "BaseName",
          accounts: {
            work: { token: "work-tok", botName: "WorkBot" },
          },
        },
      },
    };
    const account = resolveAccount(cfg, "work");
    expect(account.token).toBe("work-tok");
    expect(account.botName).toBe("WorkBot");
  });

  it("parses comma-separated allowedUserIds string", () => {
    const cfg = {
      channels: {
        "synology-chat": { allowedUserIds: "user1, user2, user3" },
      },
    };
    const account = resolveAccount(cfg);
    expect(account.allowedUserIds).toEqual(["user1", "user2", "user3"]);
  });

  it("handles allowedUserIds as array", () => {
    const cfg = {
      channels: {
        "synology-chat": { allowedUserIds: ["u1", "u2"] },
      },
    };
    const account = resolveAccount(cfg);
    expect(account.allowedUserIds).toEqual(["u1", "u2"]);
  });
});
