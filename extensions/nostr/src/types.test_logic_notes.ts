/*
 * AUTO ANNOTATION
 * File: extensions/nostr/src/types.test.ts
 * Purpose: Extension package component that adds a channel/tool integration or adapter.
 * Module area: Pluggable channel and service extensions
 * System effect: Alters gateway ecosystem integration points and feature surface exposed through plugin loading.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { describe, expect, it } from "vitest";
import { listNostrAccountIds, resolveDefaultNostrAccountId, resolveNostrAccount } from "./types.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const TEST_PRIVATE_KEY = "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef";

describe("listNostrAccountIds", () => {
  it("returns empty array when not configured", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const cfg = { channels: {} };
    expect(listNostrAccountIds(cfg)).toEqual([]);
  });

  it("returns empty array when nostr section exists but no privateKey", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const cfg = { channels: { nostr: { enabled: true } } };
    expect(listNostrAccountIds(cfg)).toEqual([]);
  });

  it("returns default when privateKey is configured", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const cfg = {
      channels: {
        nostr: { privateKey: TEST_PRIVATE_KEY },
      },
    };
    expect(listNostrAccountIds(cfg)).toEqual(["default"]);
  });
});

describe("resolveDefaultNostrAccountId", () => {
  it("returns default when configured", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const cfg = {
      channels: {
        nostr: { privateKey: TEST_PRIVATE_KEY },
      },
    };
    expect(resolveDefaultNostrAccountId(cfg)).toBe("default");
  });

  it("returns default when not configured", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const cfg = { channels: {} };
    expect(resolveDefaultNostrAccountId(cfg)).toBe("default");
  });
});

describe("resolveNostrAccount", () => {
  it("resolves configured account", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const cfg = {
      channels: {
        nostr: {
          privateKey: TEST_PRIVATE_KEY,
          name: "Test Bot",
          relays: ["wss://test.relay"],
          dmPolicy: "pairing" as const,
        },
      },
    };
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const account = resolveNostrAccount({ cfg });

    expect(account.accountId).toBe("default");
    expect(account.name).toBe("Test Bot");
    expect(account.enabled).toBe(true);
    expect(account.configured).toBe(true);
    expect(account.privateKey).toBe(TEST_PRIVATE_KEY);
    expect(account.publicKey).toMatch(/^[0-9a-f]{64}$/);
    expect(account.relays).toEqual(["wss://test.relay"]);
  });

  it("resolves unconfigured account with defaults", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const cfg = { channels: {} };
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const account = resolveNostrAccount({ cfg });

    expect(account.accountId).toBe("default");
    expect(account.enabled).toBe(true);
    expect(account.configured).toBe(false);
    expect(account.privateKey).toBe("");
    expect(account.publicKey).toBe("");
    expect(account.relays).toContain("wss://relay.damus.io");
    expect(account.relays).toContain("wss://nos.lol");
  });

  it("handles disabled channel", () => {
    const cfg = {
      channels: {
        nostr: {
          enabled: false,
          privateKey: TEST_PRIVATE_KEY,
        },
      },
    };
    const account = resolveNostrAccount({ cfg });

    expect(account.enabled).toBe(false);
    expect(account.configured).toBe(true);
  });

  it("handles custom accountId parameter", () => {
    const cfg = {
      channels: {
        nostr: { privateKey: TEST_PRIVATE_KEY },
      },
    };
    const account = resolveNostrAccount({ cfg, accountId: "custom" });

    expect(account.accountId).toBe("custom");
  });

  it("handles allowFrom config", () => {
    const cfg = {
      channels: {
        nostr: {
          privateKey: TEST_PRIVATE_KEY,
          allowFrom: ["npub1test", "0123456789abcdef"],
        },
      },
    };
    const account = resolveNostrAccount({ cfg });

    expect(account.config.allowFrom).toEqual(["npub1test", "0123456789abcdef"]);
  });

  it("handles invalid private key gracefully", () => {
    const cfg = {
      channels: {
        nostr: {
          privateKey: "invalid-key",
        },
      },
    };
    const account = resolveNostrAccount({ cfg });

    expect(account.configured).toBe(true); // key is present
    expect(account.publicKey).toBe(""); // but can't derive pubkey
  });

  it("preserves all config options", () => {
    const cfg = {
      channels: {
        nostr: {
          privateKey: TEST_PRIVATE_KEY,
          name: "Bot",
          enabled: true,
          relays: ["wss://relay1", "wss://relay2"],
          dmPolicy: "allowlist" as const,
          allowFrom: ["pubkey1", "pubkey2"],
        },
      },
    };
    const account = resolveNostrAccount({ cfg });

    expect(account.config).toEqual({
      privateKey: TEST_PRIVATE_KEY,
      name: "Bot",
      enabled: true,
      relays: ["wss://relay1", "wss://relay2"],
      dmPolicy: "allowlist",
      allowFrom: ["pubkey1", "pubkey2"],
    });
  });
});
